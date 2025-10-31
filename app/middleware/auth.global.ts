export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  const routes = {
    LOGIN: "login-page",
    HOME: "homepage",
    DESKTOP_HOME: "desktop-home",
  } as const;

  const routeName = String(to.name ?? "");
  const isAuthenticated = Boolean(user.value);

  // Always redirect desktop-only route to login (adjust as needed)
  // if (routeName === routes.DESKTOP_HOME) {
  //   return navigateTo({ name: routes.LOGIN });
  // }

  // Redirect unauthenticated users to login when accessing protected routes
  if (!isAuthenticated && routeName !== routes.LOGIN) {
    return navigateTo({ name: routes.LOGIN });
  }

  // Redirect authenticated users away from login page to home
  if (isAuthenticated && routeName === routes.LOGIN) {
    return navigateTo({ name: routes.HOME });
  }
});
