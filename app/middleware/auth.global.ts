export default defineNuxtRouteMiddleware(async (to, _from) => {
  const user = useSupabaseUser();
  const { isDesktop, isMobileOrTablet } = useDevice();

  // redirect to desktop home if user access on desktop
  if (isDesktop && to.name !== "desktop-home") {
    return await navigateTo({ name: "desktop-home", replace: true });
  }

  if (isMobileOrTablet) {
    if (user.value && to.name === 'login-page') {
      return await navigateTo({ name: "homepage", replace: true });
    }

    if (!user.value && to.name !== "login-page") {
      return await navigateTo({ name: "login-page", replace: true });
    }

    if (to.name === "desktop-home") {
      return await navigateTo({ name: "login-page", replace: true });
    }
  }
});
