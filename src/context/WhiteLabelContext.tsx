import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ProductScan, WhiteLabelConfig, DailyLog, PlanTier } from '../types/nutrition';
import { AdapterFactory } from '../services/storage/AdapterFactory';
import confetti from 'canvas-confetti';

interface WhiteLabelContextType {
  config: WhiteLabelConfig;
  profile: UserProfile;
  history: ProductScan[];
  dailyLogs: DailyLog[];
  demoScanCount: number;
  currentPlan: PlanTier;
  showDemoModal: boolean;
  isLoading: boolean;
  updateConfig: (newConfig: Partial<WhiteLabelConfig>) => Promise<void>;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
  addScan: (scan: Omit<ProductScan, 'id' | 'scannedAt'>) => Promise<ProductScan | null>;
  removeScan: (id: string) => Promise<void>;
  closeDemoModal: () => void;
  openDemoModal: () => void;
  refreshData: () => Promise<void>;
  setPlan: (plan: PlanTier) => Promise<void>;
  subscribeStripePlan: (plan: 'pro' | 'plus') => Promise<{ success: boolean; url?: string; message?: string }>;
}

const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(undefined);

export const WhiteLabelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<WhiteLabelConfig>({
    appName: 'NutriLense AI',
    primaryColor: '#059669',
    logoEmoji: '🥗',
    activeAdapter: 'local',
    demoMaxScans: 2,
    currentPlan: 'free',
  });

  const [currentPlan, setCurrentPlanState] = useState<PlanTier>(() => {
    return (localStorage.getItem('nutrilense_current_plan') as PlanTier) || 'free';
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

      const savedPlan = (localStorage.getItem('nutrilense_current_plan') as PlanTier) || conf.currentPlan || 'free';
      const scanLimit = savedPlan === 'plus' ? 999999 : savedPlan === 'pro' ? 20 : 2;

      setConfig({ ...conf, currentPlan: savedPlan, demoMaxScans: scanLimit });
      setCurrentPlanState(savedPlan);
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

  const setPlan = async (plan: PlanTier) => {
    const scanLimit = plan === 'plus' ? 999999 : plan === 'pro' ? 20 : 2;
    localStorage.setItem('nutrilense_current_plan', plan);
    setCurrentPlanState(plan);
    const updated = await adapter.saveWhiteLabelConfig({ currentPlan: plan, demoMaxScans: scanLimit });
    setConfig(updated);
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } catch (_) {}
  };

  const subscribeStripePlan = async (plan: 'pro' | 'plus'): Promise<{ success: boolean; url?: string; message?: string }> => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan,
          customerEmail: profile.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Real Stripe Checkout redirect if live URL returned
        window.location.href = data.url;
        return { success: true, url: data.url };
      }

      // Test / Sandbox mode instant activation
      await setPlan(plan);
      return {
        success: true,
        message: data.message || `Plano ${plan === 'plus' ? 'Plus (Ilimitado)' : 'Pro (20 Scans)'} ativado com sucesso!`,
      };
    } catch (err: any) {
      console.warn('Stripe checkout error, fallback to simulated activation:', err);
      await setPlan(plan);
      return {
        success: true,
        message: `Plano ${plan === 'plus' ? 'Plus (Ilimitado)' : 'Pro (20 Scans)'} ativado em modo sandbox.`,
      };
    }
  };

  const updateConfig = async (newConfig: Partial<WhiteLabelConfig>) => {
    const updated = await adapter.saveWhiteLabelConfig(newConfig);
    setConfig(updated);
  };

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    const updated = await adapter.saveProfile(newProfile);
    setProfile(updated);
  };

  const addScan = async (scanData: Omit<ProductScan, 'id' | 'scannedAt'>): Promise<ProductScan | null> => {
    const limit = currentPlan === 'plus' ? 999999 : currentPlan === 'pro' ? 20 : 2;

    if (demoScanCount >= limit) {
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

  const openDemoModal = () => {
    setShowDemoModal(true);
  };

  return (
    <WhiteLabelContext.Provider
      value={{
        config,
        profile,
        history,
        dailyLogs,
        demoScanCount,
        currentPlan,
        showDemoModal,
        isLoading,
        updateConfig,
        updateProfile,
        addScan,
        removeScan,
        closeDemoModal,
        openDemoModal,
        refreshData,
        setPlan,
        subscribeStripePlan,
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
