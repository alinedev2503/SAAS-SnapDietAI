import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Zap, CreditCard, Lock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWhiteLabel } from '../context/WhiteLabelContext';

interface DemoLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: () => void;
}

export const DemoLimitModal: React.FC<DemoLimitModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const { t } = useTranslation();
  const { config, currentPlan, demoScanCount, subscribeStripePlan } = useWhiteLabel();
  const [subscribing, setSubscribing] = useState<'pro' | 'plus' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (plan: 'pro' | 'plus') => {
    setSubscribing(plan);
    setMessage(null);
    try {
      const res = await subscribeStripePlan(plan);
      if (res.message) {
        setMessage(res.message);
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } finally {
      setSubscribing(null);
    }
  };

  const limitReached = currentPlan === 'plus' ? 60 : currentPlan === 'pro' ? 20 : 2;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 text-center p-6 sm:p-8 space-y-6 relative max-h-[95vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <Zap className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {currentPlan === 'plus' || currentPlan === 'pro'
              ? t('modals.demoLimit.monthlyReached')
              : t('modals.demoLimit.demoReached')}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {t('modals.demoLimit.limitTitle', {
              limit: limitReached,
              period: currentPlan === 'free' ? t('modals.demoLimit.freePeriod') : t('modals.demoLimit.monthPeriod'),
            })}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            {currentPlan === 'pro'
              ? t('modals.demoLimit.descPro')
              : t('modals.demoLimit.descFree')}
          </p>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* 2 Upgrade Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          
          {/* Pro Card */}
          <div className={`p-4 rounded-2xl border transition-all ${currentPlan === 'pro' ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {t('modals.demoLimit.proTitle')}
            </span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {t('modals.demoLimit.proPrice')}{' '}
              <span className="text-[11px] font-normal text-slate-500">{t('modals.demoLimit.proPeriod')}</span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              {t('modals.demoLimit.proSub')}
            </p>
            <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 mt-2">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> {t('modals.demoLimit.pro1')}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> {t('modals.demoLimit.pro2')}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> {t('modals.demoLimit.pro3')}</li>
            </ul>
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={subscribing !== null || currentPlan === 'pro'}
              className="mt-3 w-full py-2 bg-slate-900 dark:bg-slate-100 hover:opacity-90 text-white dark:text-slate-900 font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {subscribing === 'pro' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
              <span>{currentPlan === 'pro' ? t('modals.demoLimit.proCurrent') : t('modals.demoLimit.proSubscribe')}</span>
            </button>
          </div>

          {/* Plus Card */}
          <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/50 shadow-md relative overflow-hidden">
            <span className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
              {t('modals.demoLimit.plusBadge')}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              {t('modals.demoLimit.plusTitle')}
            </span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {t('modals.demoLimit.plusPrice')}{' '}
              <span className="text-[11px] font-normal text-slate-500">{t('modals.demoLimit.plusPeriod')}</span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
              {t('modals.demoLimit.plusSub')}
            </p>
            <ul className="text-[11px] text-slate-700 dark:text-slate-200 space-y-1 mt-2">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> {t('modals.demoLimit.plus1')}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> {t('modals.demoLimit.plus2')}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> {t('modals.demoLimit.plus3')}</li>
            </ul>
            <button
              onClick={() => handleUpgrade('plus')}
              disabled={subscribing !== null || currentPlan === 'plus'}
              className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {subscribing === 'plus' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{currentPlan === 'plus' ? t('modals.demoLimit.plusCurrent') : t('modals.demoLimit.plusSubscribe')}</span>
            </button>
          </div>

        </div>

        <div className="pt-2 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>{t('modals.demoLimit.secureStripe')}</span>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium cursor-pointer"
          >
            {t('modals.demoLimit.continueBrowsing')}
          </button>
        </div>

      </div>
    </div>
  );
};
