import React from 'react';
import { ProductScan, NutriScoreGrade } from '../types/nutrition';
import { ShieldAlert, ShieldCheck, Sparkles, AlertTriangle, ArrowRight, Info, CheckCircle2, Flame, HeartPulse } from 'lucide-react';

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
  const nutriColor = NUTRI_COLORS[scan.nutriScore] || NUTRI_COLORS.C;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      
      {/* Top Banner & Health Score Overview */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              {scan.brand || 'Marca Desconhecida'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {scan.productName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Porção: {scan.servingSize} {scan.barcode ? `· EAN: ${scan.barcode}` : ''}
            </p>
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
            <span className="text-[10px] font-medium text-slate-500 mt-1">Índice Nutri</span>
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
            NOVA {scan.novaGroup}: <span className="font-semibold">{scan.novaDescription}</span>
          </div>

        </div>

        {/* Triggered Dietary Restriction Alerts */}
        {scan.triggeredAlerts.length > 0 && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Alertas de Restrições e Saúde:</span>
            </div>
            <ul className="text-xs text-rose-800 dark:text-rose-300 space-y-0.5 pl-5 list-disc">
              {scan.triggeredAlerts.map((alert, idx) => (
                <li key={idx} className="font-medium">{alert}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Macronutrients Grid */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500" />
          Tabela Nutricional por Porção
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">Calorias</span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
              {scan.macronutrients.calories} <span className="text-xs font-normal text-slate-500">kcal</span>
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">Proteínas</span>
            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {scan.macronutrients.protein}g
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">Carboidratos</span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
              {scan.macronutrients.carbohydrates}g
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">Sódio</span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
              {scan.macronutrients.sodium}mg
            </span>
          </div>

        </div>
      </div>

      {/* Beneficial vs Harmful Substances Breakdown */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        
        {/* Beneficial Items */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Componentes Benéficos:</span>
          </div>
          {scan.beneficialSubstances.length > 0 ? (
            <div className="space-y-1.5">
              {scan.beneficialSubstances.map((item, idx) => (
                <div key={idx} className="p-2 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block">{item.name}</span>
                  <span className="text-emerald-700/80 dark:text-emerald-400/80 text-[11px]">{item.reason}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Nenhum nutriente benéfico relevante destacado neste rótulo.</p>
          )}
        </div>

        {/* Harmful / Nocive Substances */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Aditivos e Substâncias Nocivas:</span>
          </div>
          {scan.harmfulSubstances.length > 0 ? (
            <div className="space-y-1.5">
              {scan.harmfulSubstances.map((item, idx) => (
                <div key={idx} className="p-2 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200/60 dark:border-rose-900/40 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-800 dark:text-rose-300">{item.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded font-semibold">
                      Risco {item.risk}
                    </span>
                  </div>
                  <span className="text-rose-700/80 dark:text-rose-400/80 text-[11px] block mt-0.5">{item.description}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-600 font-medium">Livre de aditivos nocivos detectados!</p>
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
            <span>Ver Substituições Saudáveis ({scan.suggestedSwaps.length})</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>
        ) : (
          <span className="text-xs text-slate-500 font-medium">Análise registrada no diário</span>
        )}
      </div>

    </div>
  );
};
