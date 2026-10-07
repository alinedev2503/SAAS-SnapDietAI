import React from 'react';
import { ProductScan } from '../types/nutrition';
import { X, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface HealthySwapsModalProps {
  scan: ProductScan | null;
  onClose: () => void;
}

export const HealthySwapsModal: React.FC<HealthySwapsModalProps> = ({ scan, onClose }) => {
  if (!scan) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Substituições Saudáveis por IA</h3>
              <p className="text-xs text-emerald-100">Alterne para opções com melhor NutriScore e zero aditivos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Scanned Product Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Produto Atual:</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{scan.productName}</h4>
            <p className="text-xs text-slate-500">{scan.brand}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">Nota {scan.healthScore}/100</span>
            <span className="text-[10px] px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 font-bold rounded">
              NutriScore {scan.nutriScore}
            </span>
          </div>
        </div>

        {/* Alternatives Carousel List */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Alternativas Recomendadas para o seu Perfil:
          </h5>

          {scan.suggestedSwaps && scan.suggestedSwaps.length > 0 ? (
            scan.suggestedSwaps.map((swap, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-emerald-500/30 hover:border-emerald-500 transition-all shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Opção #{idx + 1}</span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{swap.productName}</h4>
                    <span className="text-xs text-slate-500">{swap.brand}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block">Nota {swap.healthScore}/100</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-600 text-white font-bold rounded">
                      NutriScore {swap.nutriScore}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-200/50 dark:border-emerald-900/50 flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{swap.reason}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs">
              Este produto já possui uma das melhores classificações da categoria!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
