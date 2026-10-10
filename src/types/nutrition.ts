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

