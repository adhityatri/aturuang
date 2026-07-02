export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient();

  if (import.meta.client) {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed successfully");
        return;
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out");
        await navigateTo("/login");
        return;
      }

      if (!session && event === "USER_DELETED") {
        console.log("User deleted, redirecting to login");
        await navigateTo("/login");
        return;
      }
    });

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (response.status === 401 || response.status === 400) {
          const contentType = response.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            const clone = response.clone();
            const data = await clone.json();

            if (
              data?.code === "refresh_token_not_found" ||
              data?.message?.includes("Refresh Token Not Found")
            ) {
              console.log("Refresh token expired, signing out...");
              await supabase.auth.signOut();
              window.location.href = "/login";
            }
          }
        }

        return response;
      } catch (error) {
        throw error;
      }
    };
  }
});
