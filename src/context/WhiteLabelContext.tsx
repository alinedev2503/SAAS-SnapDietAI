import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ProductScan, WhiteLabelConfig, DailyLog, PlanTier } from '../types/nutrition';
import { AdapterFactory } from '../services/storage/AdapterFactory';
import { auth, loginWithGoogle, logoutUser, onAuthStateChanged } from '../services/firebase';
import { User } from 'firebase/auth';
import confetti from 'canvas-confetti';

interface WhiteLabelContextType {
  config: WhiteLabelConfig;
  profile: UserProfile;
  history: ProductScan[];
  dailyLogs: DailyLog[];
  demoScanCount: number;
  maxFreeTests: number;
  remainingScans: number;
  canRunScan: boolean;
  currentPlan: PlanTier;
  showDemoModal: boolean;
  isLoading: boolean;
  currentUser: User | null;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateConfig: (newConfig: Partial<WhiteLabelConfig>) => Promise<void>;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
  addScan: (scan: Omit<ProductScan, 'id' | 'scannedAt'>) => Promise<ProductScan | null>;
  removeScan: (id: string) => Promise<void>;
  closeDemoModal: () => void;
  openDemoModal: () => void;
  refreshData: () => Promise<void>;
  setPlan: (plan: PlanTier) => Promise<void>;
  subscribeStripePlan: (plan: 'pro' | 'plus') => Promise<{ success: boolean; url?: string; message?: string }>;
  deleteAccount: () => Promise<void>;
  isUS: boolean;
}

const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(undefined);

export const WhiteLabelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const [config, setConfig] = useState<WhiteLabelConfig>({
    appName: 'SnapDiet',
    primaryColor: '#059669',
    logoEmoji: '🥗',
    activeAdapter: 'firebase',
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
  const [isUS] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone.startsWith('America/'));

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const activeAdapter = AdapterFactory.getAdapter(config.activeAdapter);
      const conf = await activeAdapter.getWhiteLabelConfig();
      const prof = await activeAdapter.getProfile();
      const hist = await activeAdapter.getScanHistory();
      const logs = await activeAdapter.getDailyLogs();

      const savedPlan = (localStorage.getItem('nutrilense_current_plan') as PlanTier) || conf.currentPlan || 'free';
      const scanLimit = savedPlan === 'plus' ? 60 : savedPlan === 'pro' ? 20 : 2;

      const appName = (!conf.appName || conf.appName === 'NutriLense AI') ? 'SnapDiet' : conf.appName;
      setConfig({ ...conf, appName, currentPlan: savedPlan, demoMaxScans: scanLimit });
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      setIsAuthLoading(false);
      if (firebaseUser) {
        setConfig((prev) => ({ ...prev, activeAdapter: 'firebase' }));
        const activeAdapter = AdapterFactory.getAdapter('firebase');
        try {
          const prof = await activeAdapter.getProfile();
          setProfile(prof);
          const hist = await activeAdapter.getScanHistory();
          setHistory(hist);
          const logs = await activeAdapter.getDailyLogs();
          setDailyLogs(logs);
        } catch (e) {
          console.warn('[Firebase] Erro ao sincronizar dados iniciais do usuário:', e);
        }
      } else {
        refreshData();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    refreshData();
  }, [config.activeAdapter]);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const user = await loginWithGoogle();
      setCurrentUser(user);
      setConfig((prev) => ({ ...prev, activeAdapter: 'firebase' }));
      await refreshData();
      try {
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
      } catch (_) {}
    } catch (e: any) {
      if (e?.code !== 'auth/popup-closed-by-user' && e?.code !== 'auth/cancelled-popup-request') {
        console.error('Erro ao autenticar com Google:', e);
        throw e;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      await refreshData();
    } catch (e) {
      console.error('Erro ao desconectar usuário:', e);
    }
  };

  const setPlan = async (plan: PlanTier) => {
    const scanLimit = plan === 'plus' ? 60 : plan === 'pro' ? 20 : 2;
    localStorage.setItem('nutrilense_current_plan', plan);
    setCurrentPlanState(plan);
    const adapter = AdapterFactory.getAdapter(config.activeAdapter);
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
          customerEmail: profile.email || currentUser?.email || 'contato@snapdiet.app',
          isUS,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
        return { success: true, url: data.url };
      }

      await setPlan(plan);
      return {
        success: true,
        message: data.message || `Plano ${plan === 'plus' ? 'Plus (60 Scans no mês)' : 'Pro (20 Scans no mês)'} ativado com sucesso!`,
      };
    } catch (err: any) {
      console.warn('Stripe checkout error, fallback to simulated activation:', err);
      await setPlan(plan);
      return {
        success: true,
        message: `Plano ${plan === 'plus' ? 'Plus (60 Scans no mês)' : 'Pro (20 Scans no mês)'} ativado em modo sandbox.`,
      };
    }
  };

  const updateConfig = async (newConfig: Partial<WhiteLabelConfig>) => {
    const adapter = AdapterFactory.getAdapter(config.activeAdapter);
    const updated = await adapter.saveWhiteLabelConfig(newConfig);
    setConfig(updated);
  };

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    const adapter = AdapterFactory.getAdapter(config.activeAdapter);
    const updated = await adapter.saveProfile(newProfile);
    setProfile(updated);
  };

  const addScan = async (scanData: Omit<ProductScan, 'id' | 'scannedAt'>): Promise<ProductScan | null> => {
    const limit = currentPlan === 'plus' ? 60 : currentPlan === 'pro' ? 20 : 2;

    if (demoScanCount >= limit) {
      setShowDemoModal(true);
      return null;
    }

    const adapter = AdapterFactory.getAdapter(config.activeAdapter);
    const saved = await adapter.saveScan(scanData);
    const newCount = demoScanCount + 1;
    setDemoScanCount(newCount);
    localStorage.setItem('nutrilense_demo_count', newCount.toString());

    await refreshData();
    return saved;
  };

  const removeScan = async (id: string) => {
    const adapter = AdapterFactory.getAdapter(config.activeAdapter);
    await adapter.deleteScan(id);
    await refreshData();
  };

  const closeDemoModal = () => {
    setShowDemoModal(false);
  };

  const openDemoModal = () => {
    setShowDemoModal(true);
  };

  const deleteAccount = async () => {
    try {
      const { deleteAccount: firebaseDeleteAccount } = await import('../lib/firebase');
      await firebaseDeleteAccount();
      setCurrentUser(null);
      await refreshData();
    } catch (e) {
      console.error('Erro ao excluir conta:', e);
      throw e;
    }
  };

  const maxFreeTests = currentPlan === 'plus' ? 60 : currentPlan === 'pro' ? 20 : 2;
  const remainingScans = Math.max(0, maxFreeTests - demoScanCount);
  const canRunScan = demoScanCount < maxFreeTests;

  return (
    <WhiteLabelContext.Provider
      value={{
        config,
        profile,
        history,
        dailyLogs,
        demoScanCount,
        maxFreeTests,
        remainingScans,
        canRunScan,
        currentPlan,
        showDemoModal,
        isLoading,
        currentUser,
        isAuthLoading,
        signInWithGoogle,
        signOut,
        updateConfig,
        updateProfile,
        addScan,
        removeScan,
        closeDemoModal,
        openDemoModal,
        refreshData,
        setPlan,
        subscribeStripePlan,
        deleteAccount,
        isUS,
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
