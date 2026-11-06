import React, { useState, useRef, useEffect } from 'react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { Camera, Sparkles, Globe, ChevronDown, Check } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { GoogleAuthButton } from './GoogleAuthButton';
import { Tooltip } from './Tooltip';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'pt-BR', label: 'Português', short: 'PT', flag: '🇧🇷' },
    { code: 'en-US', label: 'English', short: 'EN', flag: '🇺🇸' },
    { code: 'es', label: 'Español', short: 'ES', flag: '🇪🇸' },
  ];

  const currentLang =
    languages.find((l) => l.code === i18n.language || i18n.language?.startsWith(l.code.split('-')[0])) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip content={`${t('navbar.languageTooltip', 'Alterar idioma')}: ${currentLang.label}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={`${t('navbar.languageTooltip', 'Alterar idioma')}: ${currentLang.label}`}
          className="flex items-center justify-center gap-1 p-2 sm:px-2.5 sm:py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 rounded-xl transition-colors text-xs font-semibold border border-slate-200/80 dark:border-slate-700/80 cursor-pointer active:scale-95 shadow-xs"
        >
          <span className="text-sm leading-none">{currentLang.flag}</span>
          <ChevronDown
            className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-emerald-500' : ''
            }`}
          />
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('navbar.languageTooltip', 'Idioma')}
          </div>
          {languages.map((lang) => {
            const isSelected = lang.code === currentLang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm leading-none">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenScanner }) => {
  const { config, demoScanCount } = useWhiteLabel();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">

        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none shrink-0"
        >
          <span className="text-2xl">{config.logoEmoji}</span>
          <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {config.appName && config.appName !== 'NutriLense AI' ? config.appName : 'SnapDiet'}
          </span>
        </button>

        {/* Zone 2: Navigation Links (Clean unboxed text links) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('landing')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
              activeTab === 'landing' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            {t('navbar.home')}
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'budget' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-300/60 dark:border-amber-800/60 flex items-center gap-1">
              <span>🏷️</span>
              <span>{t('navbar.cheapMarket', 'Mercado Barato')}</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
              activeTab === 'history' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            {t('navbar.history')}
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
              activeTab === 'reports' ? 'text-emerald-600 dark:hover:text-emerald-400 font-semibold' : ''
            }`}
          >
            {t('navbar.reports')}
          </button>
          <button
            onClick={() => setActiveTab('nutritionists')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'nutritionists' ? 'text-emerald-600 dark:hover:text-emerald-400 font-semibold' : ''
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t('navbar.nutritionists')}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            {t('navbar.profile')}
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Utilities (Language, PWA, Google Auth, Scan with Camera Icon & Tooltips) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language selector (compact flag icon dropdown with tooltip) */}
          <LanguageSwitcher />

          {/* PWA Install Button (icon only on small/medium screens with tooltip) */}
          <div className="hidden sm:block">
            <PWAInstallButton iconOnly />
          </div>

          {/* Google Auth Button (icon only on small/medium screens with tooltip) */}
          <GoogleAuthButton
            iconOnly
            onNavigateToProfile={() => setActiveTab('profile')}
          />

          {/* Scan counter badge */}
          <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-mono text-slate-600 dark:text-slate-400">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            {demoScanCount}/{config.demoMaxScans} {t('navbar.scans')}
          </span>

          {/* Scan label button: Camera icon only with tooltip */}
          <Tooltip content={t('navbar.scanTooltip', 'Escanear rótulo de produto')}>
            <button
              onClick={onOpenScanner}
              aria-label={t('navbar.scanTooltip', 'Escanear rótulo de produto')}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </Tooltip>
        </div>

      </div>
    </header>
  );
};
