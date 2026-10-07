import { UserProfile, ProductScan, DailyLog, WhiteLabelConfig } from '../../types/nutrition';

export interface StorageAdapter {
  getProfile(): Promise<UserProfile>;
  saveProfile(profile: Partial<UserProfile>): Promise<UserProfile>;
  
  getScanHistory(): Promise<ProductScan[]>;
  saveScan(scan: Omit<ProductScan, 'id' | 'scannedAt'>): Promise<ProductScan>;
  deleteScan(id: string): Promise<boolean>;
  
  getDailyLogs(): Promise<DailyLog[]>;
  getDailyLogByDate(date: string): Promise<DailyLog | null>;
  
  getWhiteLabelConfig(): Promise<WhiteLabelConfig>;
  saveWhiteLabelConfig(config: Partial<WhiteLabelConfig>): Promise<WhiteLabelConfig>;
}
