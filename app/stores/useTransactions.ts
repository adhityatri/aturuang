import type {
  aiReceiptResponse,
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
      const { created_at, category_type, amount } = transaction;
      if (category_type === "income" && amount) {
        const date = new Date(created_at);
        if (useIsThisMonth(date)) {
          return sum + amount;
        }
      }
      return sum;
    }, 0);
  });

  const monthlySummary = computed(() => {
    const { startDate, endDate } = useMonthlyStart();

    const filteredData = transactionsList.value.filter((item) => {
      const itemDate = new Date(item.created_at);
      return (
        itemDate >= new Date(startDate.value) &&
        itemDate <= new Date(endDate.value)
      );
    });

    let totalExpenses = 0;
    let totalIncomes = 0;

    filteredData.forEach((item) => {
      if (item.category_type === "expenses") {
        totalExpenses += item.amount;
      } else if (item.category_type === "income") {
        totalIncomes += item.amount;
      }
    });

    return {
      filteredData,
      totalExpenses,
      totalIncomes,
    };
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

  const getTransactionsWithCategory = async (params: {
    category_type_filter: string;
    page_limit?: number;
  }) => {
    if (!user.value) return;

    const user_id = shallowRef(user.value?.id);

    try {
      const { data, error } = await supabaseClient.rpc(
        "get_transactions_with_categories_and_count",
        {
          category_type_filter: params.category_type_filter,
          p_user_id: user_id.value,
          ...(params.page_limit && { page_limit: params.page_limit }),
        }
      );

      if (error) {
        console.error("Error fetching transactions with categories:", error);
        throw error;
      }

      transactionsList.value = ((data?.data || []) as iTransaction[]).sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return data;
    } catch (err) {
      return err;
    }
  };

  const transactionDetail = ref<iTransaction>();
  const getTransactionsWithCategoryById = async (id: string) => {
    if (!user.value) return;

    try {
      const { data, error } = await supabaseClient.rpc(
        "get_transactions_by_id",
        {
          p_transactions_id: id,
        }
      );

      if (error) {
        console.error("Error fetching transactions with categories:", error);
        throw error;
      }

      transactionDetail.value = data[0] || null;
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

  const groupTransactionsByDate = (source: iTransaction[]) => {
    const groups: Record<string, iTransaction[]> = {};

    for (const tx of source) {
      const txDate = new Date(tx.created_at);

      // Early return for invalid dates
      if (isNaN(txDate.getTime())) {
        console.error(`Invalid date for transaction: ${tx.created_at}`);
        continue;
      }

      // Determine the group key
      let key: string;
      if (useIsToday(txDate)) {
        key = "today";
      } else if (useIsYesterday(txDate)) {
        key = "yesterday";
      } else {
        key = txDate.toLocaleDateString();
      }

      // Initialize group if it doesn't exist and push transaction
      if (!groups[key]) {
        groups[key] = [];
      }
      (groups[key] ||= []).push(tx);
    }

    // Convert to array and sort in one operation
    return Object.entries(groups)
      .map(([title, value]) => ({ title, value }))
      .sort((a, b) => {
        // Handle special cases first
        if (a.title === "today") return -1;
        if (b.title === "today") return 1;
        if (a.title === "yesterday") return -1;
        if (b.title === "yesterday") return 1;

        // Compare dates for other cases
        const dateA = new Date(a.title).getTime();
        const dateB = new Date(b.title).getTime();

        // Sort descending (newest first)
        return dateB - dateA;
      });
  };

  const groupedTransactions = computed(() =>
    groupTransactionsByDate(transactionsList.value)
  );

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

  const walletTransactions = ref<ReturnType<typeof groupTransactionsByDate>>(
    []
  );

  const getTransactionsByWalletId = async (walletId: string) => {
    if (!user.value) return;

    try {
      const { data, error } = await supabaseClient
        .from("transactions")
        .select("*, categories(type)")
        .eq("wallet_id", walletId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const result = groupTransactionsByDate(data || []);
      walletTransactions.value = result || [];
      return result;
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
        message: "Failed to get transactions by wallet id",
      };
    }
  };

  const aiResponse = ref<aiReceiptResponse>();
  const aiLoading = ref<boolean>(false);

  const isCreateOpen = ref<boolean>(false);

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
    transactionDetail,
    walletTransactions,
    monthlySummary,
    aiResponse,
    aiLoading,
    isCreateOpen,
    getSumTransactionCategory,
    get_transactions_by_month,
    getTransactionsWithCategory,
    addTransactions,
    getTransactionsWithCategoryById,
    getTransactionsByWalletId,
  };
});

export { useTransactionsStore };
