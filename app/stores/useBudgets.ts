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

  const update = async (payload: { reset_date: string; amount: number }) => {
    if (!user.value?.id) {
      return;
    }

    const dataPayload = {
      monthly_start: payload.reset_date,
      amount: payload.amount,
    };

    const { data, error } = await supabase
      .from("budgets")
      .update({ ...dataPayload })
      .eq("user_id", user.value?.id || "")
      .select();

    if (error) {
      useToast().add({
        title: "Error",
        description: "Gagal mengupdate budget : " + error.message,
        color: "error",
      });
      throw error;
    }

    useToast().add({
      title: "Success",
      description: "Budget berhasil diupdate",
      color: "success",
    });
    await getBudgetsByUserId();
    return { data, error };
  };

  const isBudgetOpen = shallowRef<boolean>(false);

  return {
    budgets,
    isBudgetOpen,
    getBudgetsByUserId,
    insertBudget,
    update,
  };
});
