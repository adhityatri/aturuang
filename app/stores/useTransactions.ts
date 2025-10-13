import type {
  iSumTransactionByMonth,
  iTransaction,
} from "~/types/transactions";

// interface iFilter {
//   sortDate?: boolean;
//   sortAmount?: boolean;
// }

const useTransactionsStore = defineStore("transactions-store", () => {
  const supabaseClient = useSupabaseClient();
  const transactionsList = ref<iTransaction[]>([]);
  const user = useSupabaseUser();
  const loading = ref<boolean>(false);
  // const error = ref<string | null>(null);
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
      const { created_at, notes, category_type, amount } = transaction;
      if (category_type === "income" && amount) {
        const date = new Date(created_at);
        if (useIsThisMonth(date)) {
          return sum + amount;
        }
      }
      return sum;
    }, 0);
  });

  const expensesThisMonth = computed(() => {
    return transactionsList.value.reduce((sum, transaction) => {
      const { created_at, category_type, amount } = transaction;
      if (category_type === "expenses" && amount) {
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

  // const getTransactions = async (
  //   filter: iFilter = { sortDate: false, sortAmount: false }
  // ) => {
  //   if (!user.value) return;

  //   loading.value = true;
  //   try {
  //     const { data, error } = await supabaseClient
  //       .from("transactions")
  //       .select(
  //         `id,
  //             created_at,
  //             amount,
  //             notes,
  //             categories!inner(name, type)`
  //       )
  //       .order("created_at", { ascending: filter.sortDate });
  //     // .order("amount", {ascending: filter.sortAmount});

  //     if (error) throw error;

  //     transactionsList.value = data || [];
  //   } catch (err) {
  //     error.value =
  //       err instanceof Error ? err.message : "Failed to fetch transactions";
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  const getTransactionsWithCategory = async (params: {
    category_type_filter: string;
  }) => {
    if (!user.value) return;

    try {
      const { data, error } = await supabaseClient.rpc(
        "get_transactions_with_categories",
        {
          category_type_filter: params.category_type_filter,
        }
      );

      if (error) {
        return error;
      }

      transactionsList.value = data || [];
      return data;
    } catch (err) {
      return err;
    }
  };

  const filterTransactionsByType = (type: "income" | "expenses" | "all") => {
    return transactionsList.value.filter(
      (item) => item?.category_type === type
    );
  };

  const groupTransactionsByDate = () => {
    const groups: Record<string, iTransaction[]> = {};

    transactionsList.value.forEach((tx) => {
      const txDate = new Date(tx.created_at);
      const isToday = useIsToday(txDate);
      const isYesterday = useIsYesterday(txDate);

      let key = txDate.toLocaleDateString();
      if (isToday) key = "today";
      else if (isYesterday) key = "yesterday";

      if (!groups[key]) groups[key] = [];
      groups[key]?.push(tx);
    });

    const result = Object.keys(groups).map((key) => ({
      title: key,
      value: groups[key] ?? [],
    }));

    return result;
  };

  const groupedTransactions = computed(() => groupTransactionsByDate());

  const transactionByCategory = ref<[]>([]);
  const getSumTransactionCategory = async () => {
    if (!user.value) return;

    try {
      const { data, error } = await supabaseClient.rpc("get_category_summary");

      if (error) {
        return error;
      }

      transactionByCategory.value = data || [];
      return data;
    } catch (err) {
      return err;
    }
  };

  const transactionByMonth = ref<iSumTransactionByMonth[]>([]);
  const get_transactions_by_month = async () => {
    if (!user.value) return;

    try {
      const { data, error } = await supabaseClient.rpc(
        "monthly_transaction_sums_all"
      );

      if (error) {
        return error;
      }

      const transactions = (data as iSumTransactionByMonth[]) || [];

      transactionByMonth.value = transactions.map(
        (item: iSumTransactionByMonth) => {
          return {
            ...item,
            amountFormatted: useFormatPriceIntl(item.total_amount),
          };
        }
      );

      return data;
    } catch (err) {
      return err;
    }
  };

  const addTransactions = async (transactionData: {
    wallet_id: string;
    category_id: number;
    amount: number;
    notes?: string;
  }) => {
    if (!user.value) {
      throw new Error("User must be logged in");
    }

    try {
      const { data, error } = await supabaseClient.rpc(
        "insert_transaction_and_update_wallet",
        {
          p_user_id: user.value.id,
          p_wallet_id: transactionData.wallet_id,
          p_category_id: transactionData.category_id,
          p_amount: transactionData.amount,
          p_notes: transactionData.notes || null,
        }
      );

      if (error) throw error;

      return {
        success: true,
        transactionId: data,
        message: "Transaction added successfully",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
        message: "Failed to add transaction",
      };
    }
  };

  return {
    transactions: transactionsList,
    loading: readonly(loading),
    income,
    expenses,
    incomeThisMonth,
    expensesThisMonth,
    balance,
    todayTransactions,
    thisMonthTransactions,
    recentTransactions,
    groupedTransactions,
    transactionByCategory,
    transactionByMonth,
    // getTransactions,
    getSumTransactionCategory,
    get_transactions_by_month,
    getTransactionsWithCategory,
    addTransactions
  };
});

export { useTransactionsStore };
