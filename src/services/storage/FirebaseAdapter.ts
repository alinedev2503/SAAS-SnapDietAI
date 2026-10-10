import { StorageAdapter } from './StorageAdapter';
import { UserProfile, ProductScan, DailyLog, WhiteLabelConfig } from '../../types/nutrition';
import { LocalAdapter } from './LocalAdapter';
import {
  db,
  auth,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { dbService } from '../db';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';

export class FirebaseAdapter implements StorageAdapter {
  private fallback = new LocalAdapter();

  private getEffectiveUserId(): string | null {
    return auth.currentUser?.uid || null;
  }

  async getProfile(): Promise<UserProfile> {
    const userId = this.getEffectiveUserId();
    if (!userId) {
      return await this.fallback.getProfile();
    }

    const path = `users/${userId}`;
    try {
      const docRef = doc(db, 'users', userId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        return {
          ...data,
          id: userId,
          email: data.email || auth.currentUser?.email || 'usuario@nutrilense.ai',
          name: data.name || auth.currentUser?.displayName || 'Usuário NutriLense',
        };
      }

      // If document doesn't exist in Firestore yet, bootstrap with defaults
      const initialProfile: UserProfile = {
        id: userId,
        name: auth.currentUser?.displayName || 'Usuário NutriLense',
        email: auth.currentUser?.email || 'usuario@nutrilense.ai',
        dietaryRestrictions: ['lactose', 'sodium'],
        targetCalories: 2000,
        targetProtein: 120,
        targetCarbs: 220,
        targetFat: 65,
        targetSodium: 2000,
        createdAt: new Date().toISOString(),
      };

      await setDoc(docRef, initialProfile);
      return initialProfile;
    } catch (error) {
      console.warn('[FirebaseAdapter] Falha ao carregar perfil do Firestore, recorrendo ao cache local:', error);
      return await this.fallback.getProfile();
    }
  }

  async saveProfile(newProfile: Partial<UserProfile>): Promise<UserProfile> {
    const userId = this.getEffectiveUserId();
    if (!userId) {
      return await this.fallback.saveProfile(newProfile);
    }

    const path = `users/${userId}`;
    try {
      const current = await this.getProfile();
      const updated: UserProfile = {
        ...current,
        ...newProfile,
        id: userId,
      };

      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, updated, { merge: true });

      // Keep local in sync
      await this.fallback.saveProfile(updated);
      return updated;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async getScanHistory(): Promise<ProductScan[]> {
    const userId = this.getEffectiveUserId();
    return await dbService.getScanHistory(userId || undefined);
  }

  async saveScan(scanData: Omit<ProductScan, 'id' | 'scannedAt'>): Promise<ProductScan> {
    const userId = this.getEffectiveUserId();
    return await dbService.saveScan(scanData, userId || undefined);
  }

  private async updateDailyLog(userId: string, date: string, newScan: ProductScan): Promise<void> {
    const logPath = `users/${userId}/dailyLogs/${date}`;
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
      console.warn('[FirebaseAdapter] Falha ao atualizar dailyLog:', e);
    }
  }

  async deleteScan(id: string): Promise<boolean> {
    const userId = this.getEffectiveUserId();
    return await dbService.deleteScan(id, userId || undefined);
  }

  async getDailyLogs(): Promise<DailyLog[]> {
    const userId = this.getEffectiveUserId();
    if (!userId) {
      return await this.fallback.getDailyLogs();
    }

    try {
      const logsRef = collection(db, 'users', userId, 'dailyLogs');
      const snapshot = await getDocs(logsRef);
      const logs: DailyLog[] = [];
      snapshot.forEach((d) => {
        const val = d.data();
        logs.push({
          date: val.date || d.id,
          scans: [],
          totalCalories: val.totalCalories || 0,
          totalProtein: val.totalProtein || 0,
          totalCarbs: val.totalCarbs || 0,
          totalFat: val.totalFat || 0,
          totalSodium: val.totalSodium || 0,
        });
      });

      if (logs.length === 0) {
        return await this.fallback.getDailyLogs();
      }
      return logs.sort((a, b) => b.date.localeCompare(a.date));
    } catch (e) {
      return await this.fallback.getDailyLogs();
    }
  }

  async getDailyLogByDate(date: string): Promise<DailyLog | null> {
    const userId = this.getEffectiveUserId();
    if (!userId) {
      return await this.fallback.getDailyLogByDate(date);
    }

    try {
      const docRef = doc(db, 'users', userId, 'dailyLogs', date);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const val = snapshot.data();
        return {
          date: val.date || date,
          scans: [],
          totalCalories: val.totalCalories || 0,
          totalProtein: val.totalProtein || 0,
          totalCarbs: val.totalCarbs || 0,
          totalFat: val.totalFat || 0,
          totalSodium: val.totalSodium || 0,
        };
      }
      return await this.fallback.getDailyLogByDate(date);
    } catch (e) {
      return await this.fallback.getDailyLogByDate(date);
    }
  }

  async getWhiteLabelConfig(): Promise<WhiteLabelConfig> {
    const config = await this.fallback.getWhiteLabelConfig();
    return { ...config, activeAdapter: 'firebase' };
  }

  async saveWhiteLabelConfig(config: Partial<WhiteLabelConfig>): Promise<WhiteLabelConfig> {
    return await this.fallback.saveWhiteLabelConfig({ ...config, activeAdapter: 'firebase' });
  }
}
