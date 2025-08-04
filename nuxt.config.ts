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
    // cookiePrefix: 'aturuang',
    redirect: true,
    // cookieOptions:{
    //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax'
    // }
  },

  devServer: {
    port: 3002,
  },

  image:{
    quality: 75
  }
})