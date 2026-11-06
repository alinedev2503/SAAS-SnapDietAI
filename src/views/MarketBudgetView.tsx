import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import {
  TrendingDown,
  ShoppingBag,
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  DollarSign,
  Receipt,
  PiggyBank,
  RefreshCw,
  Share2,
  ChevronDown,
  ChevronUp,
  Tag,
  Lightbulb,
  Check,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeeklyBudgetPlan, GroceryItem, EconomicalMealDay, GroceryCategory } from '../types/nutrition';

interface MarketBudgetViewProps {
  onOpenScanner: () => void;
}

export const MarketBudgetView: React.FC<MarketBudgetViewProps> = ({ onOpenScanner }) => {
  const { t, i18n } = useTranslation();
  const { profile, isUS } = useWhiteLabel();

  const defaultBudget = isUS ? 50 : 150;
  const currencySymbol = isUS ? '$' : 'R$';
  const currencyCode = isUS ? 'USD' : 'BRL';

  const [budgetInput, setBudgetInput] = useState<number>(() => {
    const saved = localStorage.getItem('snapdiet_weekly_budget');
    return saved ? parseFloat(saved) : defaultBudget;
  });

  const [activeTab, setActiveTab] = useState<'grocery' | 'meals' | 'tips'>('grocery');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [customItemModal, setCustomItemModal] = useState<boolean>(false);
  const [customItemName, setCustomItemName] = useState<string>('');
  const [customItemPrice, setCustomItemPrice] = useState<string>('');
  const [customItemCategory, setCustomItemCategory] = useState<GroceryCategory>('hortifruti');

  // Loaded Budget Plan State
  const [plan, setPlan] = useState<WeeklyBudgetPlan | null>(() => {
    const saved = localStorage.getItem('snapdiet_current_budget_plan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return null;
  });

  // Save budget to localStorage
  useEffect(() => {
    localStorage.setItem('snapdiet_weekly_budget', budgetInput.toString());
  }, [budgetInput]);

  useEffect(() => {
    if (plan) {
      localStorage.setItem('snapdiet_current_budget_plan', JSON.stringify(plan));
    }
  }, [plan]);

  // Request AI budget meal plan & grocery list
  const fetchBudgetPlan = async (budget: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/budget-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weeklyBudget: budget,
          currency: currencyCode,
          dietaryRestrictions: profile.dietaryRestrictions || [],
          targetCalories: profile.targetCalories || 2000,
          targetProtein: profile.targetProtein || 120,
        }),
      });

      const data = await res.json();
      if (data.success && data.plan) {
        setPlan(data.plan);
        try {
          confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
        } catch (_) {}
      }
    } catch (err) {
      console.error('Error fetching budget plan:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load if no plan exists
  useEffect(() => {
    if (!plan) {
      fetchBudgetPlan(budgetInput);
    }
  }, []);

  // Toggle item bought checkbox
  const toggleItemBought = (itemId: string) => {
    if (!plan) return;
    const updatedList = plan.groceryList.map((item) =>
      item.id === itemId ? { ...item, isBought: !item.isBought } : item
    );
    setPlan({ ...plan, groceryList: updatedList });
  };

  // Add custom grocery item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim() || !plan) return;

    const newItem: GroceryItem = {
      id: `custom_${Date.now()}`,
      name: customItemName.trim(),
      category: customItemCategory,
      quantityText: '1 un',
      estimatedPrice: parseFloat(customItemPrice) || 0,
      isBought: false,
    };

    const updatedList = [newItem, ...plan.groceryList];
    const newTotal = Math.round(updatedList.reduce((acc, i) => acc + i.estimatedPrice, 0) * 100) / 100;

    setPlan({
      ...plan,
      groceryList: updatedList,
      totalEstimatedCost: newTotal,
    });

    setCustomItemName('');
    setCustomItemPrice('');
    setCustomItemModal(false);
  };

  // Remove grocery item
  const handleRemoveItem = (itemId: string) => {
    if (!plan) return;
    const updatedList = plan.groceryList.filter((item) => item.id !== itemId);
    const newTotal = Math.round(updatedList.reduce((acc, i) => acc + i.estimatedPrice, 0) * 100) / 100;
    setPlan({
      ...plan,
      groceryList: updatedList,
      totalEstimatedCost: newTotal,
    });
  };

  // Computed Cart Totals
  const cartStats = useMemo(() => {
    if (!plan) return { boughtCount: 0, totalCount: 0, spentSoFar: 0, totalEstimated: 0 };
    const bought = plan.groceryList.filter((i) => i.isBought);
    const spentSoFar = Math.round(bought.reduce((acc, i) => acc + i.estimatedPrice, 0) * 100) / 100;
    return {
      boughtCount: bought.length,
      totalCount: plan.groceryList.length,
      spentSoFar,
      totalEstimated: plan.totalEstimatedCost,
    };
  }, [plan]);

  // Filtered grocery list
  const filteredGroceries = useMemo(() => {
    if (!plan) return [];
    if (selectedCategory === 'all') return plan.groceryList;
    return plan.groceryList.filter((i) => i.category === selectedCategory);
  }, [plan, selectedCategory]);

  // Share grocery list
  const handleShareList = () => {
    if (!plan) return;
    const lines = [
      `🛒 *Lista de Compras SnapDiet — Mercado Barato*`,
      `💰 Orçamento Semanal: ${currencySymbol} ${plan.weeklyBudget.toFixed(2)}`,
      `📉 Total Estimado: ${currencySymbol} ${plan.totalEstimatedCost.toFixed(2)} (Economia de ${currencySymbol} ${plan.totalSavingsVsBrandNames.toFixed(2)})`,
      '',
      ...plan.groceryList.map(
        (item) => `${item.isBought ? '✅' : '⬜'} ${item.name} (${item.quantityText}) — ${currencySymbol} ${item.estimatedPrice.toFixed(2)}`
      ),
      '',
      `💡 Gerado com IA pelo SnapDiet. Bate suas proteínas gastando menos!`,
    ];

    const text = lines.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100">
            <PiggyBank className="w-3.5 h-3.5" />
            {t('marketBudget.badge')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('marketBudget.title')}
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            {t('marketBudget.subtitle')}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenScanner}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-900 font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
            >
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>{t('marketBudget.scanShelf')}</span>
            </button>

            <span className="text-xs text-emerald-100/90 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              {t('marketBudget.heroProteinsShield')}
            </span>
          </div>
        </div>

        {/* Decorative Circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Budget Control & Live Savings Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              {t('marketBudget.budgetSettingTitle')}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {t('marketBudget.weeklyCeilingTitle')}
            </h2>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-medium text-[11px] whitespace-nowrap">
              {t('marketBudget.quickPresets')}:
            </span>
            {(isUS ? [40, 50, 75, 100] : [100, 150, 200, 250]).map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setBudgetInput(preset);
                  fetchBudgetPlan(preset);
                }}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  budgetInput === preset
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {currencySymbol} {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Input & Recalculate CTA */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                {currencySymbol}
              </span>
              <input
                type="number"
                min={30}
                max={1500}
                value={budgetInput}
                onChange={(e) => setBudgetInput(parseFloat(e.target.value) || 0)}
                className="w-36 pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-extrabold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t('marketBudget.budgetPerWeekHint')}
            </span>
          </div>

          <button
            onClick={() => fetchBudgetPlan(budgetInput)}
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? t('marketBudget.generating') : t('marketBudget.regeneratePlan')}</span>
          </button>
        </div>

        {/* Live Gauges (Budget Remaining + Inflation Savings) */}
        {plan && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Total Estimated Cost */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('marketBudget.totalCostEstimated')}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {currencySymbol} {plan.totalEstimatedCost.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500">
                  / {currencySymbol} {plan.weeklyBudget.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full transition-all ${
                    plan.totalEstimatedCost <= plan.weeklyBudget
                      ? 'bg-emerald-500'
                      : 'bg-rose-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (plan.totalEstimatedCost / plan.weeklyBudget) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Total Savings vs. Brand Names */}
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                {t('marketBudget.savingsVsBrand')}
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
                {currencySymbol} {plan.totalSavingsVsBrandNames.toFixed(2)}
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">
                {t('marketBudget.savingsPercentage', { percent: Math.round((plan.totalSavingsVsBrandNames / (plan.totalEstimatedCost + plan.totalSavingsVsBrandNames)) * 100) })}
              </span>
            </div>

            {/* Protein Cost Efficiency */}
            <div className="p-4 bg-sky-50/70 dark:bg-sky-950/30 rounded-2xl border border-sky-200/80 dark:border-sky-900/60 space-y-1">
              <span className="text-[11px] font-bold text-sky-800 dark:text-sky-400 uppercase tracking-wider block flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-sky-600" />
                {t('marketBudget.costPerProteinGram')}
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-mono text-sky-700 dark:text-sky-300">
                {currencySymbol} {isUS ? '0.04' : '0.12'} <span className="text-xs font-normal">/ g</span>
              </p>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 block font-medium">
                {t('marketBudget.proteinEfficiencyDesc')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Selector Bar (Grocery List vs. Meal Plan vs. Inflation Tips) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('grocery')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'grocery'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('marketBudget.tabGroceryList')} ({cartStats.boughtCount}/{cartStats.totalCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('meals')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'meals'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t('marketBudget.tabMealPlan')} (7 {t('marketBudget.days')})</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'tips'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>{t('marketBudget.tabTips')}</span>
          </button>
        </div>

        {activeTab === 'grocery' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomItemModal(true)}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title={t('marketBudget.addCustomItem')}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('marketBudget.addCustomItem')}</span>
            </button>

            <button
              onClick={handleShareList}
              className="p-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title={t('marketBudget.shareListTitle')}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedSuccess ? t('marketBudget.copied') : t('marketBudget.share')}</span>
            </button>
          </div>
        )}
      </div>

      {copiedSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{t('marketBudget.copiedToast')}</span>
        </div>
      )}

      {/* ================= TAB 1: SMART GROCERY CHECKLIST ================= */}
      {activeTab === 'grocery' && plan && (
        <div className="space-y-4">
          
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {[
              { id: 'all', label: t('marketBudget.catAll') },
              { id: 'hortifruti', label: t('marketBudget.catHortifruti') },
              { id: 'proteinas', label: t('marketBudget.catProteins') },
              { id: 'graos_cereais', label: t('marketBudget.catGrains') },
              { id: 'laticinios', label: t('marketBudget.catDairy') },
              { id: 'despensa', label: t('marketBudget.catPantry') },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grocery Items List */}
          <div className="space-y-2.5">
            {filteredGroceries.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItemBought(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  item.isBought
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      item.isBought
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {item.isBought && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-bold text-slate-900 dark:text-white truncate ${
                        item.isBought ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span className="font-medium">{item.quantityText}</span>
                      {item.savingsTip && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 text-[11px] truncate">
                            {item.savingsTip}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-extrabold font-mono text-sm text-slate-900 dark:text-white">
                    {currencySymbol} {item.estimatedPrice.toFixed(2)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg"
                    title={t('marketBudget.removeItem')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ================= TAB 2: ECONOMICAL MEAL PLAN ================= */}
      {activeTab === 'meals' && plan && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.meals.map((meal, idx) => (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    {meal.day}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ~{currencySymbol} {meal.dailyCostEstimated.toFixed(2)}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 font-bold">
                      {meal.dailyProteinGrams}g {t('marketBudget.proteinUnit')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">
                      {t('marketBudget.breakfast')}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{meal.breakfast}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">
                      {t('marketBudget.lunch')}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{meal.lunch}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">
                      {t('marketBudget.snack')}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{meal.snack}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">
                      {t('marketBudget.dinner')}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{meal.dinner}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: INFLATION HACKS & AI ADVICE ================= */}
      {activeTab === 'tips' && plan && (
        <div className="space-y-4">
          <div className="p-6 bg-amber-50/70 dark:bg-amber-950/30 rounded-3xl border border-amber-200 dark:border-amber-900/60 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-base">{t('marketBudget.aiAdviceTitle')}</h3>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              {plan.aiAdvice}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                🏷️ {t('marketBudget.tip1Title')}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('marketBudget.tip1Desc')}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                🥚 {t('marketBudget.tip2Title')}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('marketBudget.tip2Desc')}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                🥦 {t('marketBudget.tip3Title')}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('marketBudget.tip3Desc')}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                📦 {t('marketBudget.tip4Title')}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('marketBudget.tip4Desc')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD CUSTOM GROCERY ITEM ================= */}
      {customItemModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t('marketBudget.addCustomItem')}
              </h3>
              <button
                onClick={() => setCustomItemModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomItem} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('marketBudget.itemName')}
                </label>
                <input
                  type="text"
                  required
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  placeholder="Ex: Maçã Fuji 1kg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('marketBudget.estimatedPrice')} ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(e.target.value)}
                    placeholder="Ex: 8.50"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('marketBudget.category')}
                  </label>
                  <select
                    value={customItemCategory}
                    onChange={(e) => setCustomItemCategory(e.target.value as GroceryCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="hortifruti">{t('marketBudget.catHortifruti')}</option>
                    <option value="proteinas">{t('marketBudget.catProteins')}</option>
                    <option value="graos_cereais">{t('marketBudget.catGrains')}</option>
                    <option value="laticinios">{t('marketBudget.catDairy')}</option>
                    <option value="despensa">{t('marketBudget.catPantry')}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomItemModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  {t('marketBudget.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  {t('marketBudget.addBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
