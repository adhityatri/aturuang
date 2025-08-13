export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  const { isDesktop, isMobileOrTablet } = useDevice();
  
  // Early return for desktop users
  if (isDesktop) {
    return to.name !== "desktop-home" 
      ? navigateTo({ name: "desktop-home", replace: true })
      : undefined;
  }

  // Handle mobile/tablet users only
  if (!isMobileOrTablet) return;

  const routeName = to.name as string;
  const isAuthenticated = !!user.value;
  
  // Route mapping for cleaner logic
  const routes = {
    LOGIN: "login-page",
    HOME: "homepage",
    DESKTOP_HOME: "desktop-home"
  } as const;

  // Authentication-based redirects
  if (isAuthenticated && routeName === routes.LOGIN) {
    return navigateTo({ name: routes.HOME, replace: true });
  }

  if (!isAuthenticated && routeName !== routes.LOGIN) {
    return navigateTo({ name: routes.LOGIN, replace: true });
  }

  // Prevent mobile users from accessing desktop-only routes
  if (routeName === routes.DESKTOP_HOME) {
    return navigateTo({ name: routes.LOGIN, replace: true });
  }
});