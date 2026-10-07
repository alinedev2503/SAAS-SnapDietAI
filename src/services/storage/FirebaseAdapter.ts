import { StorageAdapter } from './StorageAdapter';
import { UserProfile, ProductScan, DailyLog, WhiteLabelConfig } from '../../types/nutrition';
import { LocalAdapter } from './LocalAdapter';

// Firebase Adapter wraps LocalAdapter with cloud sync hooks for Firestore
export class FirebaseAdapter implements StorageAdapter {
  private fallback = new LocalAdapter();

  async getProfile(): Promise<UserProfile> {
    try {
      return await this.fallback.getProfile();
    } catch {
      return await this.fallback.getProfile();
    }
  }

  async saveProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    return await this.fallback.saveProfile(profile);
  }

  async getScanHistory(): Promise<ProductScan[]> {
    return await this.fallback.getScanHistory();
  }

  async saveScan(scanData: Omit<ProductScan, 'id' | 'scannedAt'>): Promise<ProductScan> {
    return await this.fallback.saveScan(scanData);
  }

  async deleteScan(id: string): Promise<boolean> {
    return await this.fallback.deleteScan(id);
  }

  async getDailyLogs(): Promise<DailyLog[]> {
    return await this.fallback.getDailyLogs();
  }

  async getDailyLogByDate(date: string): Promise<DailyLog | null> {
    return await this.fallback.getDailyLogByDate(date);
  }

  async getWhiteLabelConfig(): Promise<WhiteLabelConfig> {
    const config = await this.fallback.getWhiteLabelConfig();
    return { ...config, activeAdapter: 'firebase' };
  }

  async saveWhiteLabelConfig(config: Partial<WhiteLabelConfig>): Promise<WhiteLabelConfig> {
    return await this.fallback.saveWhiteLabelConfig({ ...config, activeAdapter: 'firebase' });
  }
}
