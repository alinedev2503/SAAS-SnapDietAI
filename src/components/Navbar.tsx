import React from 'react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { Camera, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenScanner }) => {
  const { config, demoScanCount } = useWhiteLabel();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
        >
          <span className="text-2xl">{config.logoEmoji}</span>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {config.appName}
          </span>
        </button>

        {/* Zone 2: Navigation Links (Clean unboxed text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('landing')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
              activeTab === 'landing' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Início
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
              activeTab === 'history' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Histórico & Diário
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
              activeTab === 'reports' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Relatórios PDF
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Perfil & Restrições
          </button>
        </nav>

        {/* Zone 3: Primary Action & PWA Download Button */}
        <div className="flex items-center gap-2.5">
          <PWAInstallButton />

          <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-mono text-slate-600 dark:text-slate-400">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            {demoScanCount}/{config.demoMaxScans} Scans
          </span>

          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Escanear Rótulo</span>
            <span className="sm:hidden">Escanear</span>
          </button>
        </div>

      </div>
    </header>
  );
};
