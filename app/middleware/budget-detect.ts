export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  const budgetsStore = useBudgets();
  const BUDGET_ROUTE = "budget-page";

  // 1. Skip if user is not logged in
  if (!user.value) return;

  // 2. Only fetch if we haven't loaded budgets yet (Client-side optimization)
  if (!budgetsStore.budgets) {
    try {
      await budgetsStore.getBudgetsByUserId();
    } catch (error) {
      console.error("Error fetching budgets in middleware:", error);
      // Fail gracefully - don't redirect if fetch failed
      return;
    }
  }

  // 3. Check if budget exists and redirect if needed
  if (budgetsStore.budgets && budgetsStore.budgets.length === 0) {
    // Prevent infinite redirect loop
    if (to.name === BUDGET_ROUTE) return;

    return navigateTo({ name: BUDGET_ROUTE });
  }
});
