import React, { useState } from 'react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { User, ShieldAlert, HeartPulse, Check, Save } from 'lucide-react';
import { DietaryRestriction } from '../types/nutrition';

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
  const { profile, updateProfile } = useWhiteLabel();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>(profile.dietaryRestrictions);
  const [targetCalories, setTargetCalories] = useState(profile.targetCalories);
  const [targetProtein, setTargetProtein] = useState(profile.targetProtein);
  const [targetCarbs, setTargetCarbs] = useState(profile.targetCarbs);
  const [targetFat, setTargetFat] = useState(profile.targetFat);
  const [isSaved, setIsSaved] = useState(false);

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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Perfil e Restrições Alimentares</h2>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? 'Salvo!' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {/* Basic Info */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <User className="w-4 h-4 text-emerald-600" />
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

    </form>
  );
};
