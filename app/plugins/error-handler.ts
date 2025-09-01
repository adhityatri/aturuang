// plugins/error-handler.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error("Global Error Captured:", error, instance, info);
    // Report error to a service or log it
  };

  nuxtApp.hook("vue:error", (error) => {
    console.error("Vue Error Hook:", error);
  });
});
