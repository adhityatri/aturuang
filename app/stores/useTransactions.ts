import type { aiReceiptResponse, iSumTransactionByMonth, iTransaction } from "~/types/transactions";

// Kategori pemindahan dana antar dompet (lihat app/components/wallet/Move.vue).
// Tidak boleh dihitung sebagai pemasukan/pengeluaran.
const TRANSFER_CATEGORY_IDS = [23, 24];

const useTransactionsStore = defineStore("transactions-store", () => {
  const supabaseClient = useSupabaseClient();
  const user = useSupabaseUser();

  const transactionsList = ref<iTransaction[]>([]);
  const currentMonthData = ref<iTransaction[]>([]);
  const previousMonthData = ref<iTransaction[]>([]);
  const summaryTransactions = ref<iTransaction[]>([]);
  const loading = ref(false);
  const transaction_limit = ref(5);
  const transactionByCategory = ref<any[]>([]);
  const transactionByMonth = ref<iSumTransactionByMonth[]>([]);
  const transactionDetail = ref<iTransaction | null>(null);
  const walletTransactions = ref<any[]>([]);
  const aiResponse = ref<aiReceiptResponse>();
  const aiLoading = ref(false);
  const isCreateOpen = ref(false);

  // Helper: transaksi pemindahan dana antar dompet tidak dihitung sebagai income/expenses
  const isTransfer = (transaction: iTransaction) =>
    TRANSFER_CATEGORY_IDS.includes(transaction.category_id ?? 0);

  // Helper: Filter by type
  const filterByType = (type: string) =>
    transactionsList.value.filter((t) => t.category_type === type);

  // Base totals
  const income = computed(() => {
    const data = filterByType("income");
    return { transactions: data, total: data.reduce((s, t) => s + (t.amount || 0), 0) };
  });

  const expenses = computed(() => {
    const data = filterByType("expenses");
    return { transactions: data, total: data.reduce((s, t) => s + (t.amount || 0), 0) };
  });

  const balance = computed(() => income.value.total - expenses.value.total);

  const monthlyStartDay = computed(() => {
    const raw = useBudgets().budgets?.[0]?.monthly_start;
    if (!raw) return 1;

    const asNumber = Number(raw);
    if (Number.isInteger(asNumber) && asNumber >= 1 && asNumber <= 31) return asNumber;

    const asDate = new Date(raw);
    return isNaN(asDate.getTime()) ? 1 : asDate.getDate();
  });

  const currentPeriod = computed(() => {
    const { startDate, endDate } = useMonthlyStart(monthlyStartDay.value);
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    // Fallback ke bulan kalender berjalan kalau periode gagal dihitung
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      const now = new Date();
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      };
    }

    return { start, end };
  });

  // Geser tanggal sebanyak `delta` bulan dengan clamp jumlah hari
  // (mis. 31 Mar digeser ke Februari jadi 28/29 Feb, bukan 3 Mar).
  const shiftMonthClamped = (date: Date, delta: number) => {
    const target = new Date(date.getFullYear(), date.getMonth() + delta, 1);
    const daysInTarget = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();

    return new Date(
      target.getFullYear(),
      target.getMonth(),
      Math.min(date.getDate(), daysInTarget),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    );
  };

  // Periode tepat sebelum periode berjalan (monthly_start aware)
  const previousPeriod = computed(() => {
    const { start } = currentPeriod.value;

    return { start: shiftMonthClamped(start, -1), end: new Date(start.getTime() - 1) };
  });

  // Monthly breakdown
  const monthlySummary = computed(() => {
    const { start, end } = currentPeriod.value;

    const filteredData = currentMonthData.value.filter((t) => {
      const d = new Date(t.created_at);
      if (isNaN(d.getTime())) return false;

      return d >= start && d <= end && !isTransfer(t);
    });

    return filteredData.reduce(
      (acc, t) => {
        const amount = Number(t.amount) || 0;
        if (t.category_type === "expenses") acc.totalExpenses += amount;
        else if (t.category_type === "income") acc.totalIncomes += amount;
        return acc;
      },
      { filteredData, totalExpenses: 0, totalIncomes: 0 },
    );
  });

  const totalIncomes = computed(() => monthlySummary.value.totalIncomes);
  const totalExpenses = computed(() => monthlySummary.value.totalExpenses);

  // Quick lists
  const recentTransactions = computed(() =>
    transactionsList.value.slice(0, transaction_limit.value),
  );

  const todayTransactions = computed(() =>
    transactionsList.value
      .filter((t) => useIsToday(new Date(t.created_at)))
      .slice(0, transaction_limit.value),
  );

  // Grouping logic
  const groupTransactionsByDate = (source: iTransaction[]) => {
    const groups = source.reduce(
      (acc, tx) => {
        const d = new Date(tx.created_at);
        if (isNaN(d.getTime())) return acc;

        const key = useIsToday(d)
          ? "today"
          : useIsYesterday(d)
            ? "yesterday"
            : d.toLocaleDateString();
        (acc[key] ||= []).push(tx);
        return acc;
      },
      {} as Record<string, iTransaction[]>,
    );

    return Object.entries(groups)
      .map(([title, value]) => ({ title, value }))
      .sort((a, b) => {
        if (a.title === "today") return -1;
        if (b.title === "today") return 1;
        const timeA = a.title === "yesterday" ? Date.now() - 86400000 : new Date(a.title).getTime();
        const timeB = b.title === "yesterday" ? Date.now() - 86400000 : new Date(b.title).getTime();
        return timeB - timeA;
      });
  };

  const groupedTransactions = computed(() => groupTransactionsByDate(transactionsList.value));

  // Data periode sebelumnya (sumber untuk perbandingan bulan lalu)
  const lastMonthTransactions = computed(() =>
    previousMonthData.value.filter((t) => {
      const d = new Date(t.created_at);
      if (isNaN(d.getTime())) return false;

      const { start, end } = previousPeriod.value;
      return d >= start && d <= end && !isTransfer(t);
    }),
  );

  const lastMonthExpenses = computed(() =>
    lastMonthTransactions.value
      .filter((t) => t.category_type === "expenses")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
  );

  // Actions
  const getTransactionsWithCategory = async (params: {
    category_type_filter: string;
    page_limit?: number;
  }) => {
    if (!user.value) return;
    try {
      // gunakan RPC baru: fetch across personal & shared wallets + creator info
      const { data, error } = await supabaseClient.rpc("get_all_transactions_for_user", {
        p_user_id: user.value.id,
        p_category_type_filter: params.category_type_filter,
        ...(params.page_limit && { p_page_limit: params.page_limit }),
      });
      if (error) throw error;

      const transactions = (data || []).sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      transactionsList.value = transactions;

      if (params.category_type_filter === "all") {
        summaryTransactions.value = transactions;
      }

      return { data: transactions };
    } catch (err) {
      return err;
    }
  };

  const getSumTransactionCategory = async () => {
    if (!user.value) return;
    const { data, error } = await supabaseClient.rpc("get_category_summary");
    if (!error) transactionByCategory.value = data || [];
    return data;
  };

  const get_transactions_by_month = async () => {
    if (!user.value) return;
    const { data, error } = await supabaseClient.rpc("monthly_transaction_sums_all");
    if (!error) {
      transactionByMonth.value = (data || []).map((m: any) => ({
        ...m,
        amountFormatted: useFormatPriceIntl(m.total_amount),
      }));
    }
    return data;
  };

  const deleteTransaction = async (id: string) => {
    if (!user.value) return;
    try {
      const { data: tx } = await supabaseClient
        .from("transactions")
        .select("amount, wallet_id, category_id")
        .eq("id", id)
        .single();
      if (!tx) throw new Error("Not found");

      const { data: cat } = await supabaseClient
        .from("categories")
        .select("type")
        .eq("id", tx.category_id)
        .single();
      const { error: delErr } = await supabaseClient.from("transactions").delete().eq("id", id);
      if (delErr) throw delErr;

      if (tx.wallet_id) {
        const { data: w } = await supabaseClient
          .from("wallets")
          .select("amount")
          .eq("id", tx.wallet_id)
          .single();
        if (w) {
          const adj = cat?.type === "expenses" ? tx.amount : -tx.amount;
          await supabaseClient
            .from("wallets")
            .update({ amount: w.amount + adj })
            .eq("id", tx.wallet_id);
        }
      }
      transactionsList.value = transactionsList.value.filter((t) => String(t.id) !== String(id));
      summaryTransactions.value = summaryTransactions.value.filter(
        (t) => String(t.id) !== String(id),
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const fetchTransactionsByPeriod = async (period: { start: Date; end: Date }) => {
    const { data, error } = await supabaseClient
      .from("transactions")
      .select("*, categories(name, type, icon)")
      .gte("created_at", period.start.toISOString())
      .lte("created_at", period.end.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions by period:", error, period);
      return [];
    }

    // Flatten relasi categories agar `category_type`/`category_name` konsisten
    // dengan hasil RPC dan bisa dipakai langsung oleh monthlySummary.
    return (data || []).map((transaction: any) => ({
      ...transaction,
      category_name: transaction.categories?.name ?? transaction.category_name,
      category_type: transaction.categories?.type ?? transaction.category_type,
    })) as iTransaction[];
  };

  const getTransactionsCurrentMonth = async () => {
    if (!user.value) return [];

    currentMonthData.value = await fetchTransactionsByPeriod(currentPeriod.value);
    return currentMonthData.value;
  };

  const getPreviousMonthTransactions = async () => {
    if (!user.value) return [];

    previousMonthData.value = await fetchTransactionsByPeriod(previousPeriod.value);
    return previousMonthData.value;
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
      const { data, error } = await supabaseClient.rpc("insert_transaction_and_update_wallet", {
        p_user_id: user.value.id,
        p_wallet_id: transactionData.wallet_id,
        p_category_id: transactionData.category_id,
        p_amount: transactionData.amount,
        p_notes: transactionData.notes || null,
      });

      if (error) throw error;

      await getTransactionsCurrentMonth();
      await getPreviousMonthTransactions();

      return { success: true, transactionId: data, message: "Transaction added successfully" };
    } catch (err: any) {
      return { success: false, error: err.message, message: "Failed to add transaction" };
    }
  };

  const getTransactionsWithCategoryById = async (id: string) => {
    if (!user.value) return;

    try {
      const { data, error } = await supabaseClient.rpc("get_transactions_by_id", {
        p_transactions_id: id,
      });

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
    return transactionsList.value.filter((item) => item?.category_type === type);
  };

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

  return {
    transactions: transactionsList,
    loading,
    income,
    expenses,
    balance,
    todayTransactions,
    recentTransactions,
    groupedTransactions,
    transactionByCategory,
    transactionByMonth,
    transactionDetail,
    walletTransactions,
    summaryTransactions,
    monthlySummary,
    lastMonthTransactions,
    lastMonthExpenses,
    aiResponse,
    aiLoading,
    isCreateOpen,
    totalIncomes,
    totalExpenses,
    getSumTransactionCategory,
    get_transactions_by_month,
    getTransactionsWithCategory,
    deleteTransaction,
    getTransactionsCurrentMonth,
    getPreviousMonthTransactions,
    addTransactions,
    getTransactionsWithCategoryById,
    getTransactionsByWalletId,
    filterTransactionsByType,
    currentMonthData,
    previousMonthData,
  };
});

export { useTransactionsStore };
