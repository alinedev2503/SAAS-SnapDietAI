# Complete Documentation — SnapDiet (Cheap Market / Mercado Barato)

> **Complete Product Guide & Technical Architecture**  
> Multimodal Nutritional Intelligence (TACO / UNICAMP Table) + Supermarket Inflation Shield.

---

## Table of Contents

1. [Overview & Concept](#1-overview--concept)
2. [Free Trial Access (No Login & No Purchase Required)](#2-free-trial-access-no-login--no-purchase-required)
3. [Complete Product Guide (Features)](#3-complete-product-guide-features)
   - [3.1 Core Nutritional Analysis (Multimodal Scanner)](#31-core-nutritional-analysis-multimodal-scanner)
   - [3.2 Cheap Market Module & Weekly Budget Planner](#32-cheap-market-module--weekly-budget-planner)
   - [3.3 Food Diary, Hydration & Calorie Tracker](#33-food-diary-hydration--calorie-tracker)
   - [3.4 Executive PDF Reports & Analytics Charts](#34-executive-pdf-reports--analytics-charts)
   - [3.5 Nutritionist Finder (Google Maps)](#35-nutritionist-finder-google-maps)
   - [3.6 Profile, Dietary Restrictions & Achievements](#36-profile-dietary-restrictions--achievements)
4. [Technical Architecture](#4-technical-architecture)
   - [4.1 Technology Stack](#41-technology-stack)
   - [4.2 Server-Side AI Pipeline & TACO Scientific Audit](#42-server-side-ai-pipeline--taco-scientific-audit)
   - [4.3 Dual-Adapter Architecture & Offline Persistence](#43-dual-adapter-architecture--offline-persistence)
   - [4.4 Security & Firestore Rules](#44-security--firestore-rules)
5. [API Endpoints Reference](#5-api-endpoints-reference)
6. [Setup, Environment Variables & Running Locally](#6-setup-environment-variables--running-locally)
7. [Internationalization (i18n) & PWA](#7-internationalization-i18n--pwa)

---

## 1. Overview & Concept

**SnapDiet** is a Progressive Web Application (PWA) that combines two complementary pillars in a single experience:

1. **Complete Nutritional Analysis (Core Functionality)**: instant reading via camera, photo upload, or EAN barcode for **packaged product labels**, **prepared meal photos**, and **whole/individual food photos**. The system delivers macronutrients, micronutrients (vitamins and minerals), beneficial and harmful substances, allergens, NutriScore (A–E) grading, NOVA processing classification (1–4), and scientific validation against the **Brazilian Food Composition Table — TACO (NEPA/UNICAMP 4th Edition)**.
2. **"Cheap Market" (*Mercado Barato*) Concept (Inflation Shield)**: alongside nutritional analysis, SnapDiet calculates price per 100g and cost per gram of protein from shelf prices, flags brand overpricing, suggests cheaper or homemade swaps, and builds weekly meal plans + smart grocery lists within the user's weekly budget ceiling (e.g., `R$ 150.00` or `$50.00`).

---

## 2. Free Trial Access (No Login & No Purchase Required)

To enable immediate hands-on evaluation by any new visitor, **SnapDiet** unlocks **2 free test accesses without requiring login or purchase**:

- **Zero Entry Friction**: all application views (Home, Cheap Market, Food Diary & History, Daily Water & Calorie Tracker, PDF Reports, Nutritionist Map, and Profile) work immediately in the browser in **Guest Mode**, persisting data locally without requiring a Google account or credit card.
- **2 Free AI Scanner Tests**: every visitor receives an initial quota of **2 full analyses in the Multimodal Scanner** (label photo, prepared meal photo, whole food photo, or EAN barcode).
- **Always-Visible Counter**:
  - In the **top navigation bar** (mobile and desktop), a live counter badge shows how many free tests remain (`2/2`, `1/2`, `0/2`).
  - On the **Landing Page (Hero)**, a status strip highlights the 2 free accesses unlocked without login or purchase.
  - Inside the **Camera Scanner modal**, a status bar displays remaining free tests and pre-validates quota availability before triggering an AI request.
- **After the 2 Free Tests**: visitors can continue browsing their saved history, food diary, daily tracker, PDF reports, and Cheap Market planner freely. To expand monthly scanning quotas (Pro Plan with 20 scans/mo or Plus Plan with 60 scans/mo) or sync data across devices in the cloud, users can optionally connect a Google account or subscribe to a plan.

---

## 3. Complete Product Guide (Features)

### 3.1 Core Nutritional Analysis (Multimodal Scanner)

The scanner component lets users select the target category before capturing:

- **Label (`industrializado`)**: reads nutrition facts tables, ingredient lists, EAN-13 barcodes, and optional shelf prices.
- **Meal (`prato_pronto`)**: analyzes photos of prepared dishes (homemade or restaurant), estimating ingredients, serving weight, and nutritional composition.
- **Food (`alimento`)**: analyzes individual whole/fresh foods such as fruits, vegetables, meats, eggs, and grains.

**Outputs delivered in every analysis card (`ProductCard`):**
- **Energy & Macronutrients**: calories (kcal), carbohydrates (g), protein (g), total fat (g), saturated fat (g), trans fat (g), dietary fiber (g), sugar (g), and sodium (mg).
- **Vitamins & Minerals**: structured list of relevant micronutrients with quantity and approximate Daily Value percentage (% DV).
- **Beneficial & Harmful Substances**: clear separation between health-promoting compounds (e.g., beta-glucan fibers, live probiotics, bioavailable calcium) and risky additives or ingredients (e.g., Caramel IV E150d, Phosphoric Acid E338, interesterified fats, high-fructose corn syrup), categorized by risk level.
- **Allergens & Dietary Restrictions Guardian**: explicit listing of allergenic substances (milk/lactose, gluten, soy, peanuts, tree nuts, eggs, sulfites, etc.) with highlighted alerts whenever a product conflicts with restrictions saved in the user profile.
- **NutriScore (A–E), NOVA Group (1–4) & TACO Audit**: 100g-normalized comparison against official TACO (UNICAMP) matrices, reporting `conforme`, `divergente`, or `alerta` status.
- **Healthy Swaps & Cheaper Swaps**: smarter alternatives with higher nutritional quality and lower cost per 100g.

> **Quick Demo Presets**: when a camera is unavailable on desktop, the scanner provides gallery image upload, manual EAN barcode input, and two instant sample presets (`7891000100103` Protein Yogurt and `7891000200204` Diet Cola Soda).

### 3.2 Cheap Market Module & Weekly Budget Planner

Accessible directly via the **Mercado Barato / Cheap Market** tab:
- **Weekly Spending Ceiling**: users enter their weekly grocery budget (e.g., `R$ 100`, `R$ 150`, `R$ 200`, `R$ 250`, or a custom amount).
- **Protein-per-Currency AI Optimization**: AI cross-references calorie/protein targets and dietary restrictions with retail pricing and the TACO Table to generate:
  - **Categorized Grocery List** (`Produce`, `Proteins`, `Grains & Cereals`, `Dairy`, `Pantry`) with bought checkboxes, manual item add/remove, and one-click sharing.
  - **7-Day Economical Meal Plan** (breakfast, lunch, snack, and dinner) with estimated daily cost, protein (g), and calories (kcal).
  - **Financial Gauges**: total estimated cost vs. weekly ceiling, savings vs. brand-name products, and average cost per gram of protein.
  - **Anti-Inflation Hacks**: practical shopping tips against shrinkflation and low-cost, high-protein staples.

### 3.3 Food Diary, Hydration & Calorie Tracker

Available in the **History & Diary (`HistoryView`)** tab:
- **Daily Water & Calorie Intake Tracker (`DailyIntakeTracker`)**:
  - Interactive hydration controls with quick actions (`+250 ml`, `+500 ml`, `-250 ml`), configurable daily target (default `2500 ml`), and celebration feedback at 100%.
  - Daily calorie progress bar and macronutrient totals compared against user profile goals.
  - Quick manual meal/food entry modal without needing to open the camera.
- **Persistent History & Offline Cache**: chronological feed of analyzed items with deletion controls and instant access to AI swap recommendations.

### 3.4 Executive PDF Reports & Analytics Charts

Available in the **PDF Reports (`MonthlyReportPdf` + `WeeklyTrendsDashboard`)** tab:
- **Interactive Charts (Recharts)**: weekly visualizations toggleable between Macronutrients (g), Health Score (0–100), and Calories vs. Target.
- **A4 Executive PDF Export (`jspdf` + `html2canvas`)**: generates a print-ready nutrition summary containing average Health Score, total scans, protein intake, sodium tracking, avoided harmful additives, and an AI summary tailored for medical or dietitian appointments.

### 3.5 Nutritionist Finder (Google Maps)

Available in the **Nutritionists (`NutritionistFinderView`)** tab:
- Finds nearby registered nutritionists using browser GPS or quick city presets, specialty filters, and search radius selection (3 km to 15 km).
- Integrates an interactive map (`@vis.gl/react-google-maps`), Google Maps directions, direct contact links, and 1-click sharing of the user's food diary summary.

### 3.6 Profile, Dietary Restrictions & Achievements

Available in the **Profile & Restrictions (`ProfileView`)** tab:
- Editable user name, email, daily macro/calorie targets, and **9 dietary restrictions/health conditions** (`lactose`, `gluten`, `peanuts`, `sodium`, `diabetes`, `vegan`, `vegetarian`, `soy`, `keto`).
- **Gamification & Achievements**: progressive badges automatically calculated from scan history (e.g., *TACO Researcher*, *Anti-Additives Shield*, *Hypertrophy Focus*, *Whole Food Friend*).
- **Optional Cloud Sync**: Google Sign-In button to sync profile, logs, and scans to Cloud Firestore.

---

## 4. Technical Architecture

### 4.1 Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Framer Motion (`motion`), Recharts |
| **Backend & Proxy** | Node.js, Express 4 (`server.ts`) with Vite Middleware in development (`tsx server.ts`) |
| **Artificial Intelligence** | Official `@google/genai` SDK (`gemini-3.8-flash` model, server-side only) |
| **Scientific Database** | Embedded TACO Table (NEPA/UNICAMP 4th Edition) in `src/data/tacoDatabase.ts` |
| **Auth & Storage** | Firebase Auth (Google Sign-In) + Cloud Firestore + Local Fallback (`LocalStorage`) |
| **Export & Maps** | `jspdf`, `html2canvas`, `@vis.gl/react-google-maps` |
| **Payments (Optional)** | Stripe (`stripe` server-side SDK) with sandbox fallback |
| **i18n & PWA** | `i18next`, `react-i18next`, `vite-plugin-pwa` (`pt-BR`, `en-US`, `es`) |

### 4.2 Server-Side AI Pipeline & TACO Scientific Audit

```
┌───────────────────────────┐      POST /api/gemini/*       ┌──────────────────────────────┐
│  React Frontend (Vite)    ├──────────────────────────────►│   Express Server (server.ts) │
│  • CameraScanner          │   imageBase64 / barcode /     │   • Protected GEMINI_API_KEY │
│  • MarketBudgetView       │   shelfPrice / weeklyBudget   │   • User-Agent: aistudio-build│
└─────────────┬─────────────┘                               └──────────────┬───────────────┘
              │                                                            │
              │                                                            ▼
              │                                             ┌──────────────────────────────┐
              │                                             │  @google/genai               │
              │                                             │  gemini-3.8-flash            │
              │                                             │  responseMimeType: JSON      │
              │                                             └──────────────┬───────────────┘
              │                                                            │
              │              Structured JSON + tacoValidation              ▼
              │◄────────────────────────────────────────────┤  Deterministic Audit         │
                                                            │  TACO Table (UNICAMP 4th Ed) │
                                                            └──────────────────────────────┘
```

1. Every AI call is routed exclusively through the Express backend (`server.ts`), ensuring `GEMINI_API_KEY` is never exposed in the client bundle.
2. The `GoogleGenAI` client configures `httpOptions.headers['User-Agent'] = 'aistudio-build'` and `responseMimeType: 'application/json'`.
3. After Gemini returns structured JSON, `auditProductAgainstTaco()` runs a deterministic secondary validation normalized to 100g against official TACO entries, attaching `tacoReference` and discrepancy warnings when applicable.
4. When `GEMINI_API_KEY` is absent or external requests fail, structured fallback generators (`generateFallbackAnalysis` / `generateFallbackBudgetPlan`) preserve seamless app usability.

### 4.3 Dual-Adapter Architecture & Offline Persistence

Data persistence follows the **Adapter** pattern inside `src/services/storage/`:

- **`AdapterFactory`**: instantiates `LocalAdapter`, `FirebaseAdapter`, or `SupabaseAdapter` according to `WhiteLabelContext` configuration.
- **Seamless Unauthenticated Guest Mode**: even when the active adapter is `firebase`, if `auth.currentUser` is `null`, `FirebaseAdapter` and `DatabaseService` (`src/services/db.ts`) transparently read and write using `LocalStorage` without throwing Firestore permission errors or forcing login.
- **Offline Queue & Sync (`DatabaseService`)**: when signed-in users scan offline, records are queued in `nutrilense_offline_scans_queue` and automatically synced to Firestore once the browser emits an `online` event.

### 4.4 Security & Firestore Rules

- **Server-Side Secrets**: `GEMINI_API_KEY` and `STRIPE_SECRET_KEY` are accessed solely via `process.env` inside Node.js.
- **Cloud Firestore Security Rules (`firestore.rules`)**:
  - Global **`default deny`** catch-all rule (`allow read, write: if false`).
  - Strict owner isolation (`isOwner(userId)` requiring `request.auth.uid == userId` and `email_verified == true`).
  - Schema validation for `UserProfile`, `ProductScan`, and `DailyLog`, blocking global profile listing (`allow list: if false` on `/users/{userId}`).

---

## 5. API Endpoints Reference

| Method | Route | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/gemini/analyze-product` | Analyzes an image (base64) or EAN barcode of a label, prepared meal, or whole food; returns macros, vitamins/minerals, beneficial/harmful substances, allergens, TACO audit, and 100g cost analysis. |
| `POST` | `/api/gemini/budget-meal-plan` | Generates a 7-day economical meal plan and categorized grocery list staying within the user's weekly budget ceiling (`weeklyBudget`, `currency`, goals, and restrictions). |
| `GET` | `/api/stripe/plans` | Lists available plans (`free`, `pro`, `plus`) and Stripe configuration status. |
| `POST` | `/api/stripe/create-checkout-session` | Creates a Stripe Checkout session or returns sandbox activation in demo mode. |
| `POST` | `/api/stripe/provision-product` | Provisions/syncs product and recurring prices in Stripe. |
| `GET` / `POST` | `/api/maps/nearby-nutritionists` | Searches nearby nutritionists by coordinates and specialty. |

---

## 6. Setup, Environment Variables & Running Locally

### Environment Variables (`.env`)

Based on `.env.example`:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_OPTIONAL"
STRIPE_PUBLISHABLE_KEY="pk_test_OPTIONAL"
VITE_GOOGLE_MAPS_API_KEY="MAPS_KEY_OPTIONAL"
```

### Available Scripts (`package.json`)

```bash
# Install dependencies
npm install

# Start development server (Express + Vite Middleware on port 3000)
npm run dev

# Run TypeScript type check
npm run lint

# Build production bundle into /dist
npm run build

# Run in production
npm run start
```

---

## 7. Internationalization (i18n) & PWA

- **Supported Languages**: Portuguese (`pt-BR` — default), English (`en-US`), and Spanish (`es`), switchable at runtime via the navbar language selector (`src/locales/*.json`).
- **Progressive Web App (PWA)**: configured with `vite-plugin-pwa` and a header install button (`PWAInstallButton`) supporting direct installation on Android/Desktop, iOS Safari installation guidance, and offline access to saved scan history.
