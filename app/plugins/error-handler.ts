export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = async (error, instance, info) => {
    console.error("Global Error Captured:", error, instance, info);

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      String((error as Record<string, unknown>).message).includes(
        "Refresh Token Not Found"
      )
    ) {
      const supabase = useSupabaseClient();
      await supabase.auth.signOut();
      await navigateTo("/login");
    }
  };

  if (import.meta.client) {
    window.addEventListener("unhandledrejection", async (event) => {
      const reason = event.reason;
      if (
        reason &&
        typeof reason === "object" &&
        "message" in reason &&
        String((reason as Record<string, unknown>).message).includes(
          "Refresh Token Not Found"
        )
      ) {
        event.preventDefault();
        const supabase = useSupabaseClient();
        await supabase.auth.signOut();
        window.location.href = "/login";
      }
    });
  }
});
