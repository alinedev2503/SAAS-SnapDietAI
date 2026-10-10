import React, { useState } from 'react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import {
  User as UserIcon,
  ShieldAlert,
  HeartPulse,
  Check,
  Save,
  Trophy,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  Cloud,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { DietaryRestriction } from '../types/nutrition';
import { calculateUserAchievements } from '../data/achievements';

const RESTRICTIONS_LIST: { id: DietaryRestriction; label: string; desc: string }[] = [
  { id: 'lactose', label: 'Intolerância a Lactose', desc: 'Alerta para leite, soro, manteiga e derivados lácteos' },
  { id: 'gluten', label: 'Doença Celíaca / Sem Glúten', desc: 'Alerta para trigo, centeio, cevada e maltes' },
  { id: 'peanuts', label: 'Alergia a Amendoim & Oleaginosas', desc: 'Alerta rigoroso para traços de castanhas e amendoim' },
  { id: 'sodium', label: 'Restrição de Sódio (Hipertensão)', desc: 'Alerta para alimentos acima de 300mg de sódio' },
  { id: 'diabetes', label: 'Controle de Glicemia / Diabetes', desc: 'Alerta para xarope de milho, sacarose e açúcares livres' },
  { id: 'vegan', label: 'Dieta Vegana', desc: 'Alerta para ingredientes de origem animal e mel' },
  { id: 'vegetarian', label: 'Dieta Vegetariana', desc: 'Alerta para carnes, peixes e gelatinas animais' },
  { id: 'soy', label: 'Alergia a Soja', desc: 'Alerta para lecitina e proteínas concentradas de soja' },
  { id: 'keto', label: 'Dieta Cetogênica (Keto)', desc: 'Alerta para itens ricos em carboidratos líquidos' },
];

export const ProfileView: React.FC = () => {
  const { profile, history, updateProfile, currentUser, signInWithGoogle, signOut } = useWhiteLabel();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>(profile.dietaryRestrictions);
  const [targetCalories, setTargetCalories] = useState(profile.targetCalories);
  const [targetProtein, setTargetProtein] = useState(profile.targetProtein);
  const [targetCarbs, setTargetCarbs] = useState(profile.targetCarbs);
  const [targetFat, setTargetFat] = useState(profile.targetFat);
  const [isSaved, setIsSaved] = useState(false);

  const achievements = calculateUserAchievements(history, profile);
  const unlockedCount = achievements.filter((a) => a.progress === 100).length;

  const toggleRestriction = (id: DietaryRestriction) => {
    if (restrictions.includes(id)) {
      setRestrictions(restrictions.filter((r) => r !== id));
    } else {
      setRestrictions([...restrictions, id]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      email,
      dietaryRestrictions: restrictions,
      targetCalories: Number(targetCalories),
      targetProtein: Number(targetProtein),
      targetCarbs: Number(targetCarbs),
      targetFat: Number(targetFat),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Configurações Pessoais
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Perfil, Metas e Medalhas</h2>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? 'Salvo!' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {/* Firebase Cloud Firestore & Google Auth Card */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl border border-emerald-900/40 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Firebase Cloud Firestore & Google Auth
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  Enterprise
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {currentUser ? 'Sincronização em Nuvem Ativa' : 'Conecte sua Conta para Sincronização em Nuvem'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {currentUser
                  ? `Seus escaneamentos de rótulos, restrições alimentares e metas nutricionais estão sendo persistidos de forma segura no Cloud Firestore do Firebase.`
                  : `Seus dados estão armazenados localmente neste navegador. Faça login com o Google para salvar histórico, restrições e conquistas na nuvem de modo persistente.`}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {currentUser ? (
              <div className="flex flex-col sm:items-end gap-2">
                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Google'}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="text-xs font-medium text-slate-200">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Desconectar Conta Google</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Conectar com Google</span>
              </button>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
          <span>Banco: ai-studio-saasnutrilenseai-efd4e35f-21da-40cb-8599-0ada1ea97d08</span>
          <span>Projeto: studio-9411389430-61164</span>
          <span className="text-emerald-400">Regras de Segurança ABAC Ativas</span>
        </div>
      </div>

      {/* Gamification: Achievements and Badges */}
      <div className="p-6 bg-gradient-to-br from-white via-white to-emerald-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Sistema de Conquistas & Gamificação
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Medalhas de Hábitos & Metas Atingidas
            </h3>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-full self-start sm:self-auto">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
              {unlockedCount} de {achievements.length} Desbloqueadas
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((item) => {
            const isUnlocked = item.progress >= 100;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 shadow-sm ring-1 ring-emerald-500/20'
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/80 opacity-80'
                }`}
              >
                {/* Top Badge Banner */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900 border border-amber-200 dark:border-amber-700'
                        : 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 grayscale'
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      {isUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Conquistada
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 shrink-0">
                          {item.progress}%
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar and milestone */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span>Meta: {item.criteria}</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {item.currentValue} / {item.targetValue} {item.unit}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-r from-amber-400 to-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, item.progress)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Basic Info */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <UserIcon className="w-4 h-4 text-emerald-600" />
          Dados do Usuário
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">E-mail de Cadastro</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Dietary Restrictions Checklist */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Restrições Alimentares e Condições de Saúde
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Selecione suas restrições. O scanner de IA acusará perigo imediatamente ao detectar ingredientes incompatíveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {RESTRICTIONS_LIST.map((item) => {
            const isSelected = restrictions.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleRestriction(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-rose-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="space-y-0.5">
                  <span className={`text-xs font-bold block ${isSelected ? 'text-rose-900 dark:text-rose-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.label}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug block">{item.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Nutritional Goals */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <HeartPulse className="w-4 h-4 text-emerald-600" />
          Metas Diárias de Macronutrientes
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Calorias (kcal)</label>
            <input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Proteínas (g)</label>
            <input
              type="number"
              value={targetProtein}
              onChange={(e) => setTargetProtein(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Carboidratos (g)</label>
            <input
              type="number"
              value={targetCarbs}
              onChange={(e) => setTargetCarbs(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Gorduras (g)</label>
            <input
              type="number"
              value={targetFat}
              onChange={(e) => setTargetFat(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>
      {/* Plano e Conta */}
      <div className="p-6 bg-rose-50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900 shadow-sm space-y-4 mt-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
          Configurações de Conta e Plano
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setPlan(currentPlan === 'free' ? 'pro' : 'plus')}
            className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-800 text-left hover:border-rose-400 transition-all"
          >
            <span className="font-bold text-slate-900 dark:text-white">Trocar Plano</span>
            <p className="text-xs text-slate-500">Upgrade para Pro ou Plus</p>
          </button>
          
          <button
            type="button"
            onClick={() => handleSave(new Event('submit') as any)}
            className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-800 text-left hover:border-rose-400 transition-all"
          >
            <span className="font-bold text-slate-900 dark:text-white">Editar Dados</span>
            <p className="text-xs text-slate-500">Salvar alterações no perfil</p>
          </button>

          <button
            type="button"
            onClick={() => setPlan('free')}
            className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-800 text-left hover:border-rose-400 transition-all"
          >
            <span className="font-bold text-rose-600 dark:text-rose-400">Cancelar Plano</span>
            <p className="text-xs text-slate-500">Retornar ao plano gratuito</p>
          </button>
          
          <button
            type="button"
            onClick={async () => {
              if (confirm('Tem certeza? Isso apagará todos os seus dados e removerá sua conta do app.')) {
                await deleteAccount();
                alert('Conta excluída com sucesso.');
              }
            }}
            className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-800 text-left hover:border-rose-400 transition-all"
          >
            <span className="font-bold text-rose-600 dark:text-rose-400">Excluir Cadastro</span>
            <p className="text-xs text-slate-500">Apagar todos os dados e conta</p>
          </button>
        </div>
      </div>

    </form>
  );
};
