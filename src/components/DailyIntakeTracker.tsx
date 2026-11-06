import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Droplets,
  Flame,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  X,
  Target,
  Settings2,
  HeartPulse,
  Info,
  Calendar,
  Utensils,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useWhiteLabel } from '../context/WhiteLabelContext';

interface DailyIntakeTrackerProps {
  onOpenScanner: () => void;
}

export const DailyIntakeTracker: React.FC<DailyIntakeTrackerProps> = ({ onOpenScanner }) => {
  const { t, i18n } = useTranslation();
  const { profile, history, addScan } = useWhiteLabel();

  // Current day key
  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Formatted date string for header
  const formattedToday = useMemo(() => {
    const locale = i18n.language?.startsWith('es')
      ? 'es-ES'
      : i18n.language?.startsWith('en')
      ? 'en-US'
      : 'pt-BR';
    return new Date().toLocaleDateString(locale, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, [i18n.language]);

  // Water State
  const [waterGoal, setWaterGoal] = useState<number>(() => {
    const saved = localStorage.getItem('nutrilense_water_goal');
    return saved ? parseInt(saved, 10) : 2500;
  });

  const [waterIntake, setWaterIntake] = useState<number>(() => {
    const saved = localStorage.getItem(`nutrilense_water_${todayKey}`);
    return saved ? parseInt(saved, 10) : 1000; // Seeded with friendly default for immediate engagement
  });

  const [hasCelebratedWater, setHasCelebratedWater] = useState<boolean>(() => {
    return waterIntake >= waterGoal;
  });

  const [showGoalSelector, setShowGoalSelector] = useState<boolean>(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState<boolean>(false);

  // Quick calorie add form state
  const [quickName, setQuickName] = useState<string>('');
  const [quickCalories, setQuickCalories] = useState<string>('');
  const [quickProtein, setQuickProtein] = useState<string>('');
  const [quickCarbs, setQuickCarbs] = useState<string>('');
  const [quickFat, setQuickFat] = useState<string>('');
  const [quickSuccess, setQuickSuccess] = useState<boolean>(false);

  // Save water changes
  useEffect(() => {
    localStorage.setItem(`nutrilense_water_${todayKey}`, waterIntake.toString());
  }, [waterIntake, todayKey]);

  useEffect(() => {
    localStorage.setItem('nutrilense_water_goal', waterGoal.toString());
  }, [waterGoal]);

  // Water Intake Actions
  const handleAddWater = (amount: number) => {
    setWaterIntake((prev) => {
      const updated = Math.max(0, prev + amount);
      if (updated >= waterGoal && !hasCelebratedWater && amount > 0) {
        setHasCelebratedWater(true);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (_) {}
      }
      return updated;
    });
  };

  const handleResetWater = () => {
    setWaterIntake(0);
    setHasCelebratedWater(false);
  };

  const handleSetGoal = (newGoal: number) => {
    setWaterGoal(newGoal);
    setShowGoalSelector(false);
  };

  // Caloric calculations from history
  const totalCalories = useMemo(
    () => history.reduce((acc, s) => acc + (s.macronutrients?.calories || 0), 0),
    [history]
  );
  const totalProtein = useMemo(
    () => history.reduce((acc, s) => acc + (s.macronutrients?.protein || 0), 0),
    [history]
  );
  const totalCarbs = useMemo(
    () => history.reduce((acc, s) => acc + (s.macronutrients?.carbohydrates || 0), 0),
    [history]
  );
  const totalFat = useMemo(
    () => history.reduce((acc, s) => acc + (s.macronutrients?.totalFat || 0), 0),
    [history]
  );
  const totalSodium = useMemo(
    () => history.reduce((acc, s) => acc + (s.macronutrients?.sodium || 0), 0),
    [history]
  );

  const calPercentage = Math.min(150, Math.round((totalCalories / (profile.targetCalories || 2000)) * 100));
  const waterPercentage = Math.min(150, Math.round((waterIntake / waterGoal) * 100));

  const glassesCount = Math.floor(waterIntake / 250);
  const totalGlassesTarget = Math.ceil(waterGoal / 250);

  // Quick calorie add submit
  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cals = parseInt(quickCalories, 10);
    if (!cals || cals <= 0) return;

    const prot = parseFloat(quickProtein) || 0;
    const carbs = parseFloat(quickCarbs) || 0;
    const fat = parseFloat(quickFat) || 0;

    await addScan({
      userId: profile.id,
      barcode: '',
      productName: quickName.trim() || t('history.tracker.quickAddNamePlaceholder'),
      brand: 'Manual Intake / Homemade',
      servingSize: '1 serving',
      healthScore: 90,
      nutriScore: 'A',
      novaGroup: 1,
      novaDescription: 'In Natura / Homemade',
      macronutrients: {
        calories: cals,
        protein: prot,
        carbohydrates: carbs,
        totalFat: fat,
        saturatedFat: Math.round(fat * 0.3 * 10) / 10,
        transFat: 0,
        dietaryFiber: Math.round(carbs * 0.2 * 10) / 10,
        sodium: 40,
        sugar: Math.round(carbs * 0.3 * 10) / 10,
      },
      ingredientsText: quickName.trim() || 'Custom meal logged directly into daily tracker.',
      beneficialSubstances: [{ name: 'Custom Nutrient Balance', reason: 'Tracked for daily metabolic targets' }],
      harmfulSubstances: [],
      additives: [],
      triggeredAlerts: [],
      suggestedSwaps: [],
      scanCategory: 'prato_pronto',
    });

    setQuickName('');
    setQuickCalories('');
    setQuickProtein('');
    setQuickCarbs('');
    setQuickFat('');
    setQuickSuccess(true);
    setTimeout(() => {
      setQuickSuccess(false);
      setShowQuickAddModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Tracker Card Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 via-white to-emerald-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {t('history.tracker.badge')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formattedToday}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
              {t('history.tracker.title')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('history.tracker.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowQuickAddModal(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={t('history.tracker.quickAddDesc')}
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t('history.tracker.quickAdd')}</span>
            </button>

            <button
              onClick={onOpenScanner}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>{t('history.scanProduct')}</span>
            </button>
          </div>
        </div>

        {/* Dual Grid: Calorie Tracker (Left) & Hydration Tracker (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
          
          {/* ================= CALORIE & MACRO BUDGET (7 COLS) ================= */}
          <div className="lg:col-span-7 p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('history.tracker.calorieTitle')}
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t('history.tracker.mealsCount', { count: history.length })}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  totalCalories > profile.targetCalories
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                    : totalCalories >= profile.targetCalories * 0.85
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {totalCalories > profile.targetCalories
                  ? t('history.tracker.budgetStatusOver')
                  : totalCalories >= profile.targetCalories * 0.85
                  ? t('history.tracker.budgetStatusNear')
                  : t('history.tracker.budgetStatusOnTrack')}
              </span>
            </div>

            {/* Caloric Big Numbers & Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {t('history.tracker.consumed')}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                      {totalCalories.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      / {profile.targetCalories.toLocaleString()} kcal
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {totalCalories > profile.targetCalories
                      ? t('history.tracker.overBudget')
                      : t('history.tracker.remaining')}
                  </span>
                  <p
                    className={`text-lg sm:text-xl font-bold font-mono ${
                      totalCalories > profile.targetCalories
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {totalCalories > profile.targetCalories
                      ? `+${(totalCalories - profile.targetCalories).toLocaleString()} kcal`
                      : `${(profile.targetCalories - totalCalories).toLocaleString()} kcal`}
                  </p>
                </div>
              </div>

              {/* Progress Bar with Gradient */}
              <div className="space-y-1">
                <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      totalCalories > profile.targetCalories
                        ? 'bg-gradient-to-r from-rose-500 to-red-600'
                        : totalCalories >= profile.targetCalories * 0.85
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    }`}
                    style={{ width: `${Math.min(100, (totalCalories / profile.targetCalories) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono font-medium">
                  <span>0 kcal</span>
                  <span>50%</span>
                  <span>100% ({profile.targetCalories} kcal)</span>
                </div>
              </div>
            </div>

            {/* Macros Breakdown (Protein, Carbs, Fat, Sodium) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {t('history.tracker.macroDistribution')}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Protein */}
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {t('history.tracker.macroProtein')}
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {totalProtein}g
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((totalProtein / (profile.targetProtein || 120)) * 100))}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    / {profile.targetProtein || 120}g ({Math.round((totalProtein / (profile.targetProtein || 120)) * 100)}%)
                  </span>
                </div>

                {/* Carbs */}
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {t('history.tracker.macroCarbs')}
                    </span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                      {totalCarbs}g
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((totalCarbs / (profile.targetCarbs || 220)) * 100))}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    / {profile.targetCarbs || 220}g ({Math.round((totalCarbs / (profile.targetCarbs || 220)) * 100)}%)
                  </span>
                </div>

                {/* Fat */}
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {t('history.tracker.macroFat')}
                    </span>
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                      {totalFat}g
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((totalFat / (profile.targetFat || 65)) * 100))}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    / {profile.targetFat || 65}g ({Math.round((totalFat / (profile.targetFat || 65)) * 100)}%)
                  </span>
                </div>

                {/* Sodium (TACO Standard monitoring) */}
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {t('history.tracker.macroSodium')}
                    </span>
                    <span className={`font-mono font-bold ${totalSodium > (profile.targetSodium || 2000) ? 'text-rose-600' : 'text-blue-600 dark:text-blue-400'}`}>
                      {totalSodium}mg
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${totalSodium > (profile.targetSodium || 2000) ? 'bg-rose-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(100, Math.round((totalSodium / (profile.targetSodium || 2000)) * 100))}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    / {profile.targetSodium || 2000}mg
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* ================= HYDRATION & WATER TRACKER (5 COLS) ================= */}
          <div className="lg:col-span-5 p-5 sm:p-6 space-y-4 bg-gradient-to-b from-sky-50/40 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/20 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Header with Goal Setting */}
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t('history.tracker.waterTitle')}
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {t('history.tracker.waterGlasses', { current: glassesCount, total: totalGlassesTarget })}
                    </span>
                  </div>
                </div>

                {/* Adjust Goal Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowGoalSelector(!showGoalSelector)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    title={t('history.tracker.setGoal')}
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span className="font-mono font-medium">{waterGoal} ml</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* Goal Dropdown */}
                  {showGoalSelector && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20 text-xs animate-in fade-in zoom-in-95 duration-100">
                      <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {t('history.tracker.setGoal')}
                      </p>
                      {[1500, 2000, 2500, 3000, 3500].map((goalOption) => (
                        <button
                          key={goalOption}
                          onClick={() => handleSetGoal(goalOption)}
                          className={`w-full text-left px-3 py-1.5 hover:bg-sky-50 dark:hover:bg-slate-700/60 flex items-center justify-between cursor-pointer ${
                            waterGoal === goalOption
                              ? 'text-sky-600 dark:text-sky-400 font-bold bg-sky-50/50 dark:bg-slate-700/40'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{goalOption} ml</span>
                          {waterGoal === goalOption && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Water Card with Liquid Level & Percent */}
              <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-800/80 rounded-2xl border border-sky-100 dark:border-sky-950/60 shadow-xs space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      {t('history.tracker.today')}
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                        {waterIntake.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 font-mono">
                        / {waterGoal.toLocaleString()} ml
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold font-mono bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300">
                      {waterPercentage}%
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {waterIntake >= waterGoal
                        ? t('history.tracker.waterExceeded', { count: waterIntake - waterGoal })
                        : t('history.tracker.waterRemaining', { count: waterGoal - waterIntake })}
                    </p>
                  </div>
                </div>

                {/* Animated Water Reservoir Gauge */}
                <div className="w-full h-3.5 bg-sky-100/80 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 transition-all duration-500 relative"
                    style={{ width: `${Math.min(100, (waterIntake / waterGoal) * 100)}%` }}
                  >
                    {/* Subtle water shine effect */}
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Visual Glass Row */}
                <div className="pt-1 flex items-center justify-between gap-1 overflow-x-auto py-1">
                  {Array.from({ length: Math.min(12, totalGlassesTarget) }).map((_, idx) => {
                    const isFilled = idx < glassesCount;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAddWater(isFilled ? -250 : 250)}
                        className={`flex-1 h-7 rounded-lg transition-all flex items-center justify-center text-[10px] cursor-pointer border ${
                          isFilled
                            ? 'bg-sky-500 text-white border-sky-600 shadow-xs hover:bg-sky-600 scale-100'
                            : 'bg-white dark:bg-slate-700/60 text-slate-400 border-slate-200 dark:border-slate-600 hover:border-sky-300 opacity-60 hover:opacity-100'
                        }`}
                        title={`${(idx + 1) * 250} ml`}
                      >
                        💧
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goal Reached Celebration Banner */}
              {waterIntake >= waterGoal && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[11px] leading-tight">
                    {t('history.tracker.waterAchieved')}
                  </span>
                </div>
              )}

              {/* Quick Action Buttons (+250ml, +500ml, +100ml, Undo, Reset) */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => handleAddWater(250)}
                  className="flex-1 min-w-[70px] py-2 px-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="Add 1 glass of water"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('history.tracker.add250')}</span>
                </button>

                <button
                  onClick={() => handleAddWater(500)}
                  className="flex-1 min-w-[70px] py-2 px-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="Add 1 bottle of water"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('history.tracker.add500')}</span>
                </button>

                <button
                  onClick={() => handleAddWater(100)}
                  className="py-2 px-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  title="Add small sip / cup"
                >
                  {t('history.tracker.add100')}
                </button>

                {waterIntake > 0 && (
                  <>
                    <button
                      onClick={() => handleAddWater(-250)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl transition-colors cursor-pointer"
                      title={t('history.tracker.undo')}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleResetWater}
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                      title={t('history.tracker.reset')}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

            </div>

            {/* Hydration Health Tip Footer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-start gap-1.5 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
              <p className="leading-tight">
                {t('history.tracker.waterTip')}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* ================= MODAL: QUICK CALORIE / MEAL ENTRY ================= */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t('history.tracker.quickAddTitle')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t('history.tracker.quickAddDesc')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {quickSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <p className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                  {t('history.tracker.quickAddSuccess')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickAddSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('history.tracker.quickAddName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder={t('history.tracker.quickAddNamePlaceholder')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('history.tracker.quickAddCals')} *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={4000}
                      value={quickCalories}
                      onChange={(e) => setQuickCalories(e.target.value)}
                      placeholder="e.g.: 250"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('history.tracker.quickAddProtein')}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={quickProtein}
                      onChange={(e) => setQuickProtein(e.target.value)}
                      placeholder="e.g.: 15"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('history.tracker.quickAddCarbs')}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={quickCarbs}
                      onChange={(e) => setQuickCarbs(e.target.value)}
                      placeholder="e.g.: 30"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('history.tracker.quickAddFat')}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={quickFat}
                      onChange={(e) => setQuickFat(e.target.value)}
                      placeholder="e.g.: 8"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    {t('history.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    {t('history.tracker.quickAddSubmit')}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
