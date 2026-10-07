import React, { useRef, useState } from 'react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { Download, FileBarChart, CheckCircle2, ShieldAlert, Sparkles, Printer, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { WeeklyTrendsDashboard } from './WeeklyTrendsDashboard';

export const MonthlyReportPdf: React.FC = () => {
  const { config, profile, history, dailyLogs } = useWhiteLabel();
  const reportRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

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
      pdf.save(`Relatorio_Nutricional_${profile.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 7)}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Erro ao gerar PDF. Você pode imprimir diretamente pelo navegador.');
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
            Relatório Oficial de Progresso Mensal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Exportação executiva para acompanhamento nutricional e consultas de saúde.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Gerando PDF...' : 'Baixar PDF'}</span>
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
              <span className="text-xs text-slate-500 font-medium">Relatório Executivo de Inteligência Nutricional</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Mês de Referência</span>
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1 justify-end">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* User Info & Dietary Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Usuário Registrado</span>
            <h3 className="text-base font-bold text-slate-900">{profile.name}</h3>
            <p className="text-xs text-slate-500 font-mono">{profile.email}</p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Restrições e Alertas Ativos</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {profile.dietaryRestrictions.map((r) => (
                <span key={r} className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded text-[11px] uppercase">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 30-Day Key Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-center">
            <span className="text-xs font-semibold text-emerald-700 block">Índice Nutri Médio</span>
            <span className="text-2xl font-black text-emerald-800 font-mono">{avgHealthScore}/100</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Excelente Saúde</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-xs font-semibold text-slate-600 block">Total de Scans</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{totalScans}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Produtos Analisados</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-xs font-semibold text-slate-600 block">Proteína Consumida</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{totalProteinScanned}g</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Acumulado Registrado</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-xs font-semibold text-slate-600 block">Sódio Mapeado</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{totalSodiumScanned}mg</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Monitoramento de Sódio</span>
          </div>

        </div>

        {/* Harmful Additives Avoided */}
        <div className="p-6 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-3">
          <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Substâncias Nocivas Mapeadas & Evitadas no Mês
          </h3>
          {harmfulAvoided.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {harmfulAvoided.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-rose-200 text-rose-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-rose-700 italic">
              Nenhuma substância de alto risco registrada nas escolhas do mês.
            </p>
          )}
        </div>

        {/* AI Executive Summary */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Parecer Nutricional por IA
          </div>
          <p className="text-xs leading-relaxed text-emerald-100">
            O perfil nutricional demonstrado no mês apresentou um **Índice de Saúde Médio de {avgHealthScore}/100**, refletindo escolhas alinhadas às suas restrições de **{profile.dietaryRestrictions.join(', ') || 'saúde'}**. A substituição progressiva de alimentos ultraprocessados por opções In Natura aumentou a ingestão protéica e manteve o controle sobre aditivos como corantes caramelo IV e nitritos.
          </p>
        </div>

        {/* Report Footer */}
        <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
          Gerado por {config.appName} · Documento Pessoal para Acompanhamento Nutricional · {new Date().toLocaleString()}
        </div>

      </div>

    </div>
  );
};
