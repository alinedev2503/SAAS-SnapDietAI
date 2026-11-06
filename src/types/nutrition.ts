export type NutriScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Macronutrients {
  calories: number;
  protein: number;
  carbohydrates: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  dietaryFiber: number;
  sodium: number; // in mg
  sugar: number; // in g
}

export interface BeneficialSubstance {
  name: string;
  reason: string;
}

export interface HarmfulSubstance {
  name: string;
  risk: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  description: string;
}

export interface SuggestedSwap {
  productName: string;
  brand: string;
  healthScore: number;
  nutriScore: NutriScoreGrade;
  reason: string;
}

export interface CheaperSwap {
  productName: string;
  brand: string;
  estimatedPrice: number;
  pricePer100g: number;
  savingsPercent: number; // Ex: 38%
  savingsAmount: number; // Ex: R$ 6.50
  proteinPerServing: number;
  nutriScore: NutriScoreGrade;
  reason: string;
}

export interface TacoBenchmarkNutrients {
  calories: number;
  protein: number;
  carbohydrates: number;
  totalFat: number;
  dietaryFiber: number;
  sodium: number; // in mg
  calcium?: number; // in mg
  iron?: number; // in mg
}

export interface TacoValidation {
  matchedTacoItem: string; // Ex: "Arroz, integral, cozido"
  tacoId: string; // Ex: "TACO-005"
  category: string; // Ex: "Cereais e leguminosas"
  benchmarkPer100g: TacoBenchmarkNutrients;
  validationStatus: 'conforme' | 'divergente' | 'alerta';
  auditNotes: string;
  discrepancies?: string[];
}

export type ScanCategory = 'industrializado' | 'prato_pronto';

export interface ProductScan {
  id: string;
  userId: string;
  barcode: string;
  productName: string;
  brand: string;
  imageUrl?: string;
  servingSize: string;
  price?: number; // Preço na gôndola (ex: R$ 14.90)
  packageWeightGrams?: number; // Peso líquido total (ex: 400g)
  pricePer100g?: number; // Preço calculado por 100g (ex: R$ 3.72)
  pricePerProteinGram?: number; // Custo em R$ por grama de proteína (ex: R$ 0.12)
  cheaperSwaps?: CheaperSwap[]; // Substitutos mais baratos e inteligentes no supermercado
  economicVerdict?: 'Vale a pena' | 'Desperdício de dinheiro' | 'Superfaturado' | 'Razoável' | string;
  economicAlert?: string; // Alerta de economia (Vale a pena ou é desperdício de dinheiro?)
  homemadeSwap?: string; // Sugestão de substituição mais barata ou caseira
  budgetImpactAnalysis?: string; // Avaliação do impacto no orçamento semanal informado
  tacoReference?: string;
  tacoValidation?: TacoValidation;
  healthScore: number; // 0 to 100
  nutriScore: NutriScoreGrade;
  novaGroup: 1 | 2 | 3 | 4;
  novaDescription: string;
  macronutrients: Macronutrients;
  ingredientsText: string;
  beneficialSubstances: BeneficialSubstance[];
  harmfulSubstances: HarmfulSubstance[];
  additives: string[];
  triggeredAlerts: string[];
  suggestedSwaps: SuggestedSwap[];
  scannedAt: string; // ISO string date
  scanCategory: ScanCategory;
}

export type GroceryCategory = 'hortifruti' | 'proteinas' | 'graos_cereais' | 'laticinios' | 'despensa';

export interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  quantityText: string; // Ex: "1 kg", "1 dúzia", "500g"
  estimatedPrice: number;
  proteinTotalGrams?: number;
  caloriesTotal?: number;
  isBought: boolean;
  tacoRef?: string;
  savingsTip?: string;
}

export interface EconomicalMealDay {
  day: string; // "Segunda", "Terça", etc.
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
  dailyCostEstimated: number;
  dailyProteinGrams: number;
  dailyCalories: number;
}

export interface WeeklyBudgetPlan {
  id: string;
  weeklyBudget: number; // Ex: 150
  currency: 'BRL' | 'USD';
  totalEstimatedCost: number;
  totalSavingsVsBrandNames: number;
  meals: EconomicalMealDay[];
  groceryList: GroceryItem[];
  createdAt: string;
  aiAdvice: string;
}

export type DietaryRestriction =
  | 'lactose'
  | 'gluten'
  | 'peanuts'
  | 'soy'
  | 'seafood'
  | 'vegan'
  | 'vegetarian'
  | 'diabetes'
  | 'hypertension'
  | 'sodium'
  | 'keto';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dietaryRestrictions: DietaryRestriction[];
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetSodium: number;
  createdAt: string;
}

export type AchievementCategory = 'streak' | 'health' | 'science' | 'explorer' | 'community';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or Lucide identifier
  badgeColor: string; // Tailwind color class
  category: AchievementCategory;
  criteria: string;
  unlockedAt?: string;
  progress: number; // 0 to 100
  currentValue: number;
  targetValue: number;
  unit: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  scans: ProductScan[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalSodium: number;
}

export type PlanTier = 'free' | 'pro' | 'plus';

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  tagline: string;
  price: string;
  monthlyLimitText: string;
  maxScans: number;
  features: string[];
  isPopular?: boolean;
}

export interface WhiteLabelConfig {
  appName: string;
  primaryColor: string; // hex
  logoEmoji: string;
  activeAdapter: 'local' | 'supabase' | 'firebase';
  demoMaxScans: number;
  currentPlan?: PlanTier;
  customDomain?: string;
  firebaseProjectId?: string;
  supabaseUrl?: string;
  stripePublishableKey?: string;
}

