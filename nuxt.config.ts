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
    // '@nuxtjs/supabase',
    '@nuxtjs/device'
  ],

  supabase: {
    redirect: false,
  },

  devServer: {
    port: 3002,
  },

  image:{
    quality: 75
  }
})