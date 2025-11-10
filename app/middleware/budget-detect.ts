export default defineNuxtRouteMiddleware(async () => {
  const routes = {
    BUDGET: "budget-page",
    LOGIN: "login-page",
    HOME: "homepage",
  } as const;

  const budgetsStore = useBudgets();
  await budgetsStore.getBudgetsByUserId();

  if (budgetsStore.budgets?.length === 0) {
    return navigateTo({ name: routes.BUDGET });
  }
});
