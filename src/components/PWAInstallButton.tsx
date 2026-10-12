import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from './Tooltip';

interface PWAInstallButtonProps {
  iconOnly?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ iconOnly = false }) => {
  const { t } = useTranslation();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, suppress button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    const btn = (
      <button
        onClick={install}
        className={`${
          iconOnly
            ? 'p-2 sm:p-2.5 w-9 h-9 sm:w-10 sm:h-10 justify-center'
            : 'px-3.5 py-1.5'
        } text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 border border-emerald-300/60 dark:border-emerald-800/80 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95`}
        aria-label={t('pwa.installApp', 'Instalar aplicativo PWA')}
      >
        <Download className="w-4 h-4 text-emerald-600 shrink-0" />
        {!iconOnly && <span>{t('pwa.installApp', 'Instalar App')}</span>}
      </button>
    );

    return iconOnly ? <Tooltip content={t('navbar.pwaTooltip', 'Instalar aplicativo (PWA)')}>{btn}</Tooltip> : btn;
  }

  // iOS Safari flow
  if (isIOS) {
    const iosBtn = (
      <button
        onClick={() => setShowIOSGuide(true)}
        className={`${
          iconOnly
            ? 'p-2 sm:p-2.5 w-9 h-9 sm:w-10 sm:h-10 justify-center'
            : 'px-3.5 py-1.5'
        } text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 border border-emerald-300/60 dark:border-emerald-800/80 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95`}
        aria-label={t('pwa.installIOS', 'Instalar no iOS')}
      >
        <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
        {!iconOnly && <span>{t('pwa.installIOS', 'Instalar no iOS')}</span>}
      </button>
    );

    return (
      <>
        {iconOnly ? <Tooltip content={t('pwa.installTitle', 'Instalar no iPhone / iPad')}>{iosBtn}</Tooltip> : iosBtn}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-4 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">{t('pwa.installTitle', 'Instalar no iPhone / iPad')}</h3>
                  <p className="text-xs text-slate-500">{t('pwa.installSubtitle', 'Siga as instruções do Safari')}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('pwa.step1')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('pwa.step2')}</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                {t('pwa.understood', 'Entendido')}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Generic desktop PWA install trigger fallback
  const genericBtn = (
    <button
      onClick={() => {
        alert(t('pwa.genericAlert', 'Para instalar o NutriLense AI como App: clique nos três pontos (...) no canto do seu navegador (Chrome/Edge/Brave) e selecione "Instalar NutriLense AI" ou "Adicionar à Tela Inicial".'));
      }}
      className={`${
        iconOnly
          ? 'p-2 sm:p-2.5 w-9 h-9 sm:w-10 sm:h-10 justify-center'
          : 'px-3 py-1.5'
      } text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-95`}
      aria-label={t('pwa.installApp', 'Instalar Aplicativo PWA')}
    >
      <Download className="w-4 h-4 text-emerald-600 shrink-0" />
      {!iconOnly && <span>{t('pwa.installApp', 'Instalar App')}</span>}
    </button>
  );

  return iconOnly ? <Tooltip content={t('navbar.pwaTooltip', 'Instalar aplicativo (PWA)')}>{genericBtn}</Tooltip> : genericBtn;
};
