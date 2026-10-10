import React, { useState, useEffect } from 'react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { ProductCard } from '../components/ProductCard';
import { Calendar, Trash2, Camera, Flame, HeartPulse, WifiOff, CheckCircle2, Cloud, RefreshCw } from 'lucide-react';
import { ProductScan } from '../types/nutrition';
import { dbService, SyncStatus } from '../services/db';

interface HistoryViewProps {
  onOpenScanner: () => void;
  onOpenSwaps: (scan: ProductScan) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onOpenScanner, onOpenSwaps }) => {
  const { history, profile, removeScan } = useWhiteLabel();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(dbService.getSyncStatus());
  const [syncingNow, setSyncingNow] = useState(false);

  useEffect(() => {
    const unsub = dbService.onSyncStatusChange((status) => {
      setSyncStatus(status);
    });
    return () => unsub();
  }, []);

  const handleManualSync = async () => {
    setSyncingNow(true);
    try {
      await dbService.syncPendingScans();
    } finally {
      setSyncingNow(false);
    }
  };

  const isOffline = !syncStatus.isOnline;

  // Daily totals
  const totalCalories = history.reduce((acc, s) => acc + (s.macronutrients?.calories || 0), 0);
  const totalProtein = history.reduce((acc, s) => acc + (s.macronutrients?.protein || 0), 0);
  const totalCarbs = history.reduce((acc, s) => acc + (s.macronutrients?.carbohydrates || 0), 0);
  const totalFat = history.reduce((acc, s) => acc + (s.macronutrients?.totalFat || 0), 0);

  const calPercentage = Math.min(100, Math.round((totalCalories / profile.targetCalories) * 100));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Offline Alert Banner */}
      {isOffline ? (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-200 dark:bg-amber-900/80 rounded-xl text-amber-800 dark:text-amber-200">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold">Modo Offline Ativo — Sem conexão com a internet</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                Seu histórico de {history.length} produtos escaneados está salvo no cache local. {syncStatus.pendingCount > 0 ? `${syncStatus.pendingCount} novos scans serão sincronizados com o Firestore assim que a conexão retornar.` : 'Dados nutricionais disponíveis para consulta imediata.'}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-200/80 dark:bg-amber-900 text-[10px] font-bold rounded-lg uppercase tracking-wider shrink-0">
            Offline PWA
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between flex-wrap gap-2">
          {syncStatus.pendingCount > 0 ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-xl border border-amber-200 dark:border-amber-800 text-xs">
              <span>{syncStatus.pendingCount} scan(s) aguardando envio para o Firestore</span>
              <button
                onClick={handleManualSync}
                disabled={syncingNow || syncStatus.isSyncing}
                className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${syncingNow || syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                Sincronizar
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-[11px] text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
              <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Sincronizado com Cloud Firestore & Cache Offline</span>
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 rounded-full border border-slate-200/60 dark:border-slate-700/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Histórico persistente online/offline</span>
          </div>
        </div>
      )}
      
      {/* Daily Target Progress Bar */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <HeartPulse className="w-4 h-4" />
              Diário Alimentar do Dia
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Resumo de Consumo Escaneado</h2>
          </div>
          <button
            onClick={onOpenScanner}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Escanear Produto</span>
          </button>
        </div>

        {/* Caloric Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold font-mono">
            <span className="text-slate-700 dark:text-slate-300">
              {totalCalories} / {profile.targetCalories} kcal ({calPercentage}%)
            </span>
            <span className="text-slate-500">{profile.targetCalories - totalCalories} kcal restantes</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                calPercentage > 100 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${calPercentage}%` }}
            />
          </div>
        </div>

        {/* Macros Summary Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 block text-[10px]">Proteínas</span>
            <span className="font-bold text-emerald-600 font-mono text-sm">{totalProtein}g</span>
            <span className="text-[10px] text-slate-400 block">meta {profile.targetProtein}g</span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 block text-[10px]">Carboidratos</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-sm">{totalCarbs}g</span>
            <span className="text-[10px] text-slate-400 block">meta {profile.targetCarbs}g</span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 block text-[10px]">Gorduras</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-sm">{totalFat}g</span>
            <span className="text-[10px] text-slate-400 block">meta {profile.targetFat}g</span>
          </div>
        </div>
      </div>

      {/* Scanned Items Feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-600" />
          Histórico de Rótulos Escaneados ({history.length})
        </h3>

        {history.length > 0 ? (
          <div className="space-y-6">
            {history.map((scan) => (
              <div key={scan.id} className="relative group">
                <ProductCard scan={scan} onOpenSwaps={onOpenSwaps} />
                <button
                  onClick={() => removeScan(scan.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-800/90 text-rose-600 rounded-full shadow-sm hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700 opacity-80 group-hover:opacity-100"
                  title="Excluir do histórico"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Nenhum produto escaneado ainda</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Utilize o scanner de câmera para ler seu primeiro rótulo ou código de barras e iniciar o diário.
            </p>
            <button
              onClick={onOpenScanner}
              className="px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Escanear Agora
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
