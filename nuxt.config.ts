// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: "id" },
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
        },
        {
          name: "description",
          content:
            "Yotro - Aplikasi pengelola keuangan pribadi (PWA). Catat transaksi, atur budget keluarga",
        },
        { name: "format-detection", content: "telephone=no" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Yotro - Money Management App" },
        {
          property: "og:description",
          content: "Atur uang lebih mudah dengan Yotro. Aplikasi manajemen keuangan keluarga kamu.",
        },
        { property: "og:image", content: "/Yotro-brand.png" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "geo.region", content: "ID" },
        { name: "geo.placename", content: "Indonesia" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
    },
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },

  nitro: { preset: "cloudflare-pages" },

  routeRules: {
    "/_nuxt/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
  },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxtjs/supabase",
    "@nuxtjs/device",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
    "@nuxtjs/mdc",
    "@vueuse/nuxt",
  ],

  runtimeConfig: {
    public: { geminiKey: process.env.GEMINI_API_KEY, supabaseUrl: process.env.SUPABASE_URL },
  },

  experimental: { watcher: "parcel", payloadExtraction: true, inlineRouteRules: true },

  plugins: [{ src: "~/plugins/apexcharts.client.ts", mode: "client" }],

  ui: { colorMode: false },

  supabase: {
    redirect: false,
    redirectOptions: { login: "/login", callback: "/confirm" },
    types: false,

    clientOptions: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // Enable session detection in the URL
      },
    },
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7, // Waktu kedaluwarsa cookies (7 hari)
      sameSite: "lax", // Mencegah serangan CSRF
      secure: process.env.NODE_ENV === "production", // Hanya berlaku pada HTTPS di produksi
    },
  },

  image: { quality: 80 },

  devServer: { port: 3002, host: "127.0.0.1" },

  router: { options: { sensitive: true, scrollBehaviorType: "smooth" } },

  vite: {
    cacheDir: ".vite-cache",
    optimizeDeps: { include: ["vue3-apexcharts", "valibot"] },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1200,
      cssMinify: "lightningcss",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: [
            "console.log",
            "console.error",
            "console.warn",
            "console.info",
            "console.time",
          ],
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes("node_modules/vue") ||
              id.includes("node_modules/pinia") ||
              id.includes("node_modules/vue-router")
            ) {
              return "vendor";
            }
            if (id.includes("node_modules/@supabase")) {
              return "supabase";
            }
            if (id.includes("node_modules/apexcharts")) {
              return "charts";
            }
          },
        },
      },
    },
  },

  pwa: {
    devOptions: { enabled: false },
    registerType: "autoUpdate",
    manifest: {
      name: "Yotro - Money Management App",
      short_name: "Yotro",
      description:
        "Aplikasi Pencatatan Uang yang membantu pengguna dalam mengelola keuangan mereka dengan lebih mudah.",
      theme_color: "#cce831",
      background_color: "#cce831",
      categories: ["finance", "productivity"],
      start_url: "/",
      display: "standalone",
      icons: [
        { src: "/pwa-64x64.png", sizes: "64x64", type: "image/png" },
        { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
      ],
      screenshots: [
        { src: "/screenshot-mobile.png", sizes: "750x1334", type: "image/png", form_factor: "narrow" }
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,json,png,svg,ico,woff2}"],
      navigateFallback: null,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "images",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts-cache",
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
          handler: "CacheFirst",
          options: {
            cacheName: "gstatic-fonts-cache",
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        // Cache API responses (Supabase, AI, etc.) - NetworkFirst for fresh data
        {
          urlPattern: /^https:\/\/.+\.supabase\.co\/rest\/v1\/.*/,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-supabase",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 5 * 60, // 5 minutes
            },
            networkTimeoutSeconds: 10,
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        // Cache Nuxt payloads (_payload.json) - StaleWhileRevalidate for fast navigation
        {
          urlPattern: /_payload\.json$/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "nuxt-payload",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60, // 1 hour
            },
          },
        },
        // Cache API routes (your /api/* endpoints)
        {
          urlPattern: /\/api\/.*/,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-local",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 2 * 60, // 2 minutes
            },
            networkTimeoutSeconds: 8,
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
  },
  features: {
    devLogs: false, //nonaktifkan log dari server ke client
  },
  googleFonts: { families: { "Mona Sans": ["300", "400", "500", "600", "700", "800", "900"] } },
});
