import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { Download, FileBarChart, CheckCircle2, ShieldAlert, Sparkles, Printer, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { WeeklyTrendsDashboard } from './WeeklyTrendsDashboard';

export const MonthlyReportPdf: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { config, profile, history } = useWhiteLabel();
  const reportRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const isEs = i18n.language?.startsWith('es');
  const isEn = i18n.language?.startsWith('en');
  const localeCode = isEn ? 'en-US' : (isEs ? 'es-ES' : 'pt-BR');

  // Compute 30-day metrics
  const totalScans = history.length;
  const avgHealthScore = totalScans > 0
    ? Math.round(history.reduce((acc, s) => acc + s.healthScore, 0) / totalScans)
    : 82;

  const totalCaloriesScanned = history.reduce((acc, s) => acc + (s.macronutrients?.calories || 0), 0);
  const totalProteinScanned = history.reduce((acc, s) => acc + (s.macronutrients?.protein || 0), 0);
  const totalSodiumScanned = history.reduce((acc, s) => acc + (s.macronutrients?.sodium || 0), 0);

  // Harmful additives avoided list
  const harmfulAvoided = history
    .flatMap((s) => s.harmfulSubstances)
    .map((h) => h.name)
    .filter((v, i, a) => a.indexOf(v) === i);

  const translateHarmfulName = (name: string) => {
    if (/caramelo/i.test(name)) return t('productCard.subCaramel', name);
    if (/fosf[óo]rico/i.test(name)) return t('productCard.subPhosphoric', name);
    if (/gordura interesterificada|interesterified/i.test(name)) {
      return isEs
        ? 'Grasa Interesterificada'
        : isEn
        ? 'Interesterified Fat'
        : name;
    }
    if (/xarope de milho|high fructose corn syrup|jarabe de ma[íi]z/i.test(name)) {
      return isEs
        ? 'Jarabe de Maíz de Alta Fructosa'
        : isEn
        ? 'High Fructose Corn Syrup'
        : name;
    }
    if (/nitrito/i.test(name)) {
      return isEs
        ? 'Nitrito de Sodio'
        : isEn
        ? 'Sodium Nitrite'
        : name;
    }
    if (/glutamato/i.test(name)) {
      return isEs
        ? 'Glutamato Monosódico'
        : isEn
        ? 'Monosodium Glutamate'
        : name;
    }
    return name;
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const filePrefix = isEn ? 'Nutritional_Report' : (isEs ? 'Informe_Nutricional' : 'Relatorio_Nutricional');
      pdf.save(`${filePrefix}_${profile.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 7)}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert(t('reports.exportError'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Interactive Recharts Weekly Trends Dashboard */}
      <WeeklyTrendsDashboard history={history} profile={profile} />

      {/* Top Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-emerald-600" />
            {t('reports.officialTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('reports.officialSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('reports.print')}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? t('reports.generatingPdf') : t('reports.downloadPdf')}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Container */}
      <div
        ref={reportRef}
        className="bg-white text-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-8 max-w-4xl mx-auto font-sans"
      >
        
        {/* Report Header */}
        <div className="flex items-center justify-between border-b pb-6 border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.logoEmoji}</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-emerald-700">{config.appName}</h1>
              <span className="text-xs text-slate-500 font-medium">{t('reports.executiveSubtitle')}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t('reports.referenceMonth')}</span>
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1 justify-end">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {new Date().toLocaleDateString(localeCode, { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* User Info & Dietary Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('reports.registeredUser')}</span>
            <h3 className="text-base font-bold text-slate-900">{profile.name}</h3>
            <p className="text-xs text-slate-500 font-mono">{profile.email}</p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('reports.activeAlerts')}</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {profile.dietaryRestrictions.map((r) => (
                <span key={r} className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded text-[11px] uppercase">
                  {t(`restrictions.${r}`, r)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 30-Day Key Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-center">
            <span className="text-xs font-semibold text-emerald-700 block">{t('reports.avgNutriIndex')}</span>
            <span className="text-2xl font-black text-emerald-800 font-mono">{avgHealthScore}/100</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">{t('reports.excellentHealth')}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-xs font-semibold text-slate-600 block">{t('reports.totalScans')}</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{totalScans}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{t('reports.analyzedProducts')}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-xs font-semibold text-slate-600 block">{t('reports.proteinConsumed')}</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{totalProteinScanned}g</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{t('reports.recordedTotal')}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-xs font-semibold text-slate-600 block">{t('reports.sodiumTracked')}</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{totalSodiumScanned}mg</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{t('reports.sodiumMonitoring')}</span>
          </div>

        </div>

        {/* Harmful Additives Avoided */}
        <div className="p-6 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-3">
          <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            {t('reports.harmfulAvoidedTitle')}
          </h3>
          {harmfulAvoided.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {harmfulAvoided.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-rose-200 text-rose-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{translateHarmfulName(item)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-rose-700 italic">
              {t('reports.noHarmful')}
            </p>
          )}
        </div>

        {/* AI Executive Summary */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {t('reports.aiOpinionTitle')}
          </div>
          <p className="text-xs leading-relaxed text-emerald-100">
            {t('reports.aiOpinionText', {
              score: avgHealthScore,
              restrictions: profile.dietaryRestrictions.map((r) => t(`restrictions.${r}`, r)).join(', ') || t('reports.allHealth'),
            })}
          </p>
        </div>

        {/* Report Footer */}
        <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
          {t('reports.footerText', {
            appName: config.appName,
            date: new Date().toLocaleString(localeCode),
          })}
        </div>

      </div>

    </div>
  );
};
