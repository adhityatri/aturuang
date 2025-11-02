export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  const routes = {
    LOGIN: "login-page",
    HOME: "homepage",
    REGISTER: "register",
    CONFIRM: "confirm",
    DESKTOP_HOME: "desktop-home",
  } as const;

  const routeName = String(to.name ?? "");
  const isAuthenticated = Boolean(user.value);

  // Redirect unauthenticated users to login when accessing protected routes
  if (
    !isAuthenticated &&
    routeName !== routes.LOGIN &&
    routeName !== routes.DESKTOP_HOME &&
    routeName !== routes.REGISTER &&
    routeName !== routes.CONFIRM
  ) {
    return navigateTo({ name: routes.LOGIN });
  }

  // Redirect authenticated users away from login page to home
  if (isAuthenticated && routeName === routes.LOGIN) {
    return navigateTo({ name: routes.HOME });
  }
});
