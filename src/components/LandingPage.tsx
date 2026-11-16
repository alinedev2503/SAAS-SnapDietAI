import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  Camera,
  Sparkles,
  ShieldCheck,
  FileBarChart,
  Check,
  ArrowRight,
  HeartPulse,
  AlertTriangle,
  Scale,
  RefreshCw,
  Smartphone,
  Award,
  HelpCircle,
  CreditCard,
  Lock,
  Loader2,
  CheckCircle2,
  Sliders,
  Database,
  Zap,
  BarChart3,
  Layers,
  Code2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  WifiOff,
  BookOpen,
  Download,
  Mail,
  Globe,
  MapPin,
  Navigation,
  Cloud,
  PiggyBank,
} from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';

interface LandingPageProps {
  onOpenScanner: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenScanner, onNavigateToTab }) => {
  const { t } = useTranslation();
  const { config, currentPlan, remainingScans, maxFreeTests, canRunScan, setPlan, subscribeStripePlan } = useWhiteLabel();

  // Interactive comparison widget state
  const [activeDemo, setActiveDemo] = useState<'soda' | 'yogurt'>('soda');
  const [subscribingPlan, setSubscribingPlan] = useState<'pro' | 'plus' | null>(null);
  const [stripeNotification, setStripeNotification] = useState<string | null>(null);
  const [showStripeSpecs, setShowStripeSpecs] = useState<boolean>(false);
  const [isSyncingStripe, setIsSyncingStripe] = useState<boolean>(false);
  const [stripeSyncResult, setStripeSyncResult] = useState<any>(null);
  const [weeklyUsageEstimate, setWeeklyUsageEstimate] = useState<number>(5);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubscribe = async (plan: 'pro' | 'plus') => {
    setSubscribingPlan(plan);
    setStripeNotification(null);
    try {
      const res = await subscribeStripePlan(plan);
      if (res.message) {
        setStripeNotification(res.message);
        setTimeout(() => setStripeNotification(null), 5000);
      }
    } finally {
      setSubscribingPlan(null);
    }
  };

  const handleSyncStripeProduct = async () => {
    setIsSyncingStripe(true);
    try {
      const response = await fetch('/api/stripe/provision-product', { method: 'POST' });
      const data = await response.json();
      setStripeSyncResult(data);
    } catch (err: any) {
      setStripeSyncResult({ success: false, message: err.message });
    } finally {
      setIsSyncingStripe(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-12">
        
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('landing.hero.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance">
            <Trans
              i18nKey="landing.hero.title"
              components={{ 1: <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-300/60 decoration-wavy underline-offset-8" /> }}
            />
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed text-balance">
            {t('landing.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenScanner}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              <Camera className="w-5 h-5" />
              <span>{t('landing.hero.scanNow')}</span>
            </button>

            <button
              onClick={() => onNavigateToTab('budget')}
              className="w-full sm:w-auto px-6 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <PiggyBank className="w-4 h-4 text-slate-950" />
              <span>{t('landing.hero.budgetCta', 'Mercado Barato · Orçamento')}</span>
            </button>

            <button
              onClick={() => onNavigateToTab('reports')}
              className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-semibold text-sm rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <FileBarChart className="w-4 h-4 text-emerald-600" />
              <span>{t('landing.hero.viewReport')}</span>
            </button>
          </div>

          {/* Free Trial Counter Strip (2 free accesses without login or purchase) */}
          {currentPlan === 'free' && (
            <div className="pt-1 flex justify-center">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold ${
                  canRunScan
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-amber-50/90 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {canRunScan
                    ? t('landing.hero.freeTrialRemaining', { remaining: remainingScans, max: maxFreeTests })
                    : t('landing.hero.freeTrialExhausted', { max: maxFreeTests })}
                </span>
              </div>
            </div>
          )}

          {/* Quick Feature Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              {t('landing.hero.feature1')}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              {t('landing.hero.feature2')}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              {t('landing.hero.feature3')}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              {t('landing.hero.feature4')}
            </span>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{t('landing.howItWorks.badge')}</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{t('landing.howItWorks.title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('landing.howItWorks.step1.title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('landing.howItWorks.step1.desc')}
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('landing.howItWorks.step2.title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('landing.howItWorks.step2.desc')}
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('landing.howItWorks.step3.title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('landing.howItWorks.step3.desc')}
            </p>
          </div>

        </div>
      </section>

      {/* Interactive Food Comparison Widget */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto space-y-8">
        <div className="max-w-3xl space-y-3 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 justify-center sm:justify-start">
            <Scale className="w-4 h-4" />
            {t('landing.comparison.badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">{t('landing.comparison.title')}</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {t('landing.comparison.subtitle')}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveDemo('soda')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDemo === 'soda' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('landing.comparison.tabSoda')}
          </button>
          <button
            onClick={() => setActiveDemo('yogurt')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDemo === 'yogurt' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('landing.comparison.tabYogurt')}
          </button>
        </div>

        {/* Demo Cards Grid */}
        {activeDemo === 'soda' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-900">
            
            {/* Bad Choice */}
            <div className="p-5 bg-white rounded-2xl border-2 border-rose-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{t('landing.comparison.sodaBadBadge')}</span>
                  <h4 className="text-base font-bold">{t('landing.comparison.sodaBadTitle')}</h4>
                  <span className="text-xs text-slate-500">{t('landing.comparison.sodaBadDesc')}</span>
                </div>
                <div className="px-3 py-1 bg-rose-600 text-white font-black rounded-lg text-sm">
                  NutriScore E (32/100)
                </div>
              </div>

              <div className="p-2.5 bg-rose-50 rounded-xl text-xs text-rose-800 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1 text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  {t('landing.comparison.sodaBadHarmTitle')}
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>{t('landing.comparison.sodaBadHarm1')}</li>
                  <li>{t('landing.comparison.sodaBadHarm2')}</li>
                  <li>{t('landing.comparison.sodaBadHarm3')}</li>
                </ul>
              </div>
            </div>

            {/* Good Choice */}
            <div className="p-5 bg-white rounded-2xl border-2 border-emerald-500 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{t('landing.comparison.sodaGoodBadge')}</span>
                  <h4 className="text-base font-bold">{t('landing.comparison.sodaGoodTitle')}</h4>
                  <span className="text-xs text-slate-500">{t('landing.comparison.sodaGoodDesc')}</span>
                </div>
                <div className="px-3 py-1 bg-emerald-600 text-white font-black rounded-lg text-sm">
                  NutriScore A (88/100)
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {t('landing.comparison.sodaGoodHarmTitle')}
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>{t('landing.comparison.sodaGoodHarm1')}</li>
                  <li>{t('landing.comparison.sodaGoodHarm2')}</li>
                  <li>{t('landing.comparison.sodaGoodHarm3')}</li>
                </ul>
              </div>
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-900">
            
            {/* Good Choice */}
            <div className="p-5 bg-white rounded-2xl border-2 border-emerald-500 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{t('landing.comparison.yogurtGoodBadge')}</span>
                  <h4 className="text-base font-bold">{t('landing.comparison.yogurtGoodTitle')}</h4>
                  <span className="text-xs text-slate-500">{t('landing.comparison.yogurtGoodDesc')}</span>
                </div>
                <div className="px-3 py-1 bg-emerald-600 text-white font-black rounded-lg text-sm">
                  NutriScore A (92/100)
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {t('landing.comparison.yogurtGoodHarmTitle')}
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>{t('landing.comparison.yogurtGoodHarm1')}</li>
                  <li>{t('landing.comparison.yogurtGoodHarm2')}</li>
                  <li>{t('landing.comparison.yogurtGoodHarm3')}</li>
                </ul>
              </div>
            </div>

            {/* Bad Choice */}
            <div className="p-5 bg-white rounded-2xl border-2 border-rose-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{t('landing.comparison.yogurtBadBadge')}</span>
                  <h4 className="text-base font-bold">{t('landing.comparison.yogurtBadTitle')}</h4>
                  <span className="text-xs text-slate-500">{t('landing.comparison.yogurtBadDesc')}</span>
                </div>
                <div className="px-3 py-1 bg-amber-500 text-white font-black rounded-lg text-sm">
                  NutriScore D (42/100)
                </div>
              </div>

              <div className="p-2.5 bg-rose-50 rounded-xl text-xs text-rose-800 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1 text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  {t('landing.comparison.yogurtBadHarmTitle')}
                </div>
                <p className="text-[11px]">{t('landing.comparison.yogurtBadHarm1')}</p>
              </div>
            </div>

          </div>
        )}

        <div className="text-center pt-2">
          <button
            onClick={onOpenScanner}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>{t('landing.comparison.testCamera')}</span>
          </button>
        </div>
      </section>

      {/* Feature Deep Dive Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{t('landing.features.badge')}</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{t('landing.features.title')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('landing.features.item1.title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('landing.features.item1.desc')}
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('landing.features.item2.title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('landing.features.item2.desc')}
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <FileBarChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('landing.features.item3.title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('landing.features.item3.desc')}
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Cloud className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('landing.features.item4.title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('landing.features.item4.desc')}
            </p>
          </div>

        </div>
      </section>

      {/* Pricing Table Section — NutriLense AI on Stripe */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 text-center">
        
        {/* Header & Value Proposition */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('landing.pricing.badge')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('landing.pricing.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            <Trans
              i18nKey="landing.pricing.subtitle"
              components={{
                1: <strong />,
                2: <strong />,
              }}
            />
          </p>
        </div>

        {/* Stripe Notification banner */}
        {stripeNotification && (
          <div className="max-w-lg mx-auto p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-2xl text-xs font-semibold text-emerald-900 dark:text-emerald-100 flex items-center justify-center gap-2.5 shadow-md animate-fade-in">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>{stripeNotification}</span>
          </div>
        )}

        {/* Interactive Usage & Quota Simulator */}
        <div className="max-w-3xl mx-auto p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>{t('landing.pricing.simTitle')}</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              {weeklyUsageEstimate <= 2 && t('landing.pricing.sim2')}
              {weeklyUsageEstimate > 2 && weeklyUsageEstimate <= 5 && t('landing.pricing.sim20')}
              {weeklyUsageEstimate > 5 && t('landing.pricing.sim60')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setWeeklyUsageEstimate(1)}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                weeklyUsageEstimate <= 2
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="font-bold text-sm">{t('landing.pricing.btn2')}</div>
              <div className="text-[10px] opacity-80">{t('landing.pricing.btn2Sub')}</div>
            </button>

            <button
              onClick={() => setWeeklyUsageEstimate(5)}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                weeklyUsageEstimate > 2 && weeklyUsageEstimate <= 5
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="font-bold text-sm">{t('landing.pricing.btn20')}</div>
              <div className="text-[10px] opacity-80">{t('landing.pricing.btn20Sub')}</div>
            </button>

            <button
              onClick={() => setWeeklyUsageEstimate(10)}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                weeklyUsageEstimate > 5
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="font-bold text-sm">{t('landing.pricing.btn60')}</div>
              <div className="text-[10px] opacity-80">{t('landing.pricing.btn60Sub')}</div>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left max-w-5xl mx-auto items-stretch">
          
          {/* Card 1: Plano Gratuito */}
          <div className={`p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border transition-all flex flex-col justify-between ${
            currentPlan === 'free'
              ? 'border-slate-400 ring-2 ring-slate-300 dark:ring-slate-700 shadow-md'
              : 'border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300'
          }`}>
            <div className="space-y-5 flex-1 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 min-h-[50px]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">{t('landing.pricing.free.badge')}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{t('landing.pricing.free.title')}</h3>
                </div>
                {currentPlan === 'free' ? (
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-full shrink-0">
                    {t('landing.pricing.free.active')}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-semibold rounded-full shrink-0">
                    {t('landing.pricing.free.noCard')}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
                {t('landing.pricing.free.price')} <span className="text-xs font-normal text-slate-500">{t('landing.pricing.free.period')}</span>
              </div>
              
              {/* Pill feature highlight */}
              <div className="h-9 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{t('landing.pricing.free.pill')}</span>
              </div>

              {/* Features list */}
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 pt-1 flex-1">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.free.item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.free.item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.free.item3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.free.item4')}</span>
                </li>
                <li className="flex items-start gap-2 text-slate-400 dark:text-slate-500">
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-[10px] text-slate-400 shrink-0">✕</span>
                  <span>{t('landing.pricing.free.item5')}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setPlan('free');
                onOpenScanner();
              }}
              className="mt-6 w-full py-3.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <span>{currentPlan === 'free' ? t('landing.pricing.free.btnActive') : t('landing.pricing.free.btnSwitch')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Plano Pro (20 Scans no mês) */}
          <div className={`p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border transition-all flex flex-col justify-between relative ${
            currentPlan === 'pro'
              ? 'border-emerald-500 ring-2 ring-emerald-400 shadow-lg'
              : 'border-slate-200/90 dark:border-slate-800 shadow-md hover:border-emerald-400'
          }`}>
            <div className="space-y-5 flex-1 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 min-h-[50px]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                    {t('landing.pricing.pro.badge')}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{t('landing.pricing.pro.title')}</h3>
                </div>
                {currentPlan === 'pro' ? (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full shrink-0">
                    {t('landing.pricing.pro.active')}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                    {t('landing.pricing.pro.quota')}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
                {t('landing.pricing.pro.price')} <span className="text-xs font-normal text-slate-500">{t('landing.pricing.pro.period')}</span>
              </div>

              {/* Destaque do Limite de 20 Scans */}
              <div className="h-9 text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/70 px-3 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 shrink-0">
                <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{t('landing.pricing.pro.pill')}</span>
              </div>

              {/* Features list */}
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 pt-1 flex-1">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.pro.item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.pro.item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.pro.item3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.pro.item4')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.pro.item5')}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('pro')}
              disabled={subscribingPlan !== null}
              className="mt-6 w-full py-3.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shrink-0"
            >
              {subscribingPlan === 'pro' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              <span>{currentPlan === 'pro' ? t('landing.pricing.pro.btnActive') : t('landing.pricing.pro.btnSubscribe')}</span>
            </button>
          </div>

          {/* Card 3: Plano Plus (60 Scans no mês - R$ 49,90) */}
          <div className="p-6 sm:p-7 pt-8 sm:pt-9 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden border-2 border-emerald-400">
            {/* Top-right pinned badge close to top edge */}
            <span className="absolute top-3 right-3 sm:top-3.5 sm:right-4 px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider border border-white/30 shadow-xs z-10 whitespace-nowrap">
              {t('landing.pricing.plus.popular')}
            </span>

            <div className="space-y-5 flex-1 flex flex-col">
              {/* Header */}
              <div className="min-h-[50px] pr-28 sm:pr-32">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block mb-0.5 whitespace-nowrap">
                  {t('landing.pricing.plus.badge')}
                </span>
                <h3 className="text-xl font-bold text-white leading-tight">{t('landing.pricing.plus.title')}</h3>
              </div>

              {/* Price */}
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white flex items-baseline gap-1">
                {t('landing.pricing.plus.price')} <span className="text-xs font-normal text-emerald-100">{t('landing.pricing.plus.period')}</span>
              </div>

              {/* Highlight Pill */}
              <div className="h-9 text-xs font-extrabold text-emerald-950 bg-emerald-100 px-3 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{t('landing.pricing.plus.pill')}</span>
              </div>

              {/* Features list */}
              <ul className="text-xs text-emerald-50 space-y-2.5 pt-1 flex-1">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.plus.item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.plus.item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.plus.item3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.plus.item4')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
                  <span>{t('landing.pricing.plus.item5')}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('plus')}
              disabled={subscribingPlan !== null}
              className="mt-6 w-full py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-xs rounded-2xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 shrink-0"
            >
              {subscribingPlan === 'plus' ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-800" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-600" />
              )}
              <span>{currentPlan === 'plus' ? t('landing.pricing.plus.btnActive') : t('landing.pricing.plus.btnSubscribe')}</span>
            </button>
          </div>

        </div>

      </section>

      {/* Google Maps Nutritionist Integration Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-900/50 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                <MapPin className="w-3.5 h-3.5" />
                {t('landing.mapsBanner.badge')}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {t('landing.mapsBanner.title')}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {t('landing.mapsBanner.desc')}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigateToTab('nutritionists')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  {t('landing.mapsBanner.btn')}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {t('landing.mapsBanner.gps')}
                </span>
              </div>
            </div>

            <div className="md:col-span-4 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
                <Sparkles className="w-4 h-4" />
                {t('landing.mapsBanner.sideBadge')}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('landing.mapsBanner.sideDesc')}
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>{t('landing.mapsBanner.platform')}</span>
                <span className="text-emerald-400">{t('landing.mapsBanner.radius')}</span>
              </div>
            </div>
          </div>

          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-full text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('landing.faq.badge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('landing.faq.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {t('landing.faq.subtitle')}
          </p>
        </div>

        <div className="space-y-3.5">
          {(() => {
            const faqIcons = [
              AlertTriangle,
              BookOpen,
              WifiOff,
              CreditCard,
              Camera,
              Smartphone,
              FileBarChart,
            ];
            const faqItems = (t('landing.faq.items', { returnObjects: true }) as Array<{ category: string; q: string; a: string }>) || [];

            return faqItems.map((item, idx) => {
              const Icon = faqIcons[idx % faqIcons.length];
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">
                          {item.q}
                        </h4>
                      </div>
                    </div>

                    <div className={`p-1.5 rounded-lg text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-slate-100 dark:border-slate-800/80">
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-3">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-16 pt-12 pb-8 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            {/* App Info & Bio */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{config.logoEmoji}</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {config.appName}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
                {t('landing.footer.desc')}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>{t('landing.footer.highPerf')}</span>
              </div>
            </div>

            {/* Quick Links & Developer Portfolio */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {t('landing.footer.portfolioTitle')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('landing.footer.portfolioDesc')}
              </p>
              <div>
                <a
                  href="https://alinedev.ai.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl text-xs font-bold transition-all shadow-sm group"
                >
                  <Globe className="w-4 h-4 text-emerald-400 dark:text-white" />
                  <span>{t('landing.footer.portfolioBtn')}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
              <span className="text-[11px] text-slate-400 block font-mono">
                alinedev.ai.studio
              </span>
            </div>

            {/* Forms of Contact & Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {t('landing.footer.contactTitle')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('landing.footer.contactDesc')}
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:falecomnutrion@gmail.con"
                  className="inline-flex items-center gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors w-full"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('landing.footer.contactEmail')}</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold truncate block">
                      falecomnutrion@gmail.con
                    </span>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} {config.appName}. {t('landing.footer.copyright')}
            </p>
            <p className="text-[11px]">
              {t('landing.footer.official')}{' '}
              <a
                href="https://alinedev.ai.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                alinedev.ai.studio
              </a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};
