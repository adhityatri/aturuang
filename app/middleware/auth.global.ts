export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  const { isDesktop } = useDevice();

  const routes = {
    LOGIN: "login-page",
    HOME: "homepage",
    DESKTOP_HOME: "desktop-home",
  } as const;

  const routeName = (to.name ?? "") as string;
  const isAuthenticated = !!user.value;

  // Decide a single redirection target to avoid multiple navigateTo calls
  let target: string | null = null;
  let replace = true; // keep history clean for auth redirects

  if (isDesktop) {
    // Desktop users should always land on desktop-home
    if (routeName !== routes.DESKTOP_HOME) {
      target = routes.DESKTOP_HOME;
      replace = false; // preserve original behavior (no replace) for desktop redirect
    }
  } else {
    // Mobile / tablet logic
    if (isAuthenticated && routeName === routes.LOGIN) {
      target = routes.HOME;
    } else if (!isAuthenticated && routeName !== routes.LOGIN) {
      target = routes.LOGIN;
    } else if (routeName === routes.DESKTOP_HOME) {
      // Prevent mobile users from accessing desktop-only route
      target = routes.LOGIN;
    }
  }

  if (target) {
    return navigateTo({ name: target, replace });
  }
});
