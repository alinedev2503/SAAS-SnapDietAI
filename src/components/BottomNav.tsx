import React from 'react';
import { Camera, Home, Calendar, MapPin, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenScanner: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onOpenScanner }) => {
  const { t } = useTranslation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        
        <button
          onClick={() => setActiveTab('landing')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors ${
            activeTab === 'landing' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">{t('navbar.home')}</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors ${
            activeTab === 'history' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">{t('navbar.diary', 'Diário')}</span>
        </button>

        {/* Central Prominent Camera Button */}
        <div className="flex justify-center -mt-5">
          <button
            onClick={onOpenScanner}
            className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform cursor-pointer"
            aria-label={t('navbar.scanAria', 'Escanear Rótulo')}
          >
            <Camera className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={() => setActiveTab('nutritionists')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors ${
            activeTab === 'nutritionists' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">{t('navbar.nutritionists')}</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer transition-colors ${
            activeTab === 'profile' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">{t('navbar.profile')}</span>
        </button>

      </div>
    </nav>
  );
};
