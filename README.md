# Yotro - Atur Uang Kamu Lebih Mudah

Aplikasi manajemen keuangan pribadi berbasis PWA yang membantu pengguna mencatat transaksi, mengatur anggaran, mengelola dompet, dan mendapatkan insight keuangan berbasis AI.

## Fitur Utama

- **Autentikasi** - Login & register via Supabase dengan sesi cookie aman
- **Manajemen Transaksi** - Catat pemasukan dan pengeluaran
- **Manajemen Dompet** - Kelola beberapa akun/dompet sekaligus
- **Anggaran (Budget)** - Atur dan pantau batas pengeluaran
- **AI Financial Insight** - Insight keuangan otomatis menggunakan Google Gemini AI
- **PWA** - Dapat diinstall sebagai aplikasi, support offline caching
- **Mobile-First** - Didesain untuk penggunaan di perangkat mobile

## Tech Stack

- **Framework:** Nuxt 3 (Vue 3, TypeScript)
- **State Management:** Pinia
- **UI & Styling:** Nuxt UI, Tailwind CSS
- **Backend & Auth:** Supabase
- **AI:** Google Gemini API (`@google/genai`)
- **Charts:** ApexCharts
- **PWA:** Vite PWA
- **Validasi:** Valibot
- **Icons:** Iconify (Lucide & Solar)

## Instalasi

```bash
# Install dependencies
npm install

# Salin env
cp .env.example .env
# Isi nilai di .env sesuai konfigurasi Supabase dan Gemini API kamu
```

## Penggunaan

```bash
# Development
npm run dev

# Build production
npm run build

# Preview production
npm run preview

# Generate static
npm run generate
```

Dev server berjalan di `http://127.0.0.1:3002`

## Struktur Project

```
app/
├── pages/
│   ├── index.vue          # Dashboard
│   ├── login/             # Halaman login
│   ├── register/          # Halaman register
│   ├── transactions/      # Manajemen transaksi
│   ├── wallet/            # Manajemen dompet
│   ├── budget/            # Manajemen anggaran
│   ├── insight/           # AI financial insight
│   └── profile/           # Profil pengguna
├── components/            # Komponen Vue modular
├── stores/                # Pinia state modules
├── composables/           # Reusable composables
└── layouts/               # Layout aplikasi
server/
└── api/
    ├── insight.post.ts    # Endpoint AI insight (Gemini)
    └── transaction.post.ts
```

## Lisensi

Lihat file [LICENSE](./LICENSE).
