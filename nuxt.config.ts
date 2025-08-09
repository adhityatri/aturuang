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
    '@vueuse/nuxt'
  ],

  supabase: {
    redirect: true,
    clientOptions: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // Enable session detection in the URL
      },
    }
  },

  devServer: {
    port: 3002,
  },

  image:{
    quality: 75
  }
})