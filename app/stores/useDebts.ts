import type {
  iDebt,
  iDebtCreate,
  iDebtPayment,
  iDebtPaymentCreate,
  iDebtUpdate,
} from "~/types/debt";

export const useDebts = defineStore("debts-store", () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const debts = ref<iDebt[]>([]);
  const loading = ref(false);

  const payments = ref<iDebtPayment[]>([]);
  const paymentsLoading = ref(false);

  const getDebts = async () => {
    if (!user.value?.id) return;

    loading.value = true;
    try {
      const { data, error } = await supabase
        .from("debts")
        .select("*")
        .eq("user_id", user.value.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      debts.value = (data ?? []) as iDebt[];
    } catch (err) {
      console.error("Error fetching debts:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const insertDebt = async (payload: iDebtCreate) => {
    if (!user.value?.id) return;

    const { data, error } = await supabase
      .from("debts")
      .insert({
        user_id: user.value.id,
        type: payload.type,
        counterparty: payload.counterparty.trim(),
        amount: payload.amount,
        due_date: payload.due_date || null,
        note: payload.note?.trim() || null,
        wallet_id: payload.wallet_id || null,
      })
      .select()
      .single();

    if (error) throw error;

    debts.value = [data as iDebt, ...debts.value];
    return data as iDebt;
  };

  const updateDebt = async (id: string, payload: iDebtUpdate) => {
    if (!user.value?.id) return;

    const { data, error } = await supabase
      .from("debts")
      .update({
        ...payload,
        counterparty: payload.counterparty?.trim(),
        note: payload.note?.trim() || null,
      })
      .eq("id", id)
      .eq("user_id", user.value.id)
      .select()
      .single();

    if (error) throw error;

    debts.value = debts.value.map((debt) => (debt.id === id ? (data as iDebt) : debt));
    return data as iDebt;
  };

  const getPayments = async (debtId: string) => {
    if (!user.value?.id) return;

    paymentsLoading.value = true;
    try {
      const { data, error } = await supabase
        .from("debt_payments")
        .select("*")
        .eq("debt_id", debtId)
        .eq("user_id", user.value.id)
        .order("paid_at", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      payments.value = (data ?? []) as iDebtPayment[];
    } catch (err) {
      console.error("Error fetching debt payments:", err);
      throw err;
    } finally {
      paymentsLoading.value = false;
    }
  };

  const refreshDebt = async (debtId: string) => {
    if (!user.value?.id) return;

    const { data, error } = await supabase
      .from("debts")
      .select("*")
      .eq("id", debtId)
      .eq("user_id", user.value.id)
      .single();

    if (error) throw error;

    const debt = data as iDebt;
    debts.value = debts.value.map((item) => (item.id === debt.id ? debt : item));
    return debt;
  };

  const addPayment = async (debtId: string, payload: iDebtPaymentCreate) => {
    if (!user.value?.id) return;

    const { data, error } = await supabase
      .from("debt_payments")
      .insert({
        debt_id: debtId,
        user_id: user.value.id,
        amount: payload.amount,
        ...(payload.paid_at ? { paid_at: payload.paid_at } : {}),
        note: payload.note?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;

    const payment = data as iDebtPayment;
    payments.value = [payment, ...payments.value];

    // paid_amount & status diperbarui oleh trigger, jadi ambil ulang datanya
    const debt = await refreshDebt(debtId);
    return { payment, debt };
  };

  const removeDebt = async (id: string) => {
    if (!user.value?.id) return;

    const { error } = await supabase
      .from("debts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.value.id);

    if (error) throw error;

    debts.value = debts.value.filter((debt) => debt.id !== id);
  };

  const activeDebts = computed(() => debts.value.filter((debt) => debt.status !== "paid"));

  const totalDebt = computed(() =>
    activeDebts.value
      .filter((debt) => debt.type === "debt")
      .reduce((total, debt) => total + Number(debt.remaining_amount || 0), 0),
  );

  const totalReceivable = computed(() =>
    activeDebts.value
      .filter((debt) => debt.type === "receivable")
      .reduce((total, debt) => total + Number(debt.remaining_amount || 0), 0),
  );

  const debtCount = computed(
    () => activeDebts.value.filter((debt) => debt.type === "debt").length,
  );

  const receivableCount = computed(
    () => activeDebts.value.filter((debt) => debt.type === "receivable").length,
  );

  return {
    debts,
    loading,
    payments,
    paymentsLoading,
    getDebts,
    getPayments,
    insertDebt,
    updateDebt,
    addPayment,
    removeDebt,
    activeDebts,
    totalDebt,
    totalReceivable,
    debtCount,
    receivableCount,
  };
});
