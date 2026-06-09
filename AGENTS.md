# AGENTS.md for aturuang

## Project Overview

"Aturuang" is a personal finance management application (PWA) built to help users efficiently manage their money. It features transaction tracking, budget management, wallet management, and AI-powered financial insights.

## Critical Constraints

- **Ask before change:** If user request unclear/ambiguous or changes stable files, ask first. Do not assume.
- **Do not modify stable features:** Keep these intact unless asked:
  - Auth: `app/pages/login/`, `app/pages/register/`, `app/pages/confirm/`
  - Transactions: `app/pages/transactions/`, `server/api/transaction.post.ts`
  - Wallets: `app/pages/wallet/`
  - Budgets: `app/pages/budget/`
  - AI Insights: `app/pages/insight/`, `server/api/insight.post.ts`
  - Core Config & PWA: `nuxt.config.ts`, icon assets.

## Agent Skills
- Always load all skills from `.agents/skills` directory at session start.

## Tech Stack

- **Framework:** Nuxt 3 (Vue 3, TypeScript)
- **State Management:** Pinia
- **UI:** Nuxt UI, Tailwind CSS
- **Backend/Auth:** Supabase
- **AI:** Google Gemini API
- **Charts:** ApexCharts
- **PWA:** Vite PWA
- **Validation:** Valibot
- **Icons:** Iconify

## Development Commands

- `npm install`: Install dependencies.
- `npm run dev`: Start dev server.
- `npm run build`: Build for production.
- `npm run generate`: Static generation.
- `npm run preview`: Preview production build locally.

## Fixed/Stable Features (DO NOT MODIFY unless explicitly asked)

These features are complete and stable:

- **Authentication:** `app/pages/login/`, `app/pages/register/`, `app/pages/confirm/`
- **Transaction Management:** `app/pages/transactions/`, `server/api/transaction.post.ts`
- **Wallet Management:** `app/pages/wallet/`
- **Budget Management:** `app/pages/budget/`
- **AI Insight (Gemini):** `app/pages/insight/`, `server/api/insight.post.ts`
- **Core Configuration:** `nuxt.config.ts` (Supabase, PWA, Route Rules)
- **PWA Setup:** `nuxt.config.ts` settings, icon assets.

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
