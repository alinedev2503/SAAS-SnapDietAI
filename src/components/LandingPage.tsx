import React, { useState } from 'react';
import { Camera, Sparkles, ShieldCheck, FileBarChart, Check, ArrowRight, HeartPulse, AlertTriangle, Scale, RefreshCw, Smartphone, Award, HelpCircle } from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';

interface LandingPageProps {
  onOpenScanner: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenScanner, onNavigateToTab }) => {
  const { config } = useWhiteLabel();

  // Interactive comparison widget state
  const [activeDemo, setActiveDemo] = useState<'soda' | 'yogurt'>('soda');

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scanner Visual & Barcode</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Leitura ultrarrápida tanto da foto do rótulo quanto pelo código de barras EAN-13, funcionando perfeitamente mesmo em iluminação de supermercado.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filtro de Restrições Pessoais</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Alertas vermelhos imediatos para celíacos, intolerantes a lactose, hipertensos (sódio elevado), diabéticos (açúcares ocultos), veganos e alérgicos a amendoim.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <FileBarChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Relatórios PDF Mensais</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Acompanhe seu diário de consumo de 30 dias e baixe um relatório profissional em PDF para levar às suas consultas nutricionais ou médicas.
            </p>
          </div>

        </div>
      </section>

      {/* Pricing Table Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 text-center">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Planos & Acesso</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Escolha o plano ideal para a sua rotina</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
          
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Plano Gratuito</h3>
              <p className="text-xs text-slate-500">Ideal para degustar o scanner no dia a dia</p>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              R$ 0 <span className="text-xs font-normal text-slate-500">/mês</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 2 Scans gratuitos por sessão</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Alertas de restrições de saúde</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Classificação NutriScore Básica</li>
            </ul>
            <button
              onClick={onOpenScanner}
              className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              Testar Agora
            </button>
          </div>

          <div className="p-6 bg-emerald-600 text-white rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
            <span className="absolute top-4 right-4 px-2.5 py-1 bg-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              Popular
            </span>
            <div>
              <h3 className="text-lg font-bold">Plano Pro Ilimitado</h3>
              <p className="text-xs text-emerald-100">Scans ilimitados, relatórios PDF e trocas por IA</p>
            </div>
            <div className="text-3xl font-extrabold font-mono">
              R$ 19,90 <span className="text-xs font-normal text-emerald-200">/mês</span>
            </div>
            <ul className="text-xs text-emerald-50 space-y-2">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> Scans de câmera e código de barras ilimitados</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> Relatórios mensais exportáveis em PDF</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> Sugestões inteligentes de substituição saudável</li>
            </ul>
            <button
              onClick={onOpenScanner}
              className="w-full py-3 bg-white text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer shadow-md"
            >
              Começar Acesso Pro
            </button>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Dúvidas Frequentes</span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Perguntas Comuns</h2>
        </div>

        <div className="space-y-3 text-xs">
          
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">O scanner funciona em qualquer produto de supermercado?</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Sim! O NutriLense AI lê tanto imagens da tabela nutricional/lista de ingredientes quanto códigos de barras EAN-13 comuns em produtos brasileiros e internacionais.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Como funciona o alerta de restrições alimentares?</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              No seu perfil, você marca se possui intolerância a lactose, celíaca (glúten), hipertensão (sódio), diabetes ou alergias. Ao escanear, o aplicativo faz uma busca minuciosa na lista de ingredientes e emite avisos em destaque se houver incompatibilidade.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Posso baixar meus relatórios em PDF?</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Sim! Na aba "Relatórios PDF", você visualiza seu resumo mensal de consumo, aditivos evitados e média nutricional, podendo baixar um arquivo PDF formatado com 1 clique.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
