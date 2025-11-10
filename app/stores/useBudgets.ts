import type { iBudget, iBudgetCreate } from "~/types/budget";

export const useBudgets = defineStore("budgets-store", () => {
  const budgets = ref<iBudget[] | null>(null);
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const getBudgetsByUserId = async () => {
    if (!user.value?.id) {
      return;
    }

    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user.value?.id || "");

    if (error) {
      throw error;
    }

    budgets.value = data ?? [];
  };

  const insertBudget = async (budget: iBudgetCreate) => {
    const { data, error } = await supabase
      .from("budgets")
      .insert([budget])
      .select();

    if (error) {
      throw error;
    }

    await getBudgetsByUserId();
    return data;
  };

  return {
    budgets,
    getBudgetsByUserId,
    insertBudget,
  };
});
