import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { ProductScan, DailyLog } from '../types/nutrition';

// Local storage keys for caching and offline operations
const STORAGE_KEYS = {
  SCANS_CACHE: 'nutrilense_scans_cache',
  OFFLINE_QUEUE: 'nutrilense_offline_scans_queue',
  SYNC_METADATA: 'nutrilense_sync_metadata',
  DAILY_LOGS_CACHE: 'nutrilense_daily_logs_cache',
};

export interface SyncStatus {
  isOnline: boolean;
  pendingCount: number;
  lastSyncedAt: string | null;
  isSyncing: boolean;
}

export interface QueuedOfflineScan {
  scan: ProductScan;
  queuedAt: string;
  retryCount: number;
  targetUserId: string;
}

type SyncStatusListener = (status: SyncStatus) => void;

/**
 * Data Management Service with Firestore integration and offline/online synchronization.
 * Handles user scan history, local caching, offline write queuing, and automatic sync.
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private isOnlineState: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private isSyncing: boolean = false;
  private lastSyncedAt: string | null = null;
  private statusListeners: Set<SyncStatusListener> = new Set();

  private constructor() {
    this.initNetworkListeners();
    this.loadLastSyncedAt();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // =========================================================================
  // Network and Sync Status
  // =========================================================================

  private initNetworkListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnlineState = true;
      this.notifyStatusListeners();
      // Auto-trigger sync when recovering connectivity
      setTimeout(() => {
        this.syncPendingScans().catch((err) =>
          console.warn('[DatabaseService] Auto-sync after online event error:', err)
        );
      }, 1000);
    });

    window.addEventListener('offline', () => {
      this.isOnlineState = false;
      this.notifyStatusListeners();
    });
  }

  private loadLastSyncedAt(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      const meta = localStorage.getItem(STORAGE_KEYS.SYNC_METADATA);
      if (meta) {
        const parsed = JSON.parse(meta);
        this.lastSyncedAt = parsed.lastSyncedAt || null;
      }
    } catch {
      // Ignore parse errors
    }
  }

  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : this.isOnlineState;
  }

  public getSyncStatus(): SyncStatus {
    const queue = this.getOfflineQueue();
    return {
      isOnline: this.isOnline(),
      pendingCount: queue.length,
      lastSyncedAt: this.lastSyncedAt,
      isSyncing: this.isSyncing,
    };
  }

  public onSyncStatusChange(listener: SyncStatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.getSyncStatus());
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private notifyStatusListeners(): void {
    const status = this.getSyncStatus();
    this.statusListeners.forEach((listener) => {
      try {
        listener(status);
      } catch (err) {
        console.error('[DatabaseService] Error in status listener:', err);
      }
    });
  }

  // =========================================================================
  // Offline Queue & Cache Storage
  // =========================================================================

  private getOfflineQueue(): QueuedOfflineScan[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveOfflineQueue(queue: QueuedOfflineScan[]): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
      this.notifyStatusListeners();
    } catch (e) {
      console.warn('[DatabaseService] Failed to write offline queue:', e);
    }
  }

  private enqueueOfflineScan(scan: ProductScan, userId: string): void {
    const queue = this.getOfflineQueue();
    // Avoid duplicate scans in queue
    const filtered = queue.filter((item) => item.scan.id !== scan.id);
    filtered.push({
      scan,
      queuedAt: new Date().toISOString(),
      retryCount: 0,
      targetUserId: userId,
    });
    this.saveOfflineQueue(filtered);
  }

  private getScansCache(): ProductScan[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(STORAGE_KEYS.SCANS_CACHE);
      if (raw) return JSON.parse(raw);

      // Fallback to legacy local adapter key if cache empty
      const legacy = localStorage.getItem('nutrilense_scans');
      return legacy ? JSON.parse(legacy) : [];
    } catch {
      return [];
    }
  }

  private saveScansCache(scans: ProductScan[]): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEYS.SCANS_CACHE, JSON.stringify(scans));
      // Keep legacy in sync for backward compatibility
      localStorage.setItem('nutrilense_scans', JSON.stringify(scans));
    } catch (e) {
      console.warn('[DatabaseService] Failed to write scans cache:', e);
    }
  }

  // =========================================================================
  // Scans Management (Firestore + Offline/Online)
  // =========================================================================

  /**
   * Save a product scan result to Firestore (or offline queue if disconnected).
   * Automatically updates local cache and daily log stats.
   */
  public async saveScan(
    scanData: Omit<ProductScan, 'id' | 'scannedAt'> & { id?: string; scannedAt?: string },
    explicitUserId?: string
  ): Promise<ProductScan> {
    const currentUid = auth.currentUser?.uid;
    const userId = explicitUserId || currentUid || 'user_local';
    const now = scanData.scannedAt || new Date().toISOString();
    const scanId =
      scanData.id && /^[a-zA-Z0-9_\-]+$/.test(scanData.id)
        ? scanData.id
        : `scan_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Build normalized, validated ProductScan object matching Firestore security rules
    const fullScan: ProductScan = {
      ...scanData,
      id: scanId,
      userId,
      barcode: scanData.barcode || 'N/A',
      productName: (scanData.productName || 'Produto sem nome').slice(0, 200),
      brand: scanData.brand || 'Marca desconhecida',
      healthScore: Math.min(100, Math.max(0, Math.round(scanData.healthScore ?? 50))),
      nutriScore: scanData.nutriScore || 'C',
      novaGroup: scanData.novaGroup || 3,
      novaDescription: scanData.novaDescription || 'Processado',
      macronutrients: scanData.macronutrients || {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        totalFat: 0,
        saturatedFat: 0,
        transFat: 0,
        dietaryFiber: 0,
        sodium: 0,
        sugar: 0,
      },
      ingredientsText: (scanData.ingredientsText || '').slice(0, 5000),
      beneficialSubstances: scanData.beneficialSubstances || [],
      harmfulSubstances: scanData.harmfulSubstances || [],
      additives: scanData.additives || [],
      triggeredAlerts: scanData.triggeredAlerts || [],
      suggestedSwaps: scanData.suggestedSwaps || [],
      scannedAt: now,
    };

    // Always update local cache immediately (Optimistic UI)
    const currentCache = this.getScansCache();
    const updatedCache = [fullScan, ...currentCache.filter((s) => s.id !== scanId)];
    this.saveScansCache(updatedCache);

    // If user is offline or not authenticated with Firebase, queue offline
    const isOnline = this.isOnline();
    const isAuthenticated = Boolean(currentUid && userId === currentUid);

    if (!isOnline || !isAuthenticated) {
      if (isAuthenticated) {
        this.enqueueOfflineScan(fullScan, userId);
      }
      return fullScan;
    }

    // Try saving to Firestore
    const path = `users/${userId}/scans/${scanId}`;
    try {
      const scanDocRef = doc(db, 'users', userId, 'scans', scanId);
      await setDoc(scanDocRef, fullScan);

      // Update daily logs in Firestore
      const today = now.split('T')[0];
      await this.updateDailyLog(userId, today, fullScan);

      // Record successful sync
      this.lastSyncedAt = new Date().toISOString();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          STORAGE_KEYS.SYNC_METADATA,
          JSON.stringify({ lastSyncedAt: this.lastSyncedAt })
        );
      }
      this.notifyStatusListeners();

      return fullScan;
    } catch (error) {
      console.warn(
        `[DatabaseService] Firestore save failed for ${path}, saving to offline queue:`,
        error
      );
      // Queue for background retry
      this.enqueueOfflineScan(fullScan, userId);
      return fullScan;
    }
  }

  /**
   * Retrieves scan history. Merges Firestore data with local offline cache & pending items.
   */
  public async getScanHistory(explicitUserId?: string): Promise<ProductScan[]> {
    const currentUid = auth.currentUser?.uid;
    const userId = explicitUserId || currentUid;

    // Start with current local cache
    const cachedScans = this.getScansCache();
    const offlineQueue = this.getOfflineQueue();
    const pendingScans = offlineQueue.map((item) => item.scan);

    // Merge cached scans with any pending items not yet in cache
    const mergedLocalMap = new Map<string, ProductScan>();
    [...pendingScans, ...cachedScans].forEach((scan) => {
      mergedLocalMap.set(scan.id, scan);
    });

    if (!this.isOnline() || !userId) {
      return Array.from(mergedLocalMap.values()).sort(
        (a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
      );
    }

    // Attempt to fetch fresh from Firestore
    try {
      const scansRef = collection(db, 'users', userId, 'scans');
      const q = query(scansRef, orderBy('scannedAt', 'desc'));
      const snapshot = await getDocs(q);

      const firestoreScans: ProductScan[] = [];
      snapshot.forEach((docSnap) => {
        firestoreScans.push(docSnap.data() as ProductScan);
      });

      // Merge Firestore scans with any local pending queue items
      firestoreScans.forEach((scan) => {
        mergedLocalMap.set(scan.id, scan);
      });

      const finalScans = Array.from(mergedLocalMap.values()).sort(
        (a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
      );

      // Update local cache
      this.saveScansCache(finalScans);
      this.lastSyncedAt = new Date().toISOString();
      this.notifyStatusListeners();

      return finalScans;
    } catch (error) {
      console.warn('[DatabaseService] Failed to fetch from Firestore, returning local cache:', error);
      return Array.from(mergedLocalMap.values()).sort(
        (a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
      );
    }
  }

  /**
   * Get a single scan by ID.
   */
  public async getScanById(scanId: string, explicitUserId?: string): Promise<ProductScan | null> {
    const currentUid = auth.currentUser?.uid;
    const userId = explicitUserId || currentUid;

    // Check local cache first
    const cached = this.getScansCache().find((s) => s.id === scanId);
    if (cached) return cached;

    if (!this.isOnline() || !userId) return null;

    try {
      const docRef = doc(db, 'users', userId, 'scans', scanId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as ProductScan;
      }
      return null;
    } catch (error) {
      console.warn(`[DatabaseService] Failed to get scan ${scanId} from Firestore:`, error);
      return null;
    }
  }

  /**
   * Delete a scan by ID from Firestore, local cache, and offline queue.
   */
  public async deleteScan(scanId: string, explicitUserId?: string): Promise<boolean> {
    const currentUid = auth.currentUser?.uid;
    const userId = explicitUserId || currentUid;

    // Remove from local cache
    const updatedCache = this.getScansCache().filter((s) => s.id !== scanId);
    this.saveScansCache(updatedCache);

    // Remove from offline queue
    const updatedQueue = this.getOfflineQueue().filter((item) => item.scan.id !== scanId);
    this.saveOfflineQueue(updatedQueue);

    if (!this.isOnline() || !userId) {
      return true;
    }

    // Remove from Firestore
    const path = `users/${userId}/scans/${scanId}`;
    try {
      const docRef = doc(db, 'users', userId, 'scans', scanId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
      return false;
    }
  }

  /**
   * Real-time subscription to user scans with automatic cache update and offline fallback.
   */
  public subscribeToScans(
    userId: string,
    callback: (scans: ProductScan[]) => void
  ): Unsubscribe {
    // Deliver immediate cached content
    const cached = this.getScansCache();
    callback(cached);

    if (!userId) {
      return () => {};
    }

    try {
      const scansRef = collection(db, 'users', userId, 'scans');
      const q = query(scansRef, orderBy('scannedAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const firestoreScans: ProductScan[] = [];
          snapshot.forEach((d) => {
            firestoreScans.push(d.data() as ProductScan);
          });

          // Merge with any pending items
          const queue = this.getOfflineQueue();
          const pending = queue.map((qItem) => qItem.scan);
          const map = new Map<string, ProductScan>();

          [...pending, ...firestoreScans].forEach((scan) => {
            map.set(scan.id, scan);
          });

          const result = Array.from(map.values()).sort(
            (a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
          );

          this.saveScansCache(result);
          callback(result);
        },
        (error) => {
          console.warn('[DatabaseService] Firestore onSnapshot error:', error);
          // Keep serving cached data
          callback(this.getScansCache());
        }
      );

      return unsubscribe;
    } catch (error) {
      console.warn('[DatabaseService] Could not establish Firestore onSnapshot:', error);
      return () => {};
    }
  }

  /**
   * Synchronizes queued offline scans to Firestore.
   */
  public async syncPendingScans(
    explicitUserId?: string
  ): Promise<{ synced: number; failed: number }> {
    if (this.isSyncing || !this.isOnline()) {
      return { synced: 0, failed: 0 };
    }

    const currentUid = auth.currentUser?.uid;
    const userId = explicitUserId || currentUid;
    if (!userId) {
      return { synced: 0, failed: 0 };
    }

    const queue = this.getOfflineQueue();
    if (queue.length === 0) {
      return { synced: 0, failed: 0 };
    }

    this.isSyncing = true;
    this.notifyStatusListeners();

    let syncedCount = 0;
    let failedCount = 0;
    const remainingQueue: QueuedOfflineScan[] = [];

    for (const item of queue) {
      const scan = item.scan;
      const targetUser: string = item.targetUserId || userId;

      // Only sync if targeting the currently authenticated user
      if (targetUser !== userId) {
        remainingQueue.push(item);
        continue;
      }

      try {
        const scanDocRef = doc(db, 'users', userId, 'scans', scan.id);
        await setDoc(scanDocRef, scan);

        // Update daily log
        const date = (scan.scannedAt || new Date().toISOString()).split('T')[0];
        await this.updateDailyLog(userId, date, scan);

        syncedCount++;
      } catch (err) {
        console.warn(`[DatabaseService] Failed to sync scan ${scan.id}:`, err);
        failedCount++;
        remainingQueue.push({
          ...item,
          retryCount: item.retryCount + 1,
        });
      }
    }

    this.saveOfflineQueue(remainingQueue);
    this.isSyncing = false;
    this.lastSyncedAt = new Date().toISOString();

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        STORAGE_KEYS.SYNC_METADATA,
        JSON.stringify({ lastSyncedAt: this.lastSyncedAt })
      );
    }

    this.notifyStatusListeners();
    return { synced: syncedCount, failed: failedCount };
  }

  // =========================================================================
  // Daily Log Aggregation Helper
  // =========================================================================

  private async updateDailyLog(userId: string, date: string, newScan: ProductScan): Promise<void> {
    try {
      const logDocRef = doc(db, 'users', userId, 'dailyLogs', date);
      const snapshot = await getDoc(logDocRef);

      const macros = newScan.macronutrients || {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        totalFat: 0,
        sodium: 0,
      };

      if (snapshot.exists()) {
        const current = snapshot.data();
        await setDoc(
          logDocRef,
          {
            date,
            totalCalories: (current.totalCalories || 0) + (macros.calories || 0),
            totalProtein: (current.totalProtein || 0) + (macros.protein || 0),
            totalCarbs: (current.totalCarbs || 0) + (macros.carbohydrates || 0),
            totalFat: (current.totalFat || 0) + (macros.totalFat || 0),
            totalSodium: (current.totalSodium || 0) + (macros.sodium || 0),
            scanCount: (current.scanCount || 0) + 1,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } else {
        await setDoc(logDocRef, {
          date,
          totalCalories: macros.calories || 0,
          totalProtein: macros.protein || 0,
          totalCarbs: macros.carbohydrates || 0,
          totalFat: macros.totalFat || 0,
          totalSodium: macros.sodium || 0,
          scanCount: 1,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('[DatabaseService] Failed to update dailyLog in Firestore:', e);
    }
  }
}

// Singleton export
export const dbService = DatabaseService.getInstance();

// Functional helpers for convenience
export const saveUserScan = (
  scanData: Omit<ProductScan, 'id' | 'scannedAt'> & { id?: string; scannedAt?: string },
  userId?: string
) => dbService.saveScan(scanData, userId);

export const getUserScans = (userId?: string) => dbService.getScanHistory(userId);

export const deleteUserScan = (scanId: string, userId?: string) =>
  dbService.deleteScan(scanId, userId);

export const getScanById = (scanId: string, userId?: string) =>
  dbService.getScanById(scanId, userId);

export const subscribeToScans = (
  userId: string,
  callback: (scans: ProductScan[]) => void
) => dbService.subscribeToScans(userId, callback);

export const syncOfflineScans = (userId?: string) => dbService.syncPendingScans(userId);

export const getDatabaseSyncStatus = () => dbService.getSyncStatus();

export default dbService;
