import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { ProductCard } from '../components/ProductCard';
import { DailyIntakeTracker } from '../components/DailyIntakeTracker';
import { Calendar, Trash2, WifiOff, CheckCircle2, Cloud, RefreshCw } from 'lucide-react';
import { ProductScan } from '../types/nutrition';
import { dbService, SyncStatus } from '../services/db';

interface HistoryViewProps {
  onOpenScanner: () => void;
  onOpenSwaps: (scan: ProductScan) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onOpenScanner, onOpenSwaps }) => {
  const { t } = useTranslation();
  const { history, removeScan } = useWhiteLabel();
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

  const [scanToDelete, setScanToDelete] = useState<ProductScan | null>(null);

  const getDisplayProductName = (scan: ProductScan) => {
    if (scan.id === 'scan_sample_1' || scan.productName.toLowerCase().includes('iogurte natural proteico')) {
      return t('productCard.sample1Name', scan.productName);
    }
    if (scan.id === 'scan_sample_2' || scan.productName.toLowerCase().includes('refrigerante cola zero')) {
      return t('productCard.sample2Name', scan.productName);
    }
    return scan.productName;
  };

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
              <p className="font-bold">{t('history.offlineActive')}</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                {t('history.offlineDesc', { count: history.length })}{' '}
                {syncStatus.pendingCount > 0
                  ? t('history.offlinePending', { count: syncStatus.pendingCount })
                  : t('history.offlineAvailable')}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-200/80 dark:bg-amber-900 text-[10px] font-bold rounded-lg uppercase tracking-wider shrink-0">
            {t('history.offlineBadge')}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between flex-wrap gap-2">
          {syncStatus.pendingCount > 0 ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-xl border border-amber-200 dark:border-amber-800 text-xs">
              <span>{t('history.pendingSync', { count: syncStatus.pendingCount })}</span>
              <button
                onClick={handleManualSync}
                disabled={syncingNow || syncStatus.isSyncing}
                className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${syncingNow || syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                {t('history.syncBtn')}
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-[11px] text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
              <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t('history.cloudSynced')}</span>
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 rounded-full border border-slate-200/60 dark:border-slate-700/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('history.persistent')}</span>
          </div>
        </div>
      )}
      
      {/* Daily Water & Caloric Intake Tracker */}
      <DailyIntakeTracker onOpenScanner={onOpenScanner} />

      {/* Scanned Items Feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-600" />
          {t('history.feedTitle', { count: history.length })}
        </h3>

        {history.length > 0 ? (
          <div className="space-y-6">
            {history.map((scan) => (
              <div key={scan.id} className="relative group">
                <ProductCard scan={scan} onOpenSwaps={onOpenSwaps} />
                <button
                  onClick={() => setScanToDelete(scan)}
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-800/90 text-rose-600 rounded-full shadow-sm hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700 opacity-80 group-hover:opacity-100"
                  title={t('history.deleteTooltip')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {t('history.emptyTitle')}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t('history.emptyDesc')}
            </p>
            <button
              onClick={onOpenScanner}
              className="px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              {t('history.scanNow')}
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {scanToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('history.deleteModalTitle')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {t('history.deleteModalDesc', { product: getDisplayProductName(scanToDelete) })}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setScanToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                {t('history.cancel')}
              </button>
              <button
                onClick={async () => {
                  const id = scanToDelete.id;
                  setScanToDelete(null);
                  await removeScan(id);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                {t('history.confirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
