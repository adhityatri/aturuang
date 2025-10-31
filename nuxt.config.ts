// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },
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
  ],

  experimental: {
    watcher: "chokidar",
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
    redirect: false,
    types: false,
    clientOptions: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // Enable session detection in the URL
      },
    },
    cookieOptions: {
      // Cookies akan tersedia di seluruh domain dan hanya bisa diakses oleh server
      maxAge: 60 * 60 * 24 * 7, // Waktu kedaluwarsa cookies (7 hari)
      sameSite: "lax", // Mencegah serangan CSRF
      secure: process.env.NODE_ENV === "production", // Hanya berlaku pada HTTPS di produksi
    },
  },

  image: {
    quality: 80,
    // format: ["webp"],
    // screens: {
    //   xs: 320,
    //   sm: 640,
    //   md: 768,
    //   lg: 1024,
    //   xl: 1280,
    //   xxl: 1536,
    //   "2xl": 1536,
    // },
  },

  devServer: {
    port: 3002,
    host: "127.0.0.1",
  },

  nitro: {
    preset: "bun",
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ["/"],
      // routes: ["/", "/login", "/transactions"],
    },
  },

  vite: {
    cacheDir: ".vite-cache",
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
    },
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Aturuang",
      short_name: "Aturuang",
      description: "Aplikasi Pencatatan Uang",
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
      globPatterns: ["**/*.{js,css,png,svg,ico}"],
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
});
