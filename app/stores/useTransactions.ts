import type { iTransaction } from "~/types/transactions";

interface iFilter {
  sort?: boolean;
}

const useTransactionsStore = defineStore("transactions-store", () => {
  const supabaseClient = useSupabaseClient();
  const transactionsList = ref<iTransaction[]>([]);
  const user = useSupabaseUser();
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const transaction_limit = ref(5);

  const balance = computed(() => income.value.total - expenses.value.total);
  const todayTransactions = computed(() => {
    return transactionsList.value
      .filter((item) => useIsToday(new Date(item.created_at)))
      .slice(0, transaction_limit.value);
  });

  const thisMonthTransactions = computed(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return transactionsList.value.filter(
      (t) => new Date(t.created_at) >= startOfMonth
    );
  });

  const recentTransactions = computed(() => {
    return transactionsList.value.slice(0, transaction_limit.value);
  });

  const incomeThisMonth = computed(() => {
    return transactionsList.value.reduce((sum, transaction) => {
      const { created_at, categories, amount } = transaction;
      if (categories?.type === "income" && amount) {
        const date = new Date(created_at);
        if (useIsThisMonth(date)) {
          return sum + amount;
        }
      }
      return sum;
    }, 0);
  });

  const income = computed(() => {
    const incomeTransactions = filterTransactionsByType("income");
    const total = incomeTransactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0
    );
    return { transactions: incomeTransactions, total };
  });

  const expenses = computed(() => {
    const expenseTransactions = filterTransactionsByType("expenses");
    const total = expenseTransactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0
    );
    return { transactions: expenseTransactions, total };
  });

  const getTransactions = async (filter: iFilter = { sort: false }) => {
    if (!user.value) return;

    loading.value = true;
    try {
      const { data, error } = await supabaseClient
        .from("transactions")
        .select(
          `id,
              created_at,
              amount,
              notes,
              categories!inner(name, type)`
        )
        .order("created_at", { ascending: filter.sort });

      if (error) throw error;

      transactionsList.value = data || [];
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch transactions";
    } finally {
      loading.value = false;
    }
  };

  const filterTransactionsByType = (type: "income" | "expenses") => {
    return transactionsList.value.filter(
      (item) => item?.categories?.type === type
    );
  };

  return {
    transactions: transactionsList,
    loading: readonly(loading),
    incomeThisMonth,
    expenses,
    balance,
    todayTransactions,
    thisMonthTransactions,
    recentTransactions,
    getTransactions,
  };
});

export { useTransactionsStore };
