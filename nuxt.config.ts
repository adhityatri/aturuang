// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/supabase',
    '@nuxtjs/device',
    '@vueuse/nuxt',
    'nuxt-echarts',
    '@pinia/nuxt'
  ],

  supabase: {
    redirect: true,
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
      sameSite: 'lax', // Mencegah serangan CSRF
      secure: process.env.NODE_ENV === 'production', // Hanya berlaku pada HTTPS di produksi
    },
  },

  devServer: {
    port: 3002,
  },

  image:{
    quality: 75
  }
})