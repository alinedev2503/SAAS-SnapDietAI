import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ProductScan, WhiteLabelConfig, DailyLog } from '../types/nutrition';
import { AdapterFactory } from '../services/storage/AdapterFactory';

interface WhiteLabelContextType {
  config: WhiteLabelConfig;
  profile: UserProfile;
  history: ProductScan[];
  dailyLogs: DailyLog[];
  demoScanCount: number;
  showDemoModal: boolean;
  isLoading: boolean;
  updateConfig: (newConfig: Partial<WhiteLabelConfig>) => Promise<void>;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
  addScan: (scan: Omit<ProductScan, 'id' | 'scannedAt'>) => Promise<ProductScan | null>;
  removeScan: (id: string) => Promise<void>;
  closeDemoModal: () => void;
  refreshData: () => Promise<void>;
}

const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(undefined);

export const WhiteLabelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<WhiteLabelConfig>({
    appName: 'NutriLense AI',
    primaryColor: '#059669',
    logoEmoji: '🥗',
    activeAdapter: 'local',
    demoMaxScans: 2,
  });

  const [profile, setProfile] = useState<UserProfile>({
    id: 'user_1',
    name: 'Aline Oliveira',
    email: 'contatoalinedev@gmail.com',
    dietaryRestrictions: ['lactose', 'sodium'],
    targetCalories: 2000,
    targetProtein: 120,
    targetCarbs: 220,
    targetFat: 65,
    targetSodium: 2000,
    createdAt: new Date().toISOString(),
  });

  const [history, setHistory] = useState<ProductScan[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [demoScanCount, setDemoScanCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('nutrilense_demo_count') || '0', 10);
  });
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const adapter = AdapterFactory.getAdapter(config.activeAdapter);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const activeAdapter = AdapterFactory.getAdapter(config.activeAdapter);
      const conf = await activeAdapter.getWhiteLabelConfig();
      const prof = await activeAdapter.getProfile();
      const hist = await activeAdapter.getScanHistory();
      const logs = await activeAdapter.getDailyLogs();

      setConfig(conf);
      setProfile(prof);
      setHistory(hist);
      setDailyLogs(logs);
    } catch (e) {
      console.error('Error refreshing data from adapter:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [config.activeAdapter]);

  const updateConfig = async (newConfig: Partial<WhiteLabelConfig>) => {
    const updated = await adapter.saveWhiteLabelConfig(newConfig);
    setConfig(updated);
  };

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    const updated = await adapter.saveProfile(newProfile);
    setProfile(updated);
  };

  const addScan = async (scanData: Omit<ProductScan, 'id' | 'scannedAt'>): Promise<ProductScan | null> => {
    // Check demo limit for unauthenticated / trial mode
    if (demoScanCount >= config.demoMaxScans) {
      setShowDemoModal(true);
      return null;
    }

    const saved = await adapter.saveScan(scanData);
    const newCount = demoScanCount + 1;
    setDemoScanCount(newCount);
    localStorage.setItem('nutrilense_demo_count', newCount.toString());

    await refreshData();
    return saved;
  };

  const removeScan = async (id: string) => {
    await adapter.deleteScan(id);
    await refreshData();
  };

  const closeDemoModal = () => {
    setShowDemoModal(false);
  };

  return (
    <WhiteLabelContext.Provider
      value={{
        config,
        profile,
        history,
        dailyLogs,
        demoScanCount,
        showDemoModal,
        isLoading,
        updateConfig,
        updateProfile,
        addScan,
        removeScan,
        closeDemoModal,
        refreshData,
      }}
    >
      {children}
    </WhiteLabelContext.Provider>
  );
};

export const useWhiteLabel = () => {
  const context = useContext(WhiteLabelContext);
  if (!context) throw new Error('useWhiteLabel must be used within a WhiteLabelProvider');
  return context;
};
