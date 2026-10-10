import React, { useState } from 'react';
import {
  Camera,
  Sparkles,
  ShieldCheck,
  FileBarChart,
  Check,
  ArrowRight,
  HeartPulse,
  AlertTriangle,
  Scale,
  RefreshCw,
  Smartphone,
  Award,
  HelpCircle,
  CreditCard,
  Lock,
  Loader2,
  CheckCircle2,
  Sliders,
  Database,
  Zap,
  BarChart3,
  Layers,
  Code2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  WifiOff,
  BookOpen,
  Download,
  Mail,
  Globe,
  MapPin,
  Navigation,
  Cloud,
} from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';

interface LandingPageProps {
  onOpenScanner: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenScanner, onNavigateToTab }) => {
  const { config, currentPlan, setPlan, subscribeStripePlan } = useWhiteLabel();

  // Interactive comparison widget state
  const [activeDemo, setActiveDemo] = useState<'soda' | 'yogurt'>('soda');
  const [subscribingPlan, setSubscribingPlan] = useState<'pro' | 'plus' | null>(null);
  const [stripeNotification, setStripeNotification] = useState<string | null>(null);
  const [showStripeSpecs, setShowStripeSpecs] = useState<boolean>(false);
  const [isSyncingStripe, setIsSyncingStripe] = useState<boolean>(false);
  const [stripeSyncResult, setStripeSyncResult] = useState<any>(null);
  const [weeklyUsageEstimate, setWeeklyUsageEstimate] = useState<number>(5);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubscribe = async (plan: 'pro' | 'plus') => {
    setSubscribingPlan(plan);
    setStripeNotification(null);
    try {
      const res = await subscribeStripePlan(plan);
      if (res.message) {
        setStripeNotification(res.message);
        setTimeout(() => setStripeNotification(null), 5000);
      }
    } finally {
      setSubscribingPlan(null);
    }
  };

  const handleSyncStripeProduct = async () => {
    setIsSyncingStripe(true);
    try {
      const response = await fetch('/api/stripe/provision-product', { method: 'POST' });
      const data = await response.json();
      setStripeSyncResult(data);
    } catch (err: any) {
      setStripeSyncResult({ success: false, message: err.message });
    } finally {
      setIsSyncingStripe(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-12">
        
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Inteligência Nutricional por IA & Leitura de Rótulos ao Vivo</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance">
            Descubra o que está <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-300/60 decoration-wavy underline-offset-8">escondido</span> nos rótulos do supermercado.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed text-balance">
            Aponte a câmera para qualquer produto. O NutriLense AI identifica açúcares ocultos, aditivos químicos nocivos, alertas para suas restrições e indica substituições mais saudáveis instantaneamente.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenScanner}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              <Camera className="w-5 h-5" />
              <span>Escanear Rótulo Agora</span>
            </button>

            <button
              onClick={() => onNavigateToTab('reports')}
              className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-semibold text-sm rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <FileBarChart className="w-4 h-4 text-emerald-600" />
              <span>Ver Relatório Mensal em PDF</span>
            </button>
          </div>

          {/* Quick Feature Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              Leitura por Câmera em Segundos
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              Alertas para Lactose, Glúten & Sódio
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              Mapeamento de Aditivos Nocivos
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              Sugestão de Trocas Saudáveis
            </span>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Como Funciona</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Alimentação consciente em 3 passos simples</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aponte a Câmera</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tire uma foto da lista de ingredientes ou da tabela nutricional no supermercado, ou digite o código de barras EAN.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Análise Instantânea por IA</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              A inteligência artificial traduz nomes químicos complexos, calcula o NutriScore (A a E) e identifica o grau de processamento.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Alertas & Substituições</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Receba avisos instantâneos se o produto violar suas restrições e descubra alternativas mais saudáveis para colocar no carrinho.
            </p>
          </div>

        </div>
      </section>

      {/* Interactive Food Comparison Widget */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto space-y-8">
        <div className="max-w-3xl space-y-3 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 justify-center sm:justify-start">
            <Scale className="w-4 h-4" />
            Demonstração Interativa
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Veja a diferença entre um ultraprocessado e uma opção saudável</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Selecione o produto abaixo para simular o resultado do scanner do NutriLense AI:
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveDemo('soda')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDemo === 'soda' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🥤 Refrigerante Cola Zero vs. Kombucha Natural
          </button>
          <button
            onClick={() => setActiveDemo('yogurt')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDemo === 'yogurt' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🥛 Iogurte Proteico Natural vs. Iogurte Aromatizado
          </button>
        </div>

        {/* Demo Cards Grid */}
        {activeDemo === 'soda' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-900">
            
            {/* Bad Choice */}
            <div className="p-5 bg-white rounded-2xl border-2 border-rose-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Ultraprocessado NOVA 4</span>
                  <h4 className="text-base font-bold">Refrigerante Cola Zero</h4>
                  <span className="text-xs text-slate-500">Aditivos Químicos Sintéticos</span>
                </div>
                <div className="px-3 py-1 bg-rose-600 text-white font-black rounded-lg text-sm">
                  NutriScore E (32/100)
                </div>
              </div>

              <div className="p-2.5 bg-rose-50 rounded-xl text-xs text-rose-800 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1 text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Aditivos Nocivos Detectados:
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Corante Caramelo IV (E150d) — risco carcinogênico alto</li>
                  <li>Ácido Fosfórico (E338) — prejudica absorção de cálcio</li>
                  <li>Adoçantes Artificiais (Sucralose & Acessulfame K)</li>
                </ul>
              </div>
            </div>

            {/* Good Choice */}
            <div className="p-5 bg-white rounded-2xl border-2 border-emerald-500 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">In Natura / Probiótico</span>
                  <h4 className="text-base font-bold">Kombucha Orgânica de Gengibre</h4>
                  <span className="text-xs text-slate-500">Bebida Fermentada Natural</span>
                </div>
                <div className="px-3 py-1 bg-emerald-600 text-white font-black rounded-lg text-sm">
                  NutriScore A (88/100)
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Benefícios Nutricionais:
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Probióticos vivos para a saúde da microbiota intestinal</li>
                  <li>Zero aditivos, corantes sintéticos ou conservantes</li>
                  <li>Gaseificação 100% natural</li>
                </ul>
              </div>
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-900">
            
            {/* Good Choice */}
            <div className="p-5 bg-white rounded-2xl border-2 border-emerald-500 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Minimamente Processado</span>
                  <h4 className="text-base font-bold">Iogurte Natural Proteico 20g</h4>
                  <span className="text-xs text-slate-500">Apenas 3 Ingredientes Legítimos</span>
                </div>
                <div className="px-3 py-1 bg-emerald-600 text-white font-black rounded-lg text-sm">
                  NutriScore A (92/100)
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Ingredientes Limpos:
                </div>
                <p className="text-[11px]">Leite desnatado, fermentos lácteos vivos e proteína de soro de leite. Zero açúcares adicionados.</p>
              </div>
            </div>

            {/* Bad Choice */}
            <div className="p-5 bg-white rounded-2xl border-2 border-rose-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Ultraprocessado NOVA 4</span>
                  <h4 className="text-base font-bold">Iogurte Aromatizado Morango</h4>
                  <span className="text-xs text-slate-500">Açúcares Ocultos & Espessantes</span>
                </div>
                <div className="px-3 py-1 bg-amber-500 text-white font-black rounded-lg text-sm">
                  NutriScore D (42/100)
                </div>
              </div>

              <div className="p-2.5 bg-rose-50 rounded-xl text-xs text-rose-800 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1 text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Alertas do Rótulo:
                </div>
                <p className="text-[11px]">Contém 18g de açúcar adicionado por porção, xarope de glicose, corante carmim de cochonilha e espessante goma guar.</p>
              </div>
            </div>

          </div>
        )}

        <div className="text-center pt-2">
          <button
            onClick={onOpenScanner}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Testar Scanner com sua Câmera</span>
          </button>
        </div>
      </section>

      {/* Feature Deep Dive Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Recursos do Aplicativo</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Tudo para proteger sua saúde e de sua família</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scanner Visual & Barcode</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Leitura ultrarrápida tanto da foto do rótulo quanto pelo código de barras EAN-13, funcionando perfeitamente em qualquer dispositivo.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filtro de Restrições</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Alertas imediatos para celíacos, intolerantes a lactose, hipertensos (sódio elevado), diabéticos, veganos e alérgicos.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <FileBarChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Relatórios PDF Mensais</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Acompanhe seu diário de consumo de 30 dias e baixe um relatório profissional em PDF para levar às suas consultas nutricionais.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Cloud className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Firestore & Google Auth</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Persistência segura em nuvem com Cloud Firestore e login Google em 1 clique. Seus dados e medalhas sincronizados em tempo real.
            </p>
          </div>

        </div>
      </section>

      {/* Pricing Table Section — NutriLense AI on Stripe */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 text-center">
        
        {/* Header & Value Proposition */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Stripe Checkout Oficial • Produto NutriLense AI</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Planos Transparentes & Cota Inteligente de Leituras
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Comece na degustação gratuita com 2 scans, escolha o <strong>Plano Pro</strong> com cota de 20 scans no mês para compras rotineiras ou libere <strong>Scans Ilimitados no Plano Plus</strong> por R$ 49,90/mês.
          </p>
        </div>

        {/* Stripe Notification banner */}
        {stripeNotification && (
          <div className="max-w-lg mx-auto p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-2xl text-xs font-semibold text-emerald-900 dark:text-emerald-100 flex items-center justify-center gap-2.5 shadow-md animate-fade-in">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>{stripeNotification}</span>
          </div>
        )}

        {/* Interactive Usage & Quota Simulator */}
        <div className="max-w-3xl mx-auto p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Simulador de Uso no Supermercado:</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              {weeklyUsageEstimate <= 2 && 'Degustação rápida'}
              {weeklyUsageEstimate > 2 && weeklyUsageEstimate <= 5 && 'Perfil Compras Semanais (~20 scans/mês)'}
              {weeklyUsageEstimate > 5 && 'Perfil Diário / Família / Dieta Ativa (>20 scans/mês)'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setWeeklyUsageEstimate(1)}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                weeklyUsageEstimate <= 2
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="font-bold text-sm">2 Scans</div>
              <div className="text-[10px] opacity-80">Degustação</div>
            </button>

            <button
              onClick={() => setWeeklyUsageEstimate(5)}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                weeklyUsageEstimate > 2 && weeklyUsageEstimate <= 5
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="font-bold text-sm">20 Scans/mês</div>
              <div className="text-[10px] opacity-80">Recomendado: Pro</div>
            </button>

            <button
              onClick={() => setWeeklyUsageEstimate(10)}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                weeklyUsageEstimate > 5
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="font-bold text-sm">Ilimitado</div>
              <div className="text-[10px] opacity-80">Recomendado: Plus</div>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto items-stretch">
          
          {/* Card 1: Plano Gratuito */}
          <div className={`p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border transition-all flex flex-col justify-between ${
            currentPlan === 'free'
              ? 'border-slate-400 ring-2 ring-slate-300 dark:ring-slate-700 shadow-md'
              : 'border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Degustação</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gratuito</h3>
                </div>
                {currentPlan === 'free' ? (
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-full">
                    Plano Ativo
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-semibold rounded-full">
                    Sem Cartão
                  </span>
                )}
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                R$ 0,00 <span className="text-xs font-normal text-slate-500">/mês</span>
              </div>
              
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                <span>2 scans gratuitos de teste</span>
              </div>

              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 pt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>2 leituras completas de rótulos via câmera</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Detecção de açúcares ocultos e aditivos nocivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Alertas para lactose, glúten e sódio</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Fundamentação pela Tabela TACO (UNICAMP)</span>
                </li>
                <li className="flex items-start gap-2 text-slate-400 dark:text-slate-500">
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-[10px] text-slate-400">✕</span>
                  <span>Sem histórico prolongado ou relatórios mensais</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setPlan('free');
                onOpenScanner();
              }}
              className="mt-8 w-full py-3.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{currentPlan === 'free' ? 'Testar Scanner Grátis' : 'Voltar para Gratuito'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Plano Pro (20 Scans no mês) */}
          <div className={`p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border transition-all flex flex-col justify-between relative ${
            currentPlan === 'pro'
              ? 'border-emerald-500 ring-2 ring-emerald-400 shadow-lg'
              : 'border-slate-200/90 dark:border-slate-800 shadow-md hover:border-emerald-400'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Compras da Semana
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Plano Pro</h3>
                </div>
                {currentPlan === 'pro' ? (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    Plano Ativo
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                    Cota Mensal
                  </span>
                )}
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                R$ 24,90 <span className="text-xs font-normal text-slate-500">/mês</span>
              </div>

              {/* Destaque do Limite de 20 Scans */}
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Limite de 20 Scans no mês</span>
              </div>

              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 pt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>20 leituras de rótulos por mês</strong> (câmera & código de barras)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Mapeamento profundo de alérgenos e conservantes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Diário alimentar com histórico de 30 dias</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Sugestão de substituições saudáveis por IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Geração de relatórios mensais em PDF</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('pro')}
              disabled={subscribingPlan !== null}
              className="mt-8 w-full py-3.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {subscribingPlan === 'pro' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              <span>{currentPlan === 'pro' ? 'Plano Atual (Renovar)' : 'Assinar Pro com Stripe (R$ 24,90)'}</span>
            </button>
          </div>

          {/* Card 3: Plano Plus (Scans Ilimitados - R$ 49,90) */}
          <div className="p-6 sm:p-7 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden border-2 border-emerald-400">
            <span className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider border border-white/30 shadow-sm">
              Mais Escolhido • Sem Limites
            </span>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                  Uso Irrestrito
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">Plano Plus</h3>
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                R$ 49,90 <span className="text-xs font-normal text-emerald-100">/mês</span>
              </div>

              <div className="text-xs font-extrabold text-emerald-950 bg-emerald-100 px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Scans 100% ILIMITADOS</span>
              </div>

              <ul className="text-xs text-emerald-50 space-y-2.5 pt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
                  <span><strong>Scans ILIMITADOS</strong> de câmera e código de barras</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
                  <span>IA Gemini 3.8 Flash prioritária (Tabela TACO oficial)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
                  <span>Substituições saudáveis personalizadas sem limites</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
                  <span>Relatórios executivos mensais em PDF com gráficos Recharts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
                  <span>Suporte prioritário e novidades antecipadas</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('plus')}
              disabled={subscribingPlan !== null}
              className="mt-8 w-full py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-xs rounded-2xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              {subscribingPlan === 'plus' ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-800" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-600" />
              )}
              <span>{currentPlan === 'plus' ? 'Plano Atual (Ativo)' : 'Assinar Plus com Stripe (R$ 49,90)'}</span>
            </button>
          </div>

        </div>

        {/* Stripe Product Integration Drawer & Inspector */}
        <div className="max-w-4xl mx-auto p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Integração do Produto no Stripe: NutriLense AI
                </h4>
                <p className="text-[11px] text-slate-500">
                  Estrutura oficial de produto e preços sincronizáveis via Stripe API
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStripeSpecs(!showStripeSpecs)}
                className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{showStripeSpecs ? 'Ocultar Parâmetros' : 'Ver IDs do Stripe'}</span>
              </button>

              <button
                onClick={handleSyncStripeProduct}
                disabled={isSyncingStripe}
                className="px-3.5 py-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
              >
                {isSyncingStripe ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Sincronizar no Stripe</span>
              </button>
            </div>
          </div>

          {stripeSyncResult && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{stripeSyncResult.message}</span>
            </div>
          )}

          {showStripeSpecs && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="font-sans font-bold text-slate-800 dark:text-slate-200 text-[11px] flex items-center justify-between">
                  <span>Produto Stripe</span>
                  <span className="text-emerald-600">Ativo</span>
                </div>
                <div className="text-[11px] text-slate-500">Nome: <strong className="text-slate-900 dark:text-white">NutriLense AI</strong></div>
                <div className="text-[11px] text-slate-500">Product ID: <strong className="text-slate-900 dark:text-white">prod_nutrilense_ai</strong></div>
                <div className="text-[11px] text-slate-500">Moeda: <strong className="text-slate-900 dark:text-white">BRL (R$)</strong></div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="font-sans font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                  Preços & Cotas Recorrentes
                </div>
                <div className="text-[11px] text-slate-500">
                  Pro: <strong className="text-slate-900 dark:text-white">price_nutrilense_pro_20scans</strong> (R$ 24,90/mês • 20 scans)
                </div>
                <div className="text-[11px] text-slate-500">
                  Plus: <strong className="text-slate-900 dark:text-white">price_nutrilense_plus_unlimited</strong> (R$ 49,90/mês • Ilimitado)
                </div>
                <div className="text-[11px] text-slate-500">Intervalo: <strong className="text-slate-900 dark:text-white">Mensal</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Stripe Trust & Security Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            Pagamentos Criptografados via Stripe
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            Cartões de Crédito, Débito e Pix
          </span>
          <span>·</span>
          <span>Cancele a qualquer momento em 1 clique</span>
          <span>·</span>
          <span>Ativação imediata de cota</span>
        </div>

      </section>

      {/* Google Maps Nutritionist Integration Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-900/50 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                <MapPin className="w-3.5 h-3.5" />
                Integração com Google Maps
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Encontre o Nutricionista Mais Próximo da Sua Localização
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Aliamos a inteligência artificial do scanner à prescrição humana personalizada.
                Descubra clínicas e consultórios credenciados com registro ativo no CRN, filtre por especialidade
                (doenças crônicas, esportiva, funcional ou reeducação) e trace a rota no Google Maps com um clique.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigateToTab('nutritionists')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  Explorar Nutricionistas no Mapa
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  GPS em tempo real + dados georreferenciados
                </span>
              </div>
            </div>

            <div className="md:col-span-4 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
                <Sparkles className="w-4 h-4" />
                CONECTIVIDADE CLÍNICA
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compartilhe seu diário nutricional NutriLense e histórico da Tabela TACO diretamente com seu nutricionista antes da consulta.
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>Google Maps Platform</span>
                <span className="text-emerald-400">Raio até 50km</span>
              </div>
            </div>
          </div>

          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-full text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Perguntas Frequentes</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Tudo o que você precisa saber sobre o funcionamento do scanner, auditoria científica TACO, modo offline e planos de acesso.
          </p>
        </div>

        <div className="space-y-3.5">
          {[
            {
              category: 'Restrições & Saúde',
              icon: AlertTriangle,
              q: 'Como o app analisa restrições?',
              a: 'O NutriLense AI compara a lista completa de ingredientes e a composição centesimal do produto contra o seu perfil personalizado (lactose, glúten, sódio elevado para hipertensos, açúcares ocultos para diabéticos ou alergias alimentares). Utilizando a visão computacional do modelo Gemini, o sistema identifica derivados sutis, aditivos camuflados e contaminações cruzadas indicadas no rótulo, disparando alertas imediatos destacados em vermelho caso haja qualquer incompatibilidade com sua dieta.',
            },
            {
              category: 'Base Científica & Precisão',
              icon: BookOpen,
              q: 'A base de dados é confiável?',
              a: 'Sim, 100% fundamentada na ciência. Além da inteligência artificial de leitura de rótulos, o aplicativo utiliza a Tabela Brasileira de Composição de Alimentos — TACO (NEPA/UNICAMP 4ª Edição) como referência analítica secundária. Isso permite auditar a densidade calórica, distribuição de macronutrientes (proteínas, carboidratos e gorduras) e níveis de sódio real contra matrizes biológicas oficiais brasileiras, detectando divergências ou informações enganosas da indústria.',
            },
            {
              category: 'Conectividade & PWA',
              icon: WifiOff,
              q: 'Posso usar o scanner offline?',
              a: 'O histórico e a consulta de produtos escaneados funcionam perfeitamente sem internet graças à arquitetura Progressive Web App (PWA) com Service Worker avançado e cache local persistente. Caso você esteja em um supermercado com sinal fraco de 4G/5G, você pode consultar todos os alimentos previamente escaneados, revisar notas de saúde e macronutrientes. Para escanear um novo rótulo com visão multimodal Gemini e validação TACO em tempo real, uma conexão momentânea é utilizada para o processamento de imagem.',
            },
            {
              category: 'Assinatura & Stripe',
              icon: CreditCard,
              q: 'Como cancelo minha assinatura?',
              a: 'Você pode cancelar sua assinatura a qualquer momento com apenas 1 clique, sem burocracia ou taxas de rescisão. Toda a gestão de faturamento é processada diretamente pela infraestrutura segura do Stripe. Ao cancelar, você continua com acesso total aos benefícios do seu plano Pro ou Plus até o final do período mensal já contratado, retornando automaticamente ao plano gratuito sem nenhuma cobrança surpresa subsequente.',
            },
            {
              category: 'Reconhecimento & Câmera',
              icon: Camera,
              q: 'O scanner funciona em qualquer produto de supermercado?',
              a: 'Sim! O NutriLense AI lê tanto fotos da tabela nutricional e lista de ingredientes quanto códigos de barras EAN-13 comuns em produtos nacionais e internacionais. A IA classifica o grupo NOVA (nível de ultraprocessamento de 1 a 4), calcula a nota Nutri-Score (A a E) e rastreia aditivos nocivos em poucos segundos.',
            },
            {
              category: 'Instalação Instantânea',
              icon: Smartphone,
              q: 'Preciso baixar pela Google Play ou Apple App Store para ter o app no celular?',
              a: 'Não é necessário baixar das lojas de aplicativos! O NutriLense AI é um PWA homologado: você pode instalá-lo diretamente pelo navegador (no Safari do iPhone clicando em "Compartilhar" → "Adicionar à Tela de Início"; ou no Chrome/Android clicando no botão "Instalar App" no topo). Ele abre instantaneamente em tela cheia com comportamento de aplicativo nativo.',
            },
            {
              category: 'Relatórios Executivos',
              icon: FileBarChart,
              q: 'Posso exportar relatórios nutricionais em PDF para levar ao médico ou nutricionista?',
              a: 'Sim! Na aba "Relatórios PDF", você visualiza dashboards de evolução semanal de macronutrientes e calorias com gráficos Recharts e gera com um clique relatórios executivos para download ou impressão, ideais para acompanhamento esportivo ou consultas de rotina.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">
                        {item.q}
                      </h4>
                    </div>
                  </div>

                  <div className={`p-1.5 rounded-lg text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-slate-100 dark:border-slate-800/80">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-3">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-16 pt-12 pb-8 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            {/* App Info & Bio */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{config.logoEmoji}</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {config.appName}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
                Plataforma de inteligência nutricional multimodal combinando visão computacional Gemini, padrão científico TACO (UNICAMP) e navegação offline PWA.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>Desenvolvido com Engenharia de Alta Performance</span>
              </div>
            </div>

            {/* Quick Links & Developer Portfolio */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Desenvolvedor & Portfólio
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Conheça outros projetos, soluções de software e arquiteturas completas desenvolvidas pela criadora do NutriLense AI:
              </p>
              <div>
                <a
                  href="https://alinedev.ai.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl text-xs font-bold transition-all shadow-sm group"
                >
                  <Globe className="w-4 h-4 text-emerald-400 dark:text-white" />
                  <span>Acessar Portfólio Aline DEV</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
              <span className="text-[11px] text-slate-400 block font-mono">
                alinedev.ai.studio
              </span>
            </div>

            {/* Forms of Contact & Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Fale Conosco & Suporte
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dúvidas comerciais, parcerias, suporte técnico ou feedback sobre o NutriLense AI:
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:falecomnutrion@gmail.con"
                  className="inline-flex items-center gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors w-full"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">E-mail de Contato</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold truncate block">
                      falecomnutrion@gmail.con
                    </span>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} {config.appName}. Todos os direitos reservados.
            </p>
            <p className="text-[11px]">
              Portfólio Oficial:{' '}
              <a
                href="https://alinedev.ai.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                alinedev.ai.studio
              </a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};
