export default defineNuxtRouteMiddleware(async () => {
  const routes = {
    BUDGET: "budget-page",
    LOGIN: "login-page",
    HOME: "homepage",
  } as const;

  const budgetsStore = useBudgets();
  try {
    await budgetsStore.getBudgetsByUserId();
  } catch (error) {
    console.error("Error fetching budgets in middleware:", error);
  }

  if (budgetsStore.budgets?.length === 0) {
    return navigateTo({ name: routes.BUDGET });
  }
});
