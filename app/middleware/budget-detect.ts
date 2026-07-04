export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const user = useSupabaseUser();
  const budgetsStore = useBudgets();
  const BUDGET_ROUTE = "budget-page";

  if (!user.value) return;

  if (!budgetsStore.budgets) {
    try {
      await budgetsStore.getBudgetsByUserId();
    } catch (error) {
      console.error("Error fetching budgets in middleware:", error);
      return;
    }
  }

  if (budgetsStore.budgets && budgetsStore.budgets.length === 0) {
    if (to.name === BUDGET_ROUTE) return;

    return navigateTo({ name: BUDGET_ROUTE });
  }
});
