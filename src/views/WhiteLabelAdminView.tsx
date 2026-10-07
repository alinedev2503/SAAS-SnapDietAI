import React, { useState } from 'react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { Sliders, Database, Palette, Save, ShieldCheck, Check, Copy, ExternalLink, Code2 } from 'lucide-react';

export const WhiteLabelAdminView: React.FC = () => {
  const { config, updateConfig } = useWhiteLabel();

  const [appName, setAppName] = useState(config.appName);
  const [logoEmoji, setLogoEmoji] = useState(config.logoEmoji);
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor);
  const [activeAdapter, setActiveAdapter] = useState<'local' | 'supabase' | 'firebase'>(config.activeAdapter);
  const [demoMaxScans, setDemoMaxScans] = useState(config.demoMaxScans);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateConfig({
      appName,
      logoEmoji,
      primaryColor,
      activeAdapter,
      demoMaxScans: Number(demoMaxScans),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sliders className="w-4 h-4" />
            Painel Comercial do Comprador
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold">Configurações White-Label & Arquitetura Dual-Adapter</h2>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? 'Salvo!' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {/* Backend Selection Section */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-600" />
            Selecione o Fornecedor de Banco de Dados (Dual-Adapter)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Alterne o backend do produto em tempo de execução sem alterar o código de apresentação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Local Memory Adapter */}
          <div
            onClick={() => setActiveAdapter('local')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
              activeAdapter === 'local'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Local Memory / Browser</span>
              {activeAdapter === 'local' && <Check className="w-4 h-4 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Sem necessidade de credenciais. Armazenamento no navegador ideal para testes instantâneos e demonstrações offline.
            </p>
          </div>

          {/* Supabase Adapter */}
          <div
            onClick={() => setActiveAdapter('supabase')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
              activeAdapter === 'supabase'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Supabase (PostgreSQL)</span>
              {activeAdapter === 'supabase' && <Check className="w-4 h-4 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Banco relacional PostgreSQL com Row Level Security (RLS), suporte a SQL nativo e autenticação JWT.
            </p>
          </div>

          {/* Firebase Adapter */}
          <div
            onClick={() => setActiveAdapter('firebase')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
              activeAdapter === 'firebase'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Firebase (Firestore)</span>
              {activeAdapter === 'firebase' && <Check className="w-4 h-4 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Banco NoSQL Firestore em nuvem com regras de segurança granulares e sincronização em tempo real.
            </p>
          </div>

        </div>
      </div>

      {/* Branding Personalization */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-emerald-600" />
          Personalização da Marca & Limite do Demo
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Nome da Marca</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Emoji / Ícone da Logo</label>
            <input
              type="text"
              value={logoEmoji}
              onChange={(e) => setLogoEmoji(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Cor Primária (Hex)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Limite Scans Demo Grátis</label>
            <input
              type="number"
              value={demoMaxScans}
              onChange={(e) => setDemoMaxScans(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

        </div>
      </div>

      {/* Developer Env File Helper */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Code2 className="w-4 h-4" />
            Configuração de Variáveis de Ambiente (.env)
          </span>
          <button
            type="button"
            onClick={() => handleCopy(`GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"\nVITE_ACTIVE_STORAGE_ADAPTER="${activeAdapter}"\nVITE_APP_NAME="${appName}"`, 'env')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedText === 'env' ? 'Copiado!' : 'Copiar .env'}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-950 rounded-2xl overflow-x-auto text-emerald-300 leading-relaxed">
{`# Variáveis do Servidor e IA
GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"
APP_URL="https://seu-dominio.com"

# Variáveis do Cliente White-Label
VITE_ACTIVE_STORAGE_ADAPTER="${activeAdapter}"
VITE_APP_NAME="${appName}"
VITE_PRIMARY_COLOR="${primaryColor}"`}
        </pre>
      </div>

    </form>
  );
};
