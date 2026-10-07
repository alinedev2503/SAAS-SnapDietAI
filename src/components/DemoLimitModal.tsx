import React from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';

interface DemoLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: () => void;
}

export const DemoLimitModal: React.FC<DemoLimitModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const { config } = useWhiteLabel();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 text-center p-6 space-y-5 relative">
        
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
            Limite do Modo Demonstração
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            Você atingiu o limite de {config.demoMaxScans} leituras gratuitas!
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Para continuar escaneando rótulos ilimitados, salvando seu histórico e gerando relatórios mensais em PDF, escolha uma das assinaturas da plataforma.
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl text-left space-y-2 border border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Scans ilimitados de câmera & códigos de barras</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Alertas de lactose, glúten, sódio e diabetes</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Relatórios mensais de saúde em PDF para download</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              if (onSelectPlan) onSelectPlan();
            }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ver Planos & Desbloquear Acesso</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium cursor-pointer"
          >
            Continuar Navegando
          </button>
        </div>

      </div>
    </div>
  );
};
