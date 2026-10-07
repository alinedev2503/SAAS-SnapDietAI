# NutriLense AI — Platform & White-Label Architecture Plan

NutriLense AI is a commercial-ready, white-label SaaS nutrition intelligence app that reads product labels and barcodes via real-time camera feed using Gemini AI. It automatically calculates daily nutritional values, identifies beneficial and harmful substances (additives, ultra-processed markers, allergens), alerts users to dietary restrictions, suggests healthy swaps based on user profiles, and generates monthly progress reports.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during the Phase 1 clarification interview:

- **Brand & Theme**: **NutriLense AI** — Modern, minimal emerald and esmeralda color palette (`emerald-600`, `teal-500`, `slate-900` typography) with high-contrast health badges.
- **Backend Architecture**: **Dual-Adapter Pattern** — Abstracted data layer allowing instant seamless toggling between **Supabase** (PostgreSQL + RLS) and **Firebase** (Firestore + Security Rules) for white-label buyers.
- **Scanner Engine**: **Real-Time Camera Scan + Gemini Multimodal OCR & Barcode EAN Lookup** — Live camera feed with frame capture, EAN-13 barcode detection, visual label extraction, and manual EAN fallback.
- **Format & Commercial Model**: **SaaS White-Label Engine** — Features a commercial Landing Page, configurable white-label branding variables (logo, primary colors, app name, custom domain presets), trial demo limit (2 free scans per session before prompt), and downloadable monthly PDF progress reports.

---

## 1. Overview & Core Concept

### What It Does
1. **Camera & Barcode Scanner**: Captures food product labels and EAN/UPC barcodes directly from browser or mobile camera using Gemini 3.8 Flash multimodal vision.
2. **Deep Nutrient & Ingredient Analysis**: Parses full ingredient lists, macronutrients, micronutrients, NOVA classification (processed level), sugar/salt/fat content, and flags beneficial substances (vitamins, fiber, antioxidants) vs. harmful ones (trans fats, artificial dyes, hazardous preservatives like E-numbers, sodium nitrites).
3. **Personalized Restriction & Allergy Guard**: Real-time warnings for lactose, gluten, nuts, soy, vegan/vegetarian preferences, sodium limits, diabetes management, or custom dietary targets.
4. **Smart Healthy Swaps**: AI recommends 2-3 healthier alternative products tailored to the user's specific health profile and nutritional goals.
5. **Consumption Log & Daily Totals**: Tracks daily intake against calculated DRI (Dietary Reference Intake) with interactive macro and micro gauges.
6. **Monthly Progress Reports & PDF Export**: Aggregates 30-day nutrition trends, score averages, additive intake breakdown, and exports a branded PDF report.
7. **White-Label & Commercial Portal**: Built-in admin settings for buyers to customize app logo, brand colors, database adapter (Firebase vs. Supabase), and pricing tiers.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme
- **Aesthetic Direction**: Clinical clarity meets organic vitality. Clean slate backgrounds (`slate-50` / `slate-950`), vibrant emerald accents (`emerald-600`), mint highlights (`emerald-100`), and semantic amber/rose hazard alerts.
- **Typography & Pairings**:
  - *Display / Brand*: **Cabinet Grotesk** / **Plus Jakarta Sans** for modern, crisp headlines.
  - *Body Prose*: **Plus Jakarta Sans** for maximum mobile & desktop legibility.
  - *Data & Nutrients*: **JetBrains Mono** with `tabular-nums` for precise calorie counts, grams, percentages, and macros.
- **Color Discipline (60-30-10)**:
  - *60% Neutral Canvas*: Slate white background (`slate-50`) / Slate dark canvas (`slate-950`).
  - *30% Structural Surfaces*: Pure white cards (`bg-white`) with hairline border (`border-slate-200/80`) and single elevation depth.
  - *10% Semantic Accents*: Emerald for healthy scores/beneficial items, Rose/Amber for hazards & restrictions, Indigo for AI recommendations.

### Key User Flows & Viewports
1. **Commercial Landing Page (`/`)**: High-converting presentation highlighting product features, live interactive demo, white-label benefits, pricing table, and FAQ.
2. **Onboarding & Personal Profile (`/app/profile`)**: Caloric goals, macro targets, dietary restrictions (Lactose, Gluten, Peanut, Sodium, Vegan, Keto, Diabetes, etc.).
3. **Live Scanner (`/app/scan`)**: Camera viewfinder with frame alignment target, real-time video snapshot, barcode reader overlay, and instant Gemini AI analysis modal.
4. **Product Analysis View (`/app/product/:id`)**: Overall NutriScore (A–E) & Health Index (0–100), harmful vs. beneficial ingredient breakdowns, restriction alert badges, and AI Healthy Alternatives carousel.
5. **Daily Diary & History (`/app/history`)**: Calendar feed of scanned products, cumulative nutrient tracker, calorie budget progress bar, and meal logging.
6. **Monthly Report Generator (`/app/reports`)**: Interactive 30-day nutrition charts, health improvement trends, top harmful additives avoided, and 1-click client-side PDF export.
7. **White-Label Admin Portal (`/app/admin`)**: SaaS buyer panel to switch Supabase/Firebase adapters, customize app title, primary brand color, and manage product keys.

---

## 3. Key Product Decisions & Trade-Offs

- **Dual-Adapter Data Architecture**:
  - *Chosen Approach*: Unified `StorageAdapter` interface implemented by `FirebaseAdapter` and `SupabaseAdapter` with a fallback `LocalMemoryAdapter` for instant zero-config previews.
  - *Why*: Allows buyers to purchase a single codebase and deploy to their preferred backend stack without refactoring.
- **Server-Side Gemini API Proxy**:
  - *Chosen Approach*: Browser sends camera base64 image or barcode string to Express backend proxy `/api/gemini/analyze-product`, which invokes `@google/genai` with `gemini-3.8-flash`.
  - *Why*: Secures `GEMINI_API_KEY`, prevents client key exposure, and guarantees reliable JSON schema extraction.
- **Demo Mode Policy (2 Free Scans)**:
  - *Chosen Approach*: Unauthenticated or guest users receive 2 complete product analysis scans stored in `localStorage`. Upon 3rd scan attempt, an elegant modal invites sign-up/subscription.
  - *Why*: Satisfies commercial requirement for product demo experiment control while driving conversions.
- **PDF Progress Report Engine**:
  - *Chosen Approach*: Client-side PDF generation using clean HTML-to-Canvas / PDF styling script, preserving full brand visual fidelity without requiring external paid PDF rendering microservices.

---

## 4. Technical Architecture & Data Strategy

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER (React 19 + PWA)                   │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │ Landing / Sales Page  │  │ Live Camera / Barcode│  │ Nutrition Log    │  │
│  └───────────────────────┘  └──────────────────────┘  └──────────────────┘  │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │ Product Analysis UI   │  │ Monthly PDF Report   │  │ White-Label Admin│  │
│  └───────────────────────┘  └──────────────────────┘  └──────────────────┘  │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ HTTPS / REST / WS
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                            EXPRESS SERVER LAYER                             │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │ /api/gemini/scan      │  │ /api/gemini/swaps    │  │ /api/gemini/report│ │
│  └───────────┬───────────┘  └───────────┬──────────┘  └───────────┬──────┘  │
│              │                          │                         │         │
│              └──────────────────────────┼─────────────────────────┘         │
│                                         │ @google/genai SDK                 │
│                                         ▼                                   │
│                            Google Gemini 3.8 Flash                          │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ Abstração Dual Adapter
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                           STORAGE ADAPTER LAYER                             │
│       ┌───────────────────────────┴───────────────────────────┐             │
│       ▼                                                       ▼             │
│  ┌─────────────────────────────┐                 ┌────────────────────────┐ │
│  │      Supabase Adapter       │                 │    Firebase Adapter    │ │
│  │  (PostgreSQL + RLS Auth)    │                 │  (Firestore + Rules)   │ │
│  └─────────────────────────────┘                 └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & Data Schema
1. **UserProfile**: `id`, `email`, `name`, `dietaryRestrictions[]` (lactose, gluten, peanut, etc.), `targetCalories`, `targetProtein`, `targetCarbs`, `targetFat`, `targetSodium`, `themeConfig`.
2. **ProductScan**: `id`, `userId`, `barcode`, `productName`, `brand`, `imageUrl`, `ingredientsText`, `healthScore` (0-100), `nutriScore` ('A'|'B'|'C'|'D'|'E'), `macronutrients` (calories, protein, carbs, fat, fiber, sugar, sodium), `beneficialSubstances[]`, `harmfulSubstances[]`, `triggeredAlerts[]`, `scanTimestamp`.
3. **DailyConsumptionLog**: `id`, `userId`, `date` (YYYY-MM-DD), `scans[]`, `totalCalories`, `totalProtein`, `totalCarbs`, `totalFat`, `totalSodium`.
4. **MonthlyReport**: `id`, `userId`, `monthYear`, `averageHealthScore`, `scansCount`, `topHarmfulAvoided[]`, `aiInsightsSummary`, `generatedAt`.
5. **WhiteLabelConfig**: `appName`, `primaryColor`, `secondaryColor`, `logoUrl`, `activeAdapter` ('firebase' | 'supabase' | 'local'), `demoMaxScans`.

### Documentation & Deliverable Artifacts Included
- `README.md` & `PRD.md` — Product and quickstart guide.
- `ARCHITECTURE.md` — Technical architecture and dual-adapter pattern details.
- `SECURITY.md` — RLS & Firestore rules, environment secrets, and data isolation.
- `DEPLOY.md` — Step-by-step Vercel, Firebase, and Supabase deployment instructions.
- `ROADMAP.md`, `CHANGELOG.md`, `TASKS.md`, `AGENT.md`, `SOUL.md`, `STYLE_GUIDE.md`, `CONTRIBUTING.md`, `GEMINI.md`, `CLAUDE.md`.
- Mobile Google Play Store Readiness & Technical Checklist (`/docs/STORE_READINESS.md`).

---

## Plan Approval Confirmation

Please review the architectural blueprint above and click **Proceed** to begin execution.
