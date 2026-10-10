import { TacoBenchmarkNutrients, TacoValidation, Macronutrients } from '../types/nutrition';

export interface TacoFoodItem {
  id: string; // Ex: "TACO-005"
  name: string; // Nome oficial na TACO/UNICAMP
  category: string;
  scientificName?: string;
  per100g: TacoBenchmarkNutrients;
  standardPortion: string;
  commonAliases: string[];
}

/**
 * Base de Dados Oficial: Tabela Brasileira de Composição de Alimentos — TACO
 * Núcleo de Estudos e Pesquisas em Alimentação - NEPA / UNICAMP (4ª Edição)
 */
export const TACO_DATABASE: TacoFoodItem[] = [
  // 1. CEREAIS E LEGUMINOSAS
  {
    id: 'TACO-005',
    name: 'Arroz, integral, cozido',
    category: 'Cereais e leguminosas',
    per100g: { calories: 124, protein: 2.6, carbohydrates: 25.8, totalFat: 1.0, dietaryFiber: 2.7, sodium: 1, calcium: 5, iron: 0.3 },
    standardPortion: '100g (4 colheres de sopa)',
    commonAliases: ['arroz integral', 'arroz integral cozido', 'brown rice'],
  },
  {
    id: 'TACO-007',
    name: 'Arroz, tipo 1, cozido',
    category: 'Cereais e leguminosas',
    per100g: { calories: 128, protein: 2.5, carbohydrates: 28.1, totalFat: 0.2, dietaryFiber: 1.6, sodium: 1, calcium: 4, iron: 0.1 },
    standardPortion: '100g (4 colheres de sopa)',
    commonAliases: ['arroz branco', 'arroz cozido', 'arroz tipo 1', 'arroz agulhinha'],
  },
  {
    id: 'TACO-009',
    name: 'Aveia, flocos, crua',
    category: 'Cereais e leguminosas',
    per100g: { calories: 394, protein: 13.9, carbohydrates: 66.6, totalFat: 8.5, dietaryFiber: 9.1, sodium: 5, calcium: 48, iron: 4.4 },
    standardPortion: '30g (2 colheres de sopa)',
    commonAliases: ['aveia', 'aveia em flocos', 'farelo de aveia', 'oat flakes'],
  },
  {
    id: 'TACO-015',
    name: 'Biscoito, doce, recheado com chocolate',
    category: 'Cereais e produtos de panificação',
    per100g: { calories: 472, protein: 6.4, carbohydrates: 70.5, totalFat: 19.6, dietaryFiber: 3.0, sodium: 253, calcium: 35, iron: 1.8 },
    standardPortion: '30g (3 unidades)',
    commonAliases: ['biscoito recheado', 'bolacha recheada', 'oreo', 'biscoito chocolate'],
  },
  {
    id: 'TACO-018',
    name: 'Biscoito, salgado, cream cracker',
    category: 'Cereais e produtos de panificação',
    per100g: { calories: 432, protein: 10.1, carbohydrates: 68.7, totalFat: 14.4, dietaryFiber: 2.5, sodium: 846, calcium: 21, iron: 2.3 },
    standardPortion: '30g (6 unidades)',
    commonAliases: ['cream cracker', 'biscoito agua e sal', 'bolacha salgada'],
  },
  {
    id: 'TACO-028',
    name: 'Feijão, carioca, cozido',
    category: 'Cereais e leguminosas',
    per100g: { calories: 76, protein: 4.8, carbohydrates: 13.6, totalFat: 0.5, dietaryFiber: 8.5, sodium: 2, calcium: 27, iron: 1.3 },
    standardPortion: '100g (1 concha média)',
    commonAliases: ['feijao carioca', 'feijao', 'feijão carioca cozido'],
  },
  {
    id: 'TACO-030',
    name: 'Feijão, preto, cozido',
    category: 'Cereais e leguminosas',
    per100g: { calories: 77, protein: 4.5, carbohydrates: 14.0, totalFat: 0.5, dietaryFiber: 8.4, sodium: 2, calcium: 29, iron: 1.5 },
    standardPortion: '100g (1 concha média)',
    commonAliases: ['feijao preto', 'feijão preto', 'feijoada'],
  },
  {
    id: 'TACO-038',
    name: 'Macarrão, trigo, cozido',
    category: 'Cereais e produtos de panificação',
    per100g: { calories: 102, protein: 3.5, carbohydrates: 21.3, totalFat: 0.4, dietaryFiber: 1.1, sodium: 1, calcium: 7, iron: 0.4 },
    standardPortion: '100g (1 prato raso cozido)',
    commonAliases: ['macarrao', 'massa', 'espaguete', 'penne', 'pasta'],
  },
  {
    id: 'TACO-050',
    name: 'Pão, forma, integral',
    category: 'Cereais e produtos de panificação',
    per100g: { calories: 253, protein: 9.4, carbohydrates: 49.9, totalFat: 3.7, dietaryFiber: 6.9, sodium: 506, calcium: 132, iron: 3.2 },
    standardPortion: '50g (2 fatias)',
    commonAliases: ['pao integral', 'pão de forma integral', 'pao 100% integral'],
  },
  {
    id: 'TACO-055',
    name: 'Pão de queijo, assado',
    category: 'Cereais e produtos de panificação',
    per100g: { calories: 363, protein: 5.1, carbohydrates: 34.2, totalFat: 24.6, dietaryFiber: 0.6, sodium: 647, calcium: 110, iron: 0.7 },
    standardPortion: '50g (1 unidade média)',
    commonAliases: ['pao de queijo', 'pão de queijo congelado'],
  },
  {
    id: 'TACO-057',
    name: 'Pão, francês',
    category: 'Cereais e produtos de panificação',
    per100g: { calories: 300, protein: 8.0, carbohydrates: 58.6, totalFat: 3.1, dietaryFiber: 2.3, sodium: 648, calcium: 18, iron: 1.0 },
    standardPortion: '50g (1 unidade)',
    commonAliases: ['pao frances', 'pão de sal', 'pãozinho'],
  },

  // 2. CARNES, AVES, PEIXES E OVOS
  {
    id: 'TACO-182',
    name: 'Frango, peito, sem pele, grelhado',
    category: 'Carnes e aves',
    per100g: { calories: 159, protein: 32.0, carbohydrates: 0, totalFat: 2.5, dietaryFiber: 0, sodium: 50, calcium: 9, iron: 0.4 },
    standardPortion: '100g (1 filé médio)',
    commonAliases: ['peito de frango', 'frango grelhado', 'filé de frango', 'chicken breast'],
  },
  {
    id: 'TACO-145',
    name: 'Carne, bovina, patinho, grelhado',
    category: 'Carnes e derivados',
    per100g: { calories: 219, protein: 35.9, carbohydrates: 0, totalFat: 7.3, dietaryFiber: 0, sodium: 61, calcium: 6, iron: 3.0 },
    standardPortion: '100g (1 bife médio)',
    commonAliases: ['patinho', 'carne moida', 'bife de patinho', 'carne magra'],
  },
  {
    id: 'TACO-172',
    name: 'Linguiça, frango, crua',
    category: 'Carnes e derivados industrializados',
    per100g: { calories: 214, protein: 14.8, carbohydrates: 2.2, totalFat: 16.2, dietaryFiber: 0, sodium: 1120, calcium: 18, iron: 1.1 },
    standardPortion: '50g (1 gomo)',
    commonAliases: ['linguica', 'linguiça', 'calabresa', 'embutido'],
  },
  {
    id: 'TACO-210',
    name: 'Presunto, cozido',
    category: 'Carnes e derivados industrializados',
    per100g: { calories: 128, protein: 16.5, carbohydrates: 2.1, totalFat: 6.0, dietaryFiber: 0, sodium: 1250, calcium: 11, iron: 1.5 },
    standardPortion: '40g (2 fatias)',
    commonAliases: ['presunto', 'presunto cozido fatiado', 'apresuntado'],
  },
  {
    id: 'TACO-228',
    name: 'Peixe, tilápia, filé, grelhado',
    category: 'Pescados e frutos do mar',
    per100g: { calories: 128, protein: 26.2, carbohydrates: 0, totalFat: 2.6, dietaryFiber: 0, sodium: 52, calcium: 14, iron: 0.6 },
    standardPortion: '100g (1 filé)',
    commonAliases: ['tilapia', 'peixe', 'filé de peixe', 'saint peter'],
  },
  {
    id: 'TACO-245',
    name: 'Peixe, salmão, sem pele, grelhado',
    category: 'Pescados e frutos do mar',
    per100g: { calories: 229, protein: 23.9, carbohydrates: 0, totalFat: 14.0, dietaryFiber: 0, sodium: 75, calcium: 12, iron: 0.5 },
    standardPortion: '100g (1 posta)',
    commonAliases: ['salmao', 'salmão', 'salmon'],
  },
  {
    id: 'TACO-275',
    name: 'Ovo, de galinha, inteiro, cozido',
    category: 'Ovos',
    per100g: { calories: 146, protein: 13.3, carbohydrates: 0.6, totalFat: 9.5, dietaryFiber: 0, sodium: 146, calcium: 49, iron: 1.6 },
    standardPortion: '50g (1 unidade grande)',
    commonAliases: ['ovo', 'ovo cozido', 'ovo de galinha', 'boiled egg'],
  },

  // 3. LEITES E DERIVADOS
  {
    id: 'TACO-280',
    name: 'Iogurte, natural, integral',
    category: 'Leite e derivados',
    per100g: { calories: 66, protein: 4.1, carbohydrates: 5.7, totalFat: 3.0, dietaryFiber: 0, sodium: 58, calcium: 143, iron: 0.1 },
    standardPortion: '170g (1 pote)',
    commonAliases: ['iogurte', 'iogurte natural', 'iogurte proteico', 'grego', 'yogurt'],
  },
  {
    id: 'TACO-282',
    name: 'Iogurte, sabor morango',
    category: 'Leite e derivados',
    per100g: { calories: 88, protein: 2.7, carbohydrates: 15.6, totalFat: 2.1, dietaryFiber: 0, sodium: 49, calcium: 101, iron: 0.1 },
    standardPortion: '170g (1 pote)',
    commonAliases: ['iogurte morango', 'danone', 'bebida láctea morango'],
  },
  {
    id: 'TACO-285',
    name: 'Leite, de vaca, integral, pasteurizado',
    category: 'Leite e derivados',
    per100g: { calories: 61, protein: 2.9, carbohydrates: 4.9, totalFat: 3.2, dietaryFiber: 0, sodium: 54, calcium: 123, iron: 0.1 },
    standardPortion: '200ml (1 copo)',
    commonAliases: ['leite', 'leite integral', 'leite uht', 'whole milk'],
  },
  {
    id: 'TACO-286',
    name: 'Leite, de vaca, desnatado, pasteurizado',
    category: 'Leite e derivados',
    per100g: { calories: 35, protein: 3.1, carbohydrates: 5.0, totalFat: 0.1, dietaryFiber: 0, sodium: 56, calcium: 134, iron: 0.1 },
    standardPortion: '200ml (1 copo)',
    commonAliases: ['leite desnatado', 'leite magro', 'skim milk'],
  },
  {
    id: 'TACO-290',
    name: 'Queijo, minas, frescal',
    category: 'Leite e derivados',
    per100g: { calories: 264, protein: 17.4, carbohydrates: 3.2, totalFat: 20.2, dietaryFiber: 0, sodium: 430, calcium: 579, iron: 0.4 },
    standardPortion: '30g (1 fatia média)',
    commonAliases: ['queijo minas', 'queijo frescal', 'queijo branco'],
  },
  {
    id: 'TACO-294',
    name: 'Queijo, mozarela',
    category: 'Leite e derivados',
    per100g: { calories: 330, protein: 22.6, carbohydrates: 3.0, totalFat: 25.2, dietaryFiber: 0, sodium: 580, calcium: 875, iron: 0.3 },
    standardPortion: '30g (1 fatia)',
    commonAliases: ['mussarela', 'mozarela', 'mozzarella', 'queijo fatiado'],
  },
  {
    id: 'TACO-302',
    name: 'Requeijão, cremoso',
    category: 'Leite e derivados',
    per100g: { calories: 257, protein: 9.6, carbohydrates: 2.4, totalFat: 23.4, dietaryFiber: 0, sodium: 540, calcium: 259, iron: 0.2 },
    standardPortion: '30g (1 colher de sopa)',
    commonAliases: ['requeijao', 'requeijão cremoso', 'cream cheese'],
  },

  // 4. FRUTAS
  {
    id: 'TACO-308',
    name: 'Abacate, cru',
    category: 'Frutas e derivados',
    per100g: { calories: 96, protein: 1.2, carbohydrates: 6.0, totalFat: 8.4, dietaryFiber: 6.3, sodium: 1, calcium: 8, iron: 0.2 },
    standardPortion: '100g (2 colheres de sopa)',
    commonAliases: ['abacate', 'avocado', 'guacamole'],
  },
  {
    id: 'TACO-315',
    name: 'Banana, prata, crua',
    category: 'Frutas e derivados',
    per100g: { calories: 98, protein: 1.3, carbohydrates: 26.0, totalFat: 0.1, dietaryFiber: 2.0, sodium: 1, calcium: 8, iron: 0.4 },
    standardPortion: '70g (1 unidade média)',
    commonAliases: ['banana', 'banana prata', 'banana nanica'],
  },
  {
    id: 'TACO-328',
    name: 'Laranja, pera, crua',
    category: 'Frutas e derivados',
    per100g: { calories: 37, protein: 1.0, carbohydrates: 8.9, totalFat: 0.1, dietaryFiber: 1.8, sodium: 1, calcium: 35, iron: 0.1 },
    standardPortion: '130g (1 unidade média)',
    commonAliases: ['laranja', 'laranja pera', 'laranja lima'],
  },
  {
    id: 'TACO-332',
    name: 'Maçã, fuji, com casca, crua',
    category: 'Frutas e derivados',
    per100g: { calories: 56, protein: 0.3, carbohydrates: 15.2, totalFat: 0.2, dietaryFiber: 1.3, sodium: 1, calcium: 4, iron: 0.1 },
    standardPortion: '130g (1 unidade média)',
    commonAliases: ['maca', 'maçã', 'apple', 'maca fuji', 'maca gala'],
  },
  {
    id: 'TACO-340',
    name: 'Morango, cru',
    category: 'Frutas e derivados',
    per100g: { calories: 30, protein: 0.9, carbohydrates: 6.8, totalFat: 0.3, dietaryFiber: 1.7, sodium: 1, calcium: 11, iron: 0.2 },
    standardPortion: '100g (8 unidades)',
    commonAliases: ['morango', 'strawberry'],
  },
  {
    id: 'TACO-355',
    name: 'Suco, de laranja, integral',
    category: 'Bebidas e sucos',
    per100g: { calories: 45, protein: 0.7, carbohydrates: 10.4, totalFat: 0.2, dietaryFiber: 0.4, sodium: 1, calcium: 11, iron: 0.2 },
    standardPortion: '200ml (1 copo)',
    commonAliases: ['suco de laranja', 'suco integral', 'orange juice'],
  },

  // 5. VERDURAS, HORTALIÇAS E TUBÉRCULOS
  {
    id: 'TACO-380',
    name: 'Alface, americana, crua',
    category: 'Verduras e hortaliças',
    per100g: { calories: 9, protein: 0.9, carbohydrates: 1.7, totalFat: 0.1, dietaryFiber: 1.0, sodium: 4, calcium: 14, iron: 0.4 },
    standardPortion: '50g (1 prato de sobremesa)',
    commonAliases: ['alface', 'alface americana', 'alface crespa', 'salada verde'],
  },
  {
    id: 'TACO-410',
    name: 'Batata, inglesa, cozida',
    category: 'Tubérculos e raízes',
    per100g: { calories: 52, protein: 1.2, carbohydrates: 11.9, totalFat: 0.1, dietaryFiber: 1.3, sodium: 2, calcium: 4, iron: 0.4 },
    standardPortion: '100g (1 unidade média)',
    commonAliases: ['batata', 'batata inglesa', 'pure de batata', 'potato'],
  },
  {
    id: 'TACO-412',
    name: 'Batata, doce, cozida',
    category: 'Tubérculos e raízes',
    per100g: { calories: 77, protein: 0.6, carbohydrates: 18.4, totalFat: 0.1, dietaryFiber: 2.2, sodium: 3, calcium: 17, iron: 0.2 },
    standardPortion: '100g (1 fatia média)',
    commonAliases: ['batata doce', 'sweet potato'],
  },
  {
    id: 'TACO-418',
    name: 'Brócolis, cozido',
    category: 'Verduras e hortaliças',
    per100g: { calories: 25, protein: 2.1, carbohydrates: 4.4, totalFat: 0.5, dietaryFiber: 3.4, sodium: 12, calcium: 51, iron: 0.6 },
    standardPortion: '80g (4 ramos)',
    commonAliases: ['brocolis', 'brócolis', 'broccoli'],
  },
  {
    id: 'TACO-422',
    name: 'Cenoura, crua',
    category: 'Verduras e hortaliças',
    per100g: { calories: 34, protein: 1.3, carbohydrates: 7.7, totalFat: 0.2, dietaryFiber: 3.2, sodium: 3, calcium: 23, iron: 0.2 },
    standardPortion: '80g (1 unidade média)',
    commonAliases: ['cenoura', 'carrot'],
  },
  {
    id: 'TACO-460',
    name: 'Tomate, com semente, cru',
    category: 'Verduras e hortaliças',
    per100g: { calories: 15, protein: 1.1, carbohydrates: 3.1, totalFat: 0.2, dietaryFiber: 1.2, sodium: 1, calcium: 7, iron: 0.2 },
    standardPortion: '100g (1 unidade média)',
    commonAliases: ['tomate', 'molho de tomate', 'tomato'],
  },

  // 6. AÇÚCARES, DOCES E BEBIDAS INDUSTRIAIS
  {
    id: 'TACO-490',
    name: 'Açúcar, refinado',
    category: 'Açúcares e produtos de confeitaria',
    per100g: { calories: 387, protein: 0.3, carbohydrates: 99.5, totalFat: 0, dietaryFiber: 0, sodium: 1, calcium: 4, iron: 0.1 },
    standardPortion: '10g (1 colher de sopa)',
    commonAliases: ['acucar', 'açúcar', 'acucar refinado', 'sugar'],
  },
  {
    id: 'TACO-505',
    name: 'Chocolate, ao leite',
    category: 'Açúcares e produtos de confeitaria',
    per100g: { calories: 540, protein: 7.2, carbohydrates: 59.6, totalFat: 30.7, dietaryFiber: 2.1, sodium: 90, calcium: 214, iron: 1.6 },
    standardPortion: '25g (4 quadradinhos)',
    commonAliases: ['chocolate', 'chocolate ao leite', 'barra de chocolate'],
  },
  {
    id: 'TACO-530',
    name: 'Refrigerante, tipo cola',
    category: 'Bebidas não alcoólicas',
    per100g: { calories: 42, protein: 0, carbohydrates: 10.6, totalFat: 0, dietaryFiber: 0, sodium: 11, calcium: 2, iron: 0.1 },
    standardPortion: '350ml (1 lata)',
    commonAliases: ['coca cola', 'refrigerante', 'refrigerante cola', 'pepsi', 'soda'],
  },
  {
    id: 'TACO-482',
    name: 'Achocolatado, em pó',
    category: 'Açúcares e produtos de confeitaria',
    per100g: { calories: 401, protein: 4.2, carbohydrates: 90.0, totalFat: 2.2, dietaryFiber: 4.8, sodium: 119, calcium: 82, iron: 10.2 },
    standardPortion: '20g (2 colheres de sopa)',
    commonAliases: ['toddy', 'nescau', 'achocolatado', 'chocolate em po'],
  },

  // 7. OLEAGINOSAS E SEMENTES
  {
    id: 'TACO-580',
    name: 'Castanha-de-caju, torrada, salgada',
    category: 'Nozes e sementes',
    per100g: { calories: 570, protein: 18.5, carbohydrates: 29.1, totalFat: 46.3, dietaryFiber: 3.7, sodium: 320, calcium: 37, iron: 5.2 },
    standardPortion: '30g (1 punhado)',
    commonAliases: ['castanha de caju', 'castanha', 'cashew'],
  },
  {
    id: 'TACO-582',
    name: 'Castanha-do-brasil / Pará, crua',
    category: 'Nozes e sementes',
    per100g: { calories: 643, protein: 14.5, carbohydrates: 15.1, totalFat: 63.5, dietaryFiber: 7.9, sodium: 2, calcium: 160, iron: 2.3 },
    standardPortion: '15g (3 castanhas)',
    commonAliases: ['castanha do para', 'castanha do brasil', 'brazil nuts'],
  },
];

/**
 * Busca o item correspondente mais próximo na Tabela TACO
 * com base no nome do produto, marca, categoria ou lista de ingredientes.
 */
export function findTacoMatch(query: string, ingredientsText?: string): TacoFoodItem | null {
  const clean = (query || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const cleanIng = (ingredientsText || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Direct alias match in product name
  for (const item of TACO_DATABASE) {
    for (const alias of item.commonAliases) {
      const cleanAlias = alias.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      if (clean.includes(cleanAlias)) {
        return item;
      }
    }
  }

  // 2. Direct name substring match
  for (const item of TACO_DATABASE) {
    const cleanItemName = item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const words = cleanItemName.split(/,\s*|\s+/).filter(w => w.length > 3);
    const matches = words.filter(w => clean.includes(w));
    if (matches.length >= 2) {
      return item;
    }
  }

  // 3. Match through main ingredients list
  if (cleanIng) {
    for (const item of TACO_DATABASE) {
      for (const alias of item.commonAliases) {
        const cleanAlias = alias.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        if (cleanIng.startsWith(cleanAlias) || cleanIng.includes(cleanAlias)) {
          return item;
        }
      }
    }
  }

  // 4. Fallback: match by individual strong food tokens
  const tokenMap: Record<string, string> = {
    iogurte: 'TACO-280',
    refrigerante: 'TACO-530',
    coca: 'TACO-530',
    aveia: 'TACO-009',
    arroz: 'TACO-005',
    feijao: 'TACO-028',
    pao: 'TACO-057',
    frango: 'TACO-182',
    leite: 'TACO-285',
    queijo: 'TACO-294',
    mussarela: 'TACO-294',
    chocolate: 'TACO-505',
    banana: 'TACO-315',
    maca: 'TACO-332',
    laranja: 'TACO-328',
    batata: 'TACO-410',
    salmao: 'TACO-245',
    tilapia: 'TACO-228',
    ovo: 'TACO-275',
    castanha: 'TACO-580',
    biscoito: 'TACO-015',
    bolacha: 'TACO-015',
  };

  for (const [token, tacoId] of Object.entries(tokenMap)) {
    if (clean.includes(token) || cleanIng.includes(token)) {
      const found = TACO_DATABASE.find(t => t.id === tacoId);
      if (found) return found;
    }
  }

  // Default standard staple: Aveia / Cereal
  return TACO_DATABASE.find(t => t.id === 'TACO-009') || TACO_DATABASE[0];
}

/**
 * Normaliza os macronutrientes declarados na porção do rótulo para base 100g
 */
export function normalizeMacrosTo100g(macros: Macronutrients, servingSizeText: string): Macronutrients {
  let grams = 100;
  const match = (servingSizeText || '').match(/(\d+(?:[.,]\d+)?)\s*(?:g|ml)/i);
  if (match) {
    const parsed = parseFloat(match[1].replace(',', '.'));
    if (parsed > 0) grams = parsed;
  }

  const factor = 100 / grams;

  return {
    calories: Math.round(macros.calories * factor),
    protein: Math.round(macros.protein * factor * 10) / 10,
    carbohydrates: Math.round(macros.carbohydrates * factor * 10) / 10,
    totalFat: Math.round(macros.totalFat * factor * 10) / 10,
    saturatedFat: Math.round(macros.saturatedFat * factor * 10) / 10,
    transFat: Math.round(macros.transFat * factor * 10) / 10,
    dietaryFiber: Math.round(macros.dietaryFiber * factor * 10) / 10,
    sodium: Math.round(macros.sodium * factor),
    sugar: Math.round(macros.sugar * factor * 10) / 10,
  };
}

/**
 * Realiza a auditoria secundária cruzando dados extraídos do rótulo
 * contra o padrão analítico centesimal oficial da TACO (NEPA/UNICAMP 4ª Edição).
 */
export function auditProductAgainstTaco(
  productName: string,
  claimedMacros: Macronutrients,
  servingSizeText: string,
  ingredientsText: string,
  presetTacoItem?: TacoFoodItem
): TacoValidation {
  const tacoBenchmark = presetTacoItem || findTacoMatch(productName, ingredientsText) || TACO_DATABASE[0];
  const normalizedLabel = normalizeMacrosTo100g(claimedMacros, servingSizeText);
  const bench = tacoBenchmark.per100g;

  const discrepancies: string[] = [];
  let status: 'conforme' | 'divergente' | 'alerta' = 'conforme';

  // 1. Sódio audit
  if (normalizedLabel.sodium > bench.sodium * 2.5 && normalizedLabel.sodium > 300) {
    status = 'alerta';
    discrepancies.push(
      `Sódio elevado: Rótulo apresenta ${normalizedLabel.sodium}mg/100g vs ${bench.sodium}mg/100g no padrão TACO da categoria (+${Math.round(
        ((normalizedLabel.sodium - bench.sodium) / Math.max(bench.sodium, 1)) * 100
      )}%).`
    );
  }

  // 2. Proteína audit
  if (bench.protein >= 15 && normalizedLabel.protein < bench.protein * 0.5) {
    status = status === 'alerta' ? 'alerta' : 'divergente';
    discrepancies.push(
      `Teor proteico reduzido: Apenas ${normalizedLabel.protein}g/100g vs ${bench.protein}g/100g esperado na referência TACO # ${tacoBenchmark.id}.`
    );
  }

  // 3. Fibras audit (especialmente relevante para alegados "integrais")
  if (bench.dietaryFiber >= 5 && normalizedLabel.dietaryFiber < 2) {
    status = status === 'alerta' ? 'alerta' : 'divergente';
    discrepancies.push(
      `Fibras abaixo do padrão integral: ${normalizedLabel.dietaryFiber}g/100g declaradas vs ${bench.dietaryFiber}g/100g na TACO (${tacoBenchmark.name}).`
    );
  }

  // 4. Calorias audit
  const calDiff = Math.abs(normalizedLabel.calories - bench.calories);
  if (calDiff > 120 && bench.calories > 50) {
    if (normalizedLabel.calories > bench.calories * 1.5) {
      status = status === 'alerta' ? 'alerta' : 'divergente';
      discrepancies.push(
        `Densidade energética superior (+${calDiff} kcal/100g): Provável adição de gorduras industriais ou açúcares refinados.`
      );
    }
  }

  // 5. Açúcares ocultos e aditivos
  const lowerIng = (ingredientsText || '').toLowerCase();
  const hiddenSugars = ['maltodextrina', 'xarope de milho', 'sacarose', 'acucar invertido', 'dextrose', 'frutose'];
  const foundSugars = hiddenSugars.filter(s => lowerIng.includes(s));
  if (foundSugars.length > 0 && normalizedLabel.sugar === 0) {
    status = 'alerta';
    discrepancies.push(
      `Inconsistência de açúcares: Ingredientes listam [${foundSugars.join(', ')}], mas o rótulo declara 0g de açúcares por porção.`
    );
  }

  // Generate audit notes
  let auditNotes = `Auditoria realizada contra ${tacoBenchmark.name} (TACO #${tacoBenchmark.id} - UNICAMP). `;
  if (status === 'conforme') {
    auditNotes += `Os valores de macronutrientes e composição centesimal declarados estão compatíveis com a matriz analítica oficial da categoria.`;
  } else if (status === 'divergente') {
    auditNotes += `Foram identificados desvios relevantes de macronutrientes em relação ao alimento base in natura/minimamente processado da TACO.`;
  } else {
    auditNotes += `Alerta nutricional crítico: Desvios significativos de sódio, aditivos ou camuflagem de açúcares em comparação com a referência científica TACO.`;
  }

  return {
    matchedTacoItem: tacoBenchmark.name,
    tacoId: tacoBenchmark.id,
    category: tacoBenchmark.category,
    benchmarkPer100g: bench,
    validationStatus: status,
    auditNotes,
    discrepancies: discrepancies.length > 0 ? discrepancies : undefined,
  };
}

/**
 * Gera um resumo formatado para ser inserido no contexto da instrução do Gemini,
 * garantindo que a IA receba os dados analíticos reais da TACO como referência secundária.
 */
export function buildTacoContextPrompt(): string {
  const sampleBenchmarks = TACO_DATABASE.slice(0, 24).map(item => {
    return `- [${item.id}] ${item.name} (${item.category}): ${item.per100g.calories} kcal, Prot: ${item.per100g.protein}g, Carb: ${item.per100g.carbohydrates}g, Lip: ${item.per100g.totalFat}g, Fibra: ${item.per100g.dietaryFiber}g, Sódio: ${item.per100g.sodium}mg/100g`;
  }).join('\n');

  return `
BASE DE DADOS OFICIAL DE AUDITORIA: TABELA BRASILEIRA DE COMPOSIÇÃO DE ALIMENTOS — TACO (NEPA/UNICAMP 4ª EDIÇÃO):
A Tabela TACO é a sua referência analítica secundária obrigatória. Quando você extrair os dados da foto ou rótulo:
1. Extração Primária: Leia os valores declarados no rótulo da embalagem (porção, calorias, macronutrientes, lista de ingredientes, alérgenos).
2. Validação Secundária (Auditoria TACO): Compare a composição do produto com o alimento de referência mais similar na Tabela TACO abaixo (normalizando mentalmente para base de 100g):
${sampleBenchmarks}
3. Identifique se o produto atende ao padrão da TACO ("conforme"), se apresenta desvios nos nutrientes ("divergente") ou se possui excesso crítico de sódio/açúcar oculto ("alerta").
4. No campo "tacoReference", informe o código e nome do item da TACO (ex: "TACO #009 Aveia, flocos, crua (NEPA/UNICAMP 4ª Edição)").
5. No campo "tacoValidation", forneça o objeto completo de validação com matchedTacoItem, tacoId, category, benchmarkPer100g, validationStatus, auditNotes e discrepancies.
`;
}
