// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
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
    quality: 75,
  },

  devServer: {
    port: 3002,
    host: "127.0.0.1",
  },

  nitro: {
    preset: "vercel",
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
  },

  vite: {
    cacheDir: ".vite-cache",
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Aturuang - Aplikasi Pencatatan Uang",
      short_name: "Aturuang",
      description: "Aplikasi Pencatatan Uang",
      theme_color: "#0353a4",
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
      ],
    },
  },
});
