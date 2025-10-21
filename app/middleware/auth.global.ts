export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  const routes = {
    LOGIN: "login-page",
    HOME: "homepage",
    DESKTOP_HOME: "desktop-home",
  } as const;

  const event = useRequestEvent();
  const userAgent = event?.node.req.headers["user-agent"] || "";

  const isDesktop = /(Windows|Macintosh|Linux|X11)/i.test(userAgent);
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  const routeName = (to.name ?? "") as string;
  const isAuthenticated = !!user.value;

  // Decide a single redirection target to avoid multiple navigateTo calls
  let target: string | null = null;
  let replace = true; // keep history clean for auth redirects

  if (!isAuthenticated) {
    if (isDesktop && routeName !== routes.DESKTOP_HOME) {
      target = routes.DESKTOP_HOME;
      replace = false; // preserve original behavior (no replace) for desktop redirect
    }

    if (isMobile) {
      if (routeName !== routes.LOGIN) {
        target = routes.LOGIN;
      }
    }
  }

  if (isAuthenticated) {
    if (isMobile && routeName === routes.LOGIN) {
      target = routes.HOME;
    }
  }

  if (target) {
    return navigateTo({ name: target, replace });
  }
});
