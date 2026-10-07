import { StorageAdapter } from './StorageAdapter';
import { UserProfile, ProductScan, DailyLog, WhiteLabelConfig } from '../../types/nutrition';

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_default_1',
  name: 'Aline Oliveira',
  email: 'contatoalinedev@gmail.com',
  dietaryRestrictions: ['lactose', 'sodium'],
  targetCalories: 2000,
  targetProtein: 120,
  targetCarbs: 220,
  targetFat: 65,
  targetSodium: 2000,
  createdAt: new Date().toISOString(),
};

const DEFAULT_CONFIG: WhiteLabelConfig = {
  appName: 'NutriLense AI',
  primaryColor: '#059669', // emerald-600
  logoEmoji: '🥗',
  activeAdapter: 'local',
  demoMaxScans: 2,
};

const SAMPLE_SCANS: ProductScan[] = [
  {
    id: 'scan_sample_1',
    userId: 'user_default_1',
    barcode: '7891000100103',
    productName: 'Iogurte Natural Proteico 20g',
    brand: 'VerdeVida',
    servingSize: '200g',
    healthScore: 92,
    nutriScore: 'A',
    novaGroup: 1,
    novaDescription: 'Alimento In Natura / Minimamente Processado',
    macronutrients: {
      calories: 140,
      protein: 20,
      carbohydrates: 8,
      totalFat: 2.5,
      saturatedFat: 1.2,
      transFat: 0,
      dietaryFiber: 0,
      sodium: 85,
      sugar: 5,
    },
    ingredientsText: 'Leite desnatado pasteurizado, fermentos lácteos vivos e concentração proteica de soro de leite.',
    beneficialSubstances: [
      { name: 'Proteínas Vivas', reason: 'Ganho muscular e reparação tecidual' },
      { name: 'Cálcio Ativo', reason: 'Densidade óssea saudável' }
    ],
    harmfulSubstances: [],
    additives: [],
    triggeredAlerts: ['CONTÉM LACTOSE - Incompatível com seu perfil'],
    suggestedSwaps: [],
    scannedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'scan_sample_2',
    userId: 'user_default_1',
    barcode: '7891000200204',
    productName: 'Refrigerante Cola Zero Açúcar',
    brand: 'MegaFizz',
    servingSize: '350ml',
    healthScore: 32,
    nutriScore: 'E',
    novaGroup: 4,
    novaDescription: 'Alimento Ultraprocessado',
    macronutrients: {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      totalFat: 0,
      saturatedFat: 0,
      transFat: 0,
      dietaryFiber: 0,
      sodium: 48,
      sugar: 0,
    },
    ingredientsText: 'Água gaseificada, extrato de noz de cola, corante caramelo IV (E150d), acidulante ácido fosfórico (E338), sucralose.',
    beneficialSubstances: [],
    harmfulSubstances: [
      { name: 'Corante Caramelo IV (E150d)', risk: 'Alto', description: 'Aditivo sintético de alta preocupação toxicológica' },
      { name: 'Ácido Fosfórico (E338)', risk: 'Médio', description: 'Desgaste de cálcio nos ossos' }
    ],
    additives: ['E150d', 'E338', 'E211'],
    triggeredAlerts: ['ALTO EM ADITIVOS SINTÉTICOS', 'ULTRAPROCESSADO NOVA 4'],
    suggestedSwaps: [
      { productName: 'Kombucha Orgânica de Gengibre', brand: 'BioFlora', healthScore: 88, nutriScore: 'A', reason: 'Probiótico natural gaseificado sem conservantes' }
    ],
    scannedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

export class LocalAdapter implements StorageAdapter {
  private PROFILE_KEY = 'nutrilense_profile';
  private SCANS_KEY = 'nutrilense_scans';
  private CONFIG_KEY = 'nutrilense_config';

  async getProfile(): Promise<UserProfile> {
    const raw = localStorage.getItem(this.PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  }

  async saveProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(updated));
    return updated;
  }

  async getScanHistory(): Promise<ProductScan[]> {
    const raw = localStorage.getItem(this.SCANS_KEY);
    if (!raw) {
      localStorage.setItem(this.SCANS_KEY, JSON.stringify(SAMPLE_SCANS));
      return SAMPLE_SCANS;
    }
    return JSON.parse(raw);
  }

  async saveScan(scanData: Omit<ProductScan, 'id' | 'scannedAt'>): Promise<ProductScan> {
    const history = await this.getScanHistory();
    const newScan: ProductScan = {
      ...scanData,
      id: 'scan_' + Date.now(),
      scannedAt: new Date().toISOString(),
    };
    const updated = [newScan, ...history];
    localStorage.setItem(this.SCANS_KEY, JSON.stringify(updated));
    return newScan;
  }

  async deleteScan(id: string): Promise<boolean> {
    const history = await this.getScanHistory();
    const updated = history.filter((s) => s.id !== id);
    localStorage.setItem(this.SCANS_KEY, JSON.stringify(updated));
    return true;
  }

  async getDailyLogs(): Promise<DailyLog[]> {
    const history = await this.getScanHistory();
    const grouped: Record<string, ProductScan[]> = {};

    history.forEach((scan) => {
      const dateKey = scan.scannedAt.split('T')[0];
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(scan);
    });

    const logs: DailyLog[] = Object.keys(grouped).map((date) => {
      const scans = grouped[date];
      return {
        date,
        scans,
        totalCalories: scans.reduce((acc, s) => acc + (s.macronutrients.calories || 0), 0),
        totalProtein: scans.reduce((acc, s) => acc + (s.macronutrients.protein || 0), 0),
        totalCarbs: scans.reduce((acc, s) => acc + (s.macronutrients.carbohydrates || 0), 0),
        totalFat: scans.reduce((acc, s) => acc + (s.macronutrients.totalFat || 0), 0),
        totalSodium: scans.reduce((acc, s) => acc + (s.macronutrients.sodium || 0), 0),
      };
    });

    return logs.sort((a, b) => b.date.localeCompare(a.date));
  }

  async getDailyLogByDate(date: string): Promise<DailyLog | null> {
    const logs = await this.getDailyLogs();
    return logs.find((l) => l.date === date) || null;
  }

  async getWhiteLabelConfig(): Promise<WhiteLabelConfig> {
    const raw = localStorage.getItem(this.CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
      return DEFAULT_CONFIG;
    }
    return JSON.parse(raw);
  }

  async saveWhiteLabelConfig(config: Partial<WhiteLabelConfig>): Promise<WhiteLabelConfig> {
    const current = await this.getWhiteLabelConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(updated));
    return updated;
  }
}
