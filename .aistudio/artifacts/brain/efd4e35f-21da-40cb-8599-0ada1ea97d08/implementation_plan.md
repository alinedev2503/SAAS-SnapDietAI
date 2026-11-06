# Plano de Implementação — SnapDiet ("Mercado Barato")

## 1. Visão Geral & Nova Proposta de Valor
Transformação do aplicativo para o **SnapDiet**, pivotando o foco central para o conceito **"Mercado Barato"** — aliando a inteligência nutricional oficial à **economia financeira real e combate à inflação alimentar**.

O diferencial competitivo do SnapDiet é responder à pergunta: *"Como comer saudável e bater as metas de proteína gastando o mínimo possível no supermercado?"*

---

## 2. Pilares das Novas Funcionalidades

### A. Rebranding Completo para SnapDiet
- **Nome Oficial**: Atualização de `NutriLense AI` para **`SnapDiet`** em `metadata.json`, `index.html`, barra de navegação, rodapés e telas.
- **Identidade e Slogan**: *"SnapDiet — Mercado Barato & Nutrição Inteligente"*.
- **Comunicação Visual**: Tons energéticos de economia inteligente (verde esmeralda, amarelo dourado e azul), mantendo suporte completo a modo escuro e PWA offline.

### B. Scanner Multimodal de Gôndola & Preço por 100g
- **Leitura Dupla de Imagem**: O usuário fotografa o produto junto com a etiqueta de preço na gôndola (ou digita o preço se preferir).
- **Métricas Financeiras & Nutricionais Instantâneas**:
  - **Preço por 100g / 100ml** (ex: *R$ 3,89 / 100g*).
  - **Custo por grama de proteína** (ex: *R$ 0,14 por grama de proteína*, permitindo comparar se ovos, frango ou iogurte proteico oferecem melhor custo-benefício).
- **Substitutos Mais Baratos & Inteligentes**:
  - Comparativo visual imediato: *"Troque este produto de R$ 18,90 por esta opção equivalente de R$ 11,40 (Economia de 39% com 2g a mais de proteína por porção)"*.

### C. Nova Aba Dedicada: "Orçamento & Mercado" (Budget & Market)
- **Definição de Teto Semanal de Gastos**:
  - O usuário informa seu orçamento semanal (ex: *R$ 150,00*, *R$ 200,00* ou *US$ 50*).
  - Termômetro visual de orçamento consumido vs. restante.
- **Cardápio Econômico por IA (Budget Meal Planner)**:
  - Gera cardápio semanal completo (café, almoço, lanche, jantar) dimensionado exatamente para o valor limite informado.
  - Alimentos acessíveis com alto teor nutritivo baseados na tabela oficial TACO (ovos, aveia, lentilha, frango, legumes da estação).
- **Lista de Compras Inteligente (Smart Grocery Checklist)**:
  - Lista categorizada (Hortifrúti, Proteínas, Grãos, Laticínios) com valores estimados e quantidade sugerida.
  - Checkbox interativo para marcar itens no carrinho durante a ida ao supermercado.

### D. Inteligência Artificial no Backend (`server.ts`)
- **Atualização do Endpoint `/api/gemini/analyze-product`**:
  - Prompt estendido para detectar preço da gôndola via OCR/visão computacional.
  - Cálculo de `pricePer100g` e `pricePerProteinGram`.
  - Geração estruturada de `cheaperSwaps` contendo estimativa de economia em R$ e %.
- **Novo Endpoint `/api/gemini/budget-meal-plan`**:
  - Recebe o valor semanal do orçamento e restrições alimentares do perfil.
  - Retorna o cardápio econômico semanal e a lista de compras correspondente.

---

## 3. Estrutura de Arquivos e Modificações

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `metadata.json` & `index.html` | Atualização | Rebranding para SnapDiet, novas meta tags e títulos |
| `src/types/nutrition.ts` | Extensão | Tipos de preço por 100g, custo de proteína, itens de orçamento e lista de compras |
| `src/views/MarketBudgetView.tsx` | **Criação** | Nova aba de Orçamento Semanal, Cardápio Econômico e Lista de Compras Inteligente |
| `src/components/CameraScanner.tsx` | Atualização | Modo de captura com detecção de preço de gôndola e campo rápido de preço |
| `src/components/ProductCard.tsx` | Atualização | Exibição de Preço por 100g, Custo por Proteína e badge de Economia Real |
| `src/components/Navbar.tsx` & `BottomNav.tsx` | Atualização | Nova aba "Mercado & Orçamento" e nome SnapDiet |
| `server.ts` | Atualização | Prompts de visão para gôndola e endpoint de cardápio econômico por IA |
| `src/locales/en-US.json`, `pt-BR.json`, `es.json` | Extensão | Tradução completa dos novos recursos e terminologias de economia |

---

## 4. Plano de Validação
1. **Compilação e Linting**: Validar TypeScript e bundler sem erros (`tsc --noEmit` e `npm run build`).
2. **Scanner e Gôndola**: Testar captura de preço e cálculo correto de R$/100g e R$/g de proteína.
3. **Orçamento Semanal**: Testar simulação com R$ 150/semana gerando lista de compras sem estourar o limite.
4. **Persistência**: Garantir que a lista de compras e orçamento fiquem salvos localmente e no Firestore.
