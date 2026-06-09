# Yotro - Money Management (aturuang)

## Instruksi untuk AI
Jika instruksi dari pengguna kurang jelas, ambigu, atau mungkin mengarah pada aksi yang tidak diinginkan (seperti mengubah file stabil, menghapus data, atau menjalankan perintah berbahaya), **WAJIB** untuk menanyakan kembali dan meminta klarifikasi SEBELUM melanjutkan eksekusi. Jangan membuat asumsikan.

## Project Overview
"Aturuang" is a personal finance management application (PWA) built to help users efficiently manage their money. It features transaction tracking, budget management, wallet management, and AI-powered financial insights.

## Tech Stack
- **Framework:** Nuxt 3 (Vue 3, TypeScript)
- **State Management:** Pinia (`@pinia/nuxt`)
- **UI & Styling:** Nuxt UI (`@nuxt/ui`), Tailwind CSS, Nuxt Fonts
- **Backend & Auth:** Supabase (`@nuxtjs/supabase`)
- **AI Integration:** Google Gemini API (`@google/genai`) for financial insights
- **Charts:** ApexCharts (`vue3-apexcharts`)
- **PWA:** Vite PWA (`@vite-pwa/nuxt`)
- **Validation:** Valibot
- **Icons:** Iconify (Lucide & Solar icon sets)

## Project Structure
- `app/`: Contains the main frontend Nuxt application.
  - `pages/`: 
    - `/` (Dashboard)
    - `/login`, `/register`, `/confirm`, `/authorize` (Authentication)
    - `/transactions` (Income & Expenses tracking)
    - `/budget` (Budgeting limits)
    - `/wallet` (Accounts management)
    - `/insight` (AI generated financial insights)
    - `/profile` (User settings)
  - `components/`: Modular Vue components (App layout, Category, Money Tracker, Profile, Transactions, Wallet, SummaryCard).
  - `layouts/`: Application layouts.
  - `middleware/`: Nuxt route middleware (likely for auth protection).
  - `stores/`: Pinia state modules.
  - `composables/`: Reusable Vue composables.
- `server/api/`: Nitro server routes.
  - `insight.post.ts`: Endpoint for generating Gemini AI insights.
  - `transaction.post.ts`: Endpoint handling transaction logic.
- `data/`: Contains static or mock data (`transactions.json`).
- `nuxt.config.ts`: Nuxt configuration containing PWA settings, Supabase auth redirects, Vite optimization, etc.

## Key Features
1. **Authentication:** Full Supabase auth flow with secure cookie sessions.
2. **Transaction Management:** Record and view income and expenses.
3. **Wallet Management:** Support for multiple financial accounts/wallets.
4. **Budgeting:** Set and track budgets.
5. **AI Financial Insights:** Generates actionable financial insights using Google's Gemini AI based on user data.
6. **PWA:** Installable as an app with offline caching for images and fonts.
7. **Mobile-First/Responsive:** Designed for mobile usability (contains `MobileOnly.vue` wrapper).

## Environment Variables
Required external services configured via `.env`:
- **Supabase:** `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_ACCESS_TOKEN`
- **Google Gemini:** `GEMINI_API_KEY`
- **Appwrite:** `NUXT_PUBLIC_APPWRITE_PROJECT_ID`, `NUXT_PUBLIC_APPWRITE_PROJECT_NAME`, `NUXT_PUBLIC_APPWRITE_ENDPOINT` (Present in config, potentially used for storage or other backend tasks).
*(Note: Keep keys out of version control)*

## Development Commands
- `npm run dev`: Start dev server.
- `npm run build`: Build for production.
- `npm run generate`: Static generation.
- `npm run preview`: Preview production build locally.

## Fitur Fix (DO NOT MODIFY)
Fitur dan file di bawah ini **sudah selesai dan stabil**. JANGAN mengubah, menghapus, atau memodifikasi fitur/file ini kecuali diminta secara eksplisit:
1. **Authentication** (Login, Register, Confirm) - `app/pages/login/`, `app/pages/register/`, `app/pages/confirm/`
2. **Transaction Management** - `app/pages/transactions/`, `server/api/transaction.post.ts`
3. **Wallet Management** - `app/pages/wallet/`
4. **Budget Management** - `app/pages/budget/`
5. **AI Insight (Gemini)** - `app/pages/insight/`, `server/api/insight.post.ts`
6. **Core Configuration** - `nuxt.config.ts` (Supabase, PWA, Route Rules)
7. **PWA Setup** - Settings di `nuxt.config.ts` dan icon assets.
