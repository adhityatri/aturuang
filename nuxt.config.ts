// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },

  nitro: {
    preset: "cloudflare-pages",
  },

  routeRules: {
    "/_nuxt/**": {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
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
    public: {
      geminiKey: process.env.GEMINI_API_KEY,
      supabaseUrl: process.env.SUPABASE_URL,
    },
  },

  experimental: {
    watcher: "parcel",
    payloadExtraction: true,
    inlineRouteRules: true,
  },

  plugins: [
    {
      src: "~/plugins/apexcharts.client.ts",
      mode: "client",
    },
  ],

  ui: {
    colorMode: false,
  },

  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
    },
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

  image: {
    quality: 80,
  },

  devServer: {
    port: 3002,
    host: "127.0.0.1",
  },

  router: {
    options: {
      sensitive: true,
      scrollBehaviorType: "smooth",
    },
  },

  vite: {
    cacheDir: ".vite-cache",
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
          manualChunks: {
            vendor: ["vue", "vue-router", "pinia"],
            supabase: ["@supabase/supabase-js"],
            charts: ["apexcharts"],
          },
        },
      },
    },
  },

  pwa: {
    devOptions: {
      enabled: false,
    },
    registerType: "autoUpdate",
    manifest: {
      name: "Yotro - Money Management App",
      short_name: "Yotro",
      description:
        "Aplikasi Pencatatan Uang yang membantu pengguna dalam mengelola keuangan mereka dengan lebih mudah.",
      theme_color: "#0353a4",
      background_color: "#0353a4",
      categories: ["finance", "productivity"],
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,png,svg,ico,woff2}"],
      navigateFallback: null,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: "CacheFirst", // Cache images first
          options: {
            cacheName: "images",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
          handler: "CacheFirst",
          options: {
            cacheName: "gstatic-fonts-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
  },
  features: {
    devLogs: false, //nonaktifkan log dari server ke client
  },
});
