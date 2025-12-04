// plugins/error-handler.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = async (error, instance, info) => {
    console.error("Global Error Captured:", error, instance, info);

    // Handle Supabase Auth Error: Invalid Refresh Token
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      String((error as Record<string, unknown>).message).includes(
        "Refresh Token Not Found"
      )
    ) {
      console.log("Detected invalid refresh token, clearing session...");
      const supabase = useSupabaseClient();
      await supabase.auth.signOut();
      return navigateTo("/login");
    }
  };

  nuxtApp.hook("vue:error", (error) => {
    console.error("Vue Error Hook:", error);
  });

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
        console.log(
          "Detected invalid refresh token (unhandledrejection), clearing session..."
        );
        const supabase = useSupabaseClient();
        await supabase.auth.signOut();
        window.location.href = "/login"; // Force reload to clear state
      }
    });
  }
});
