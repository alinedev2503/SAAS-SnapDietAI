import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductScan, NutriScoreGrade } from '../types/nutrition';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Flame,
  HeartPulse,
  ChevronDown,
  ChevronUp,
  Scale,
  CheckCircle2,
  Info,
  PiggyBank,
  TrendingDown,
  Tag,
  DollarSign,
} from 'lucide-react';
import { auditProductAgainstTaco } from '../data/tacoDatabase';

interface ProductCardProps {
  scan: ProductScan;
  onOpenSwaps?: (scan: ProductScan) => void;
  onDelete?: (id: string) => void;
}

const NUTRI_COLORS: Record<NutriScoreGrade, { bg: string; text: string; border: string }> = {
  A: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-700' },
  B: { bg: 'bg-lime-500', text: 'text-slate-900', border: 'border-lime-600' },
  C: { bg: 'bg-amber-400', text: 'text-slate-900', border: 'border-amber-500' },
  D: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600' },
  E: { bg: 'bg-rose-600', text: 'text-white', border: 'border-rose-700' },
};

export const ProductCard: React.FC<ProductCardProps> = ({ scan, onOpenSwaps, onDelete }) => {
  const { t } = useTranslation();
  const [showTacoDetails, setShowTacoDetails] = useState<boolean>(false);
  const nutriColor = NUTRI_COLORS[scan.nutriScore] || NUTRI_COLORS.C;

  const tacoAudit =
    scan.tacoValidation ||
    auditProductAgainstTaco(
      scan.productName,
      scan.macronutrients,
      scan.servingSize,
      scan.ingredientsText
    );

  const riskMap: Record<string, string> = {
    Baixo: t('productCard.riskLow'),
    Médio: t('productCard.riskMedium'),
    Alto: t('productCard.riskHigh'),
    Crítico: t('productCard.riskCritical'),
    Low: t('productCard.riskLow'),
    Medium: t('productCard.riskMedium'),
    High: t('productCard.riskHigh'),
    Critical: t('productCard.riskCritical'),
    Bajo: t('productCard.riskLow'),
    Medio: t('productCard.riskMedium'),
  };

  const novaDescriptions: Record<number, string> = {
    1: t('productCard.nova1'),
    2: t('productCard.nova2'),
    3: t('productCard.nova3'),
    4: t('productCard.nova4'),
  };

  const getDisplayProductName = () => {
    if (scan.id === 'scan_sample_1' || scan.productName.toLowerCase().includes('iogurte natural proteico')) {
      return t('productCard.sample1Name', scan.productName);
    }
    if (scan.id === 'scan_sample_2' || scan.productName.toLowerCase().includes('refrigerante cola zero')) {
      return t('productCard.sample2Name', scan.productName);
    }
    return scan.productName;
  };

  const translateAlert = (alertText: string) => {
    if (/lactose/i.test(alertText)) return t('productCard.alertLactose', alertText);
    if (/glúten|gluten/i.test(alertText)) return t('productCard.alertGluten', alertText);
    if (/sódio|sodio|sodium/i.test(alertText)) return t('productCard.alertSodium', alertText);
    if (/açúcar|acucar|sugar|diabetes|glicemia/i.test(alertText)) return t('productCard.alertSugar', alertText);
    if (/amendoim|peanut|oleaginosas/i.test(alertText)) return t('productCard.alertPeanuts', alertText);
    if (/soja|soy/i.test(alertText)) return t('productCard.alertSoy', alertText);
    if (/aditivo/i.test(alertText)) return t('productCard.alertAdditives', alertText);
    if (/ultraprocessado|nova\s*4/i.test(alertText)) return t('productCard.alertUltraProcessed', alertText);
    if (/trans/i.test(alertText)) return t('productCard.alertTransFat', alertText);
    if (/conservante/i.test(alertText)) return t('productCard.alertPreservatives', alertText);
    return alertText;
  };

  const getDisplayTacoItem = (itemText: string) => {
    if (/iogurte/i.test(itemText)) return t('productCard.tacoYogurt', itemText);
    if (/refrigerante|cola/i.test(itemText)) return t('productCard.tacoCola', itemText);
    if (/leite/i.test(itemText)) return t('productCard.tacoMilk', itemText);
    if (/aveia/i.test(itemText)) return t('productCard.tacoOats', itemText);
    if (/pão de queijo|pao de queijo/i.test(itemText)) return t('productCard.tacoCheeseBread', itemText);
    if (/pão|pao.*integral/i.test(itemText)) return t('productCard.tacoBread', itemText);
    if (/arroz/i.test(itemText)) return t('productCard.tacoRice', itemText);
    if (/feijão|feijao/i.test(itemText)) return t('productCard.tacoBeans', itemText);
    if (/frango/i.test(itemText)) return t('productCard.tacoChicken', itemText);
    if (/ovo/i.test(itemText)) return t('productCard.tacoEgg', itemText);
    return itemText;
  };

  const getDisplayCategory = (cat: string) => {
    if (/leite/i.test(cat)) return t('productCard.catDairy', cat);
    if (/bebida/i.test(cat)) return t('productCard.catBeverages', cat);
    if (/leguminosa/i.test(cat)) return t('productCard.catCereals', cat);
    if (/panificação|panificacao/i.test(cat)) return t('productCard.catBakery', cat);
    if (/carne/i.test(cat)) return t('productCard.catMeat', cat);
    if (/fruta/i.test(cat)) return t('productCard.catFruits', cat);
    if (/verdura|hortaliça|hortalica/i.test(cat)) return t('productCard.catVegetables', cat);
    return cat;
  };

  const getDisplayAuditNotes = () => {
    if (tacoAudit.validationStatus === 'conforme') {
      return t('productCard.auditNotesConforme', {
        tacoItem: getDisplayTacoItem(tacoAudit.matchedTacoItem),
        tacoId: tacoAudit.tacoId,
      });
    }
    if (tacoAudit.validationStatus === 'divergente') {
      return t('productCard.auditNotesDivergente', {
        tacoItem: getDisplayTacoItem(tacoAudit.matchedTacoItem),
        tacoId: tacoAudit.tacoId,
      });
    }
    return t('productCard.auditNotesAlerta', {
      tacoItem: getDisplayTacoItem(tacoAudit.matchedTacoItem),
      tacoId: tacoAudit.tacoId,
    });
  };

  const translateDiscrepancy = (disc: string) => {
    if (/sódio elevado/i.test(disc)) {
      const match = disc.match(/(\d+)mg\/100g vs (\d+)mg\/100g.*?\(\+?(\d+)%\)/);
      if (match) {
        return t('productCard.discSodium', { val: match[1], bench: match[2], diff: match[3] });
      }
    }
    if (/teor proteico reduzido/i.test(disc)) {
      const match = disc.match(/([\d.]+)g\/100g vs ([\d.]+)g\/100g/);
      if (match) {
        return t('productCard.discProtein', { val: match[1], bench: match[2], tacoId: tacoAudit.tacoId });
      }
    }
    if (/fibras abaixo/i.test(disc)) {
      const match = disc.match(/([\d.]+)g\/100g.*vs ([\d.]+)g\/100g/);
      if (match) {
        return t('productCard.discFiber', { val: match[1], bench: match[2] });
      }
    }
    if (/densidade energética superior/i.test(disc)) {
      const match = disc.match(/\(\+?(\d+)\s*kcal\/100g\)/);
      return t('productCard.discCalories', { diff: match ? match[1] : '100' });
    }
    if (/inconsistência de açúcares/i.test(disc)) {
      return t('productCard.discSugar');
    }
    return disc;
  };

  const translateBeneficial = (item: { name: string; reason: string }) => {
    if (/prote[íi]na/i.test(item.name)) {
      return {
        name: t('productCard.subProteins', item.name),
        reason: t('productCard.subProteinsReason', item.reason),
      };
    }
    if (/c[áa]lcio/i.test(item.name)) {
      return {
        name: t('productCard.subCalcium', item.name),
        reason: t('productCard.subCalciumReason', item.reason),
      };
    }
    return item;
  };

  const translateHarmful = (item: { name: string; risk: string; description: string }) => {
    if (/caramelo/i.test(item.name)) {
      return {
        name: t('productCard.subCaramel', item.name),
        risk: riskMap[item.risk] || item.risk,
        description: t('productCard.subCaramelDesc', item.description),
      };
    }
    if (/fosf[óo]rico/i.test(item.name)) {
      return {
        name: t('productCard.subPhosphoric', item.name),
        risk: riskMap[item.risk] || item.risk,
        description: t('productCard.subPhosphoricDesc', item.description),
      };
    }
    return {
      ...item,
      risk: riskMap[item.risk] || item.risk,
    };
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      
      {/* Top Banner & Health Score Overview */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                {scan.brand || t('productCard.unknownBrand')}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                <BookOpen className="w-3 h-3 text-emerald-600" />
                {t('productCard.tacoStandard')}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {getDisplayProductName()}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {t('productCard.serving')} {scan.servingSize} {scan.barcode ? `· EAN: ${scan.barcode}` : ''}
            </p>

            {scan.tacoReference && (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium pt-0.5">
                ✓ {getDisplayTacoItem(scan.tacoReference)}
              </p>
            )}
          </div>

          {/* Health Score Gauge Circle */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold shadow-sm ${
                scan.healthScore >= 75
                  ? 'bg-emerald-500 text-white'
                  : scan.healthScore >= 50
                  ? 'bg-amber-500 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              <span className="text-xl leading-none">{scan.healthScore}</span>
              <span className="text-[9px] uppercase tracking-wider opacity-90">/100</span>
            </div>
            <span className="text-[10px] font-medium text-slate-500 mt-1">{t('productCard.nutriIndex')}</span>
          </div>
        </div>

        {/* Badges: NutriScore & NOVA Group */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          
          {/* Official NutriScore Badge */}
          <div className="flex items-center rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Nutri-Score</span>
            <span className={`px-2.5 py-1 ${nutriColor.bg} ${nutriColor.text}`}>{scan.nutriScore}</span>
          </div>

          {/* NOVA Classification */}
          <div className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            NOVA {scan.novaGroup}: <span className="font-semibold">{novaDescriptions[scan.novaGroup] || scan.novaDescription}</span>
          </div>

        </div>

        {/* Triggered Dietary Restriction Alerts */}
        {scan.triggeredAlerts.length > 0 && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{t('productCard.alertsTitle')}</span>
            </div>
            <ul className="text-xs text-rose-800 dark:text-rose-300 space-y-0.5 pl-5 list-disc">
              {scan.triggeredAlerts.map((alert, idx) => (
                <li key={idx} className="font-medium">{translateAlert(alert)}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Macronutrients Grid */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            {t('productCard.nutritionTitle')}
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">{t('productCard.calories')}</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {scan.macronutrients.calories} <span className="text-xs font-normal text-slate-500">kcal</span>
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">{t('productCard.carbs')}</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {scan.macronutrients.carbohydrates}g
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">{t('productCard.protein')}</span>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {scan.macronutrients.protein}g
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">{t('productCard.fat', 'Gorduras')}</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {scan.macronutrients.totalFat}g
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">{t('productCard.fiber', 'Fibras')}</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {scan.macronutrients.dietaryFiber}g
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">{t('productCard.sodium')}</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {scan.macronutrients.sodium}mg
              </span>
            </div>
          </div>
        </div>

        {/* Vitamins & Minerals Breakdown */}
        {scan.vitaminsAndMinerals && scan.vitaminsAndMinerals.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
              {t('productCard.vitaminsMineralsTitle', 'Vitaminas e Minerais')}
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {scan.vitaminsAndMinerals.map((micro, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-emerald-900 dark:text-emerald-200 truncate">
                      {micro.name}
                    </span>
                    {micro.dailyValuePercent && (
                      <span className="text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                        {micro.dailyValuePercent} {t('productCard.dailyValue', 'VD')}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 block mt-0.5">
                    {micro.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TACO Scientific Audit Panel */}
      <div className="px-5 py-4 bg-emerald-50/50 dark:bg-emerald-950/30 border-b border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                {t('productCard.tacoAudit')}
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {t('productCard.tacoRef')} {getDisplayTacoItem(tacoAudit.matchedTacoItem)} ({tacoAudit.tacoId})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1 ${
              tacoAudit.validationStatus === 'conforme'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                : tacoAudit.validationStatus === 'divergente'
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
            }`}>
              {tacoAudit.validationStatus === 'conforme' ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{t('productCard.tacoCompliant')}</span>
                </>
              ) : tacoAudit.validationStatus === 'divergente' ? (
                <>
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>{t('productCard.tacoDiscrepancy')}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3 h-3 text-rose-600" />
                  <span>{t('productCard.tacoAlert')}</span>
                </>
              )}
            </span>

            <button
              onClick={() => setShowTacoDetails(!showTacoDetails)}
              className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              title={t('productCard.expandComparison')}
            >
              {showTacoDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Audit Notes Brief */}
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          {getDisplayAuditNotes()}
        </p>

        {/* Discrepancies Alert Box if any */}
        {tacoAudit.discrepancies && tacoAudit.discrepancies.length > 0 && (
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
              {t('productCard.inconsistenciesTitle')}
            </span>
            <ul className="text-[11px] text-amber-900 dark:text-amber-200 pl-4 list-disc space-y-0.5">
              {tacoAudit.discrepancies.map((d, i) => (
                <li key={i}>{translateDiscrepancy(d)}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Expandable Benchmark Comparison Table */}
        {showTacoDetails && (
          <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-800/50 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              <span>{t('productCard.centesimalTitle')}</span>
              <span>{t('productCard.category')} {getDisplayCategory(tacoAudit.category)}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[9px]">{t('productCard.calories')}</span>
                <span className="font-bold text-slate-900 dark:text-white block">{scan.macronutrients.calories} kcal</span>
                <span className="text-[9px] text-emerald-600">TACO: {tacoAudit.benchmarkPer100g.calories}</span>
              </div>

              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[9px]">{t('productCard.protein')}</span>
                <span className="font-bold text-slate-900 dark:text-white block">{scan.macronutrients.protein}g</span>
                <span className="text-[9px] text-emerald-600">TACO: {tacoAudit.benchmarkPer100g.protein}g</span>
              </div>

              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[9px]">{t('productCard.carbs')}</span>
                <span className="font-bold text-slate-900 dark:text-white block">{scan.macronutrients.carbohydrates}g</span>
                <span className="text-[9px] text-emerald-600">TACO: {tacoAudit.benchmarkPer100g.carbohydrates}g</span>
              </div>

              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[9px]">{t('productCard.sodium')}</span>
                <span className="font-bold text-slate-900 dark:text-white block">{scan.macronutrients.sodium}mg</span>
                <span className="text-[9px] text-emerald-600">TACO: {tacoAudit.benchmarkPer100g.sodium}mg</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mercado Barato & Custo-Benefício Inteligente */}
      {(scan.price !== undefined || scan.pricePer100g !== undefined) && (
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-amber-50/40 dark:bg-amber-950/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <PiggyBank className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                {t('productCard.marketTitle', 'Mercado Barato · Custo-Benefício')}
              </h4>
            </div>
            {scan.price !== undefined && (
              <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/60 rounded-md border border-amber-300/60 dark:border-amber-800/60">
                R$ {scan.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {scan.pricePer100g !== undefined && (
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  {t('productCard.pricePer100g', 'Preço por 100g')}
                </span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  R$ {scan.pricePer100g.toFixed(2)}
                </span>
              </div>
            )}

            {scan.pricePerProteinGram !== undefined && (
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  {t('productCard.pricePerProtein', 'Custo / g Proteína')}
                </span>
                <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  R$ {scan.pricePerProteinGram.toFixed(2)}/g
                </span>
              </div>
            )}

            {scan.packageWeightGrams !== undefined && (
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  {t('productCard.packageWeight', 'Peso Embalagem')}
                </span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {scan.packageWeightGrams}g
                </span>
              </div>
            )}
          </div>

          {/* Cheaper Supermarket Substitutes */}
          {scan.cheaperSwaps && scan.cheaperSwaps.length > 0 && (
            <div className="mt-3 pt-3 border-t border-amber-200/50 dark:border-amber-900/50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-200">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('productCard.cheaperSwapsTitle', 'Substituto Mais Barato no Supermercado')}</span>
              </div>

              {scan.cheaperSwaps.map((swap, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-300 dark:border-emerald-800 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {swap.productName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-bold">
                          {swap.nutriScore}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {swap.brand} · R$ {swap.pricePer100g.toFixed(2)}/100g
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">
                        R$ {swap.estimatedPrice.toFixed(2)}
                      </span>
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded">
                        -{swap.savingsPercent}% (Economize R$ {swap.savingsAmount.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                    💡 {swap.reason}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Economic Verdict & Budget Impact */}
          {(scan.economicVerdict || scan.economicAlert || scan.budgetImpactAnalysis) && (
            <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-amber-900/60 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  {t('productCard.verdictTitle', 'Veredito Econômico:')}
                </span>
                {scan.economicVerdict && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      scan.economicVerdict.toLowerCase().includes('vale a pena')
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                    }`}
                  >
                    {scan.economicVerdict}
                  </span>
                )}
              </div>

              {scan.economicAlert && (
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {scan.economicAlert}
                </p>
              )}

              {scan.budgetImpactAnalysis && (
                <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">
                  📊 {scan.budgetImpactAnalysis}
                </p>
              )}
            </div>
          )}

          {/* Homemade Swap Tip */}
          {scan.homemadeSwap && (
            <div className="mt-2.5 p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                🥣 {t('productCard.homemadeTitle', 'Substituição Caseira / Alternativa Barata:')}
              </span>
              <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                {scan.homemadeSwap}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Beneficial vs Harmful Substances Breakdown */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        
        {/* Beneficial Items */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('productCard.beneficialTitle')}</span>
          </div>
          {scan.beneficialSubstances.length > 0 ? (
            <div className="space-y-1.5">
              {scan.beneficialSubstances.map((rawItem, idx) => {
                const item = translateBeneficial(rawItem);
                return (
                  <div key={idx} className="p-2 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block">{item.name}</span>
                    <span className="text-emerald-700/80 dark:text-emerald-400/80 text-[11px]">{item.reason}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">{t('productCard.noBeneficial')}</p>
          )}
        </div>

        {/* Harmful / Nocive Substances */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{t('productCard.harmfulTitle')}</span>
          </div>
          {scan.harmfulSubstances.length > 0 ? (
            <div className="space-y-1.5">
              {scan.harmfulSubstances.map((rawItem, idx) => {
                const item = translateHarmful(rawItem);
                return (
                  <div key={idx} className="p-2 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200/60 dark:border-rose-900/40 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-800 dark:text-rose-300">{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded font-semibold">
                        {t('productCard.risk', { risk: item.risk })}
                      </span>
                    </div>
                    <span className="text-rose-700/80 dark:text-rose-400/80 text-[11px] block mt-0.5">{item.description}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-emerald-600 font-medium">{t('productCard.freeOfHarmful')}</p>
          )}
        </div>

        {/* Allergenic Substances Section */}
        <div className="md:col-span-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>{t('productCard.allergensTitle', 'Substâncias Alergênicas:')}</span>
          </div>
          {scan.allergens && scan.allergens.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {scan.allergens.map((allergen, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800/60 rounded-lg text-[11px] font-semibold"
                >
                  {allergen}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('productCard.noAllergens', 'Nenhuma substância alergênica comum identificada.')}
            </p>
          )}
        </div>

      </div>

      {/* Card Action Footer */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        {onOpenSwaps && scan.suggestedSwaps?.length > 0 ? (
          <button
            onClick={() => onOpenSwaps(scan)}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('productCard.viewSwaps', { count: scan.suggestedSwaps.length })}</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>
        ) : (
          <span className="text-xs text-slate-500 font-medium">{t('productCard.recordedStandard')}</span>
        )}
      </div>

    </div>
  );
};
