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

export interface ProductScan {
  id: string;
  userId: string;
  barcode: string;
  productName: string;
  brand: string;
  imageUrl?: string;
  servingSize: string;
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

export interface DailyLog {
  date: string; // YYYY-MM-DD
  scans: ProductScan[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalSodium: number;
}

export interface WhiteLabelConfig {
  appName: string;
  primaryColor: string; // hex
  logoEmoji: string;
  activeAdapter: 'local' | 'supabase' | 'firebase';
  demoMaxScans: number;
  customDomain?: string;
  firebaseProjectId?: string;
  supabaseUrl?: string;
}
