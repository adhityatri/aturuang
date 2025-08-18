import type {iTransaction} from "~/types/transactions";

interface iFilter {
    sortDate?: boolean;
    sortAmount?: boolean
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
            const {created_at, categories, amount} = transaction;
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
        return {transactions: incomeTransactions, total};
    });

    const expenses = computed(() => {
        const expenseTransactions = filterTransactionsByType("expenses");
        const total = expenseTransactions.reduce(
            (sum, t) => sum + (t.amount || 0),
            0
        );
        return {transactions: expenseTransactions, total};
    });

    const getTransactions = async (filter: iFilter = {sortDate: false, sortAmount: false}) => {
        if (!user.value) return;

        loading.value = true;
        try {
            const {data, error} = await supabaseClient
                .from("transactions")
                .select(
                    `id,
              created_at,
              amount,
              notes,
              categories!inner(name, type)`
                )
                .order("created_at", {ascending: filter.sortDate})
            // .order("amount", {ascending: filter.sortAmount});

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

    const groupTransactionsByDate = (transactions: iTransaction[]) => {
        const groups: Record<string, iTransaction[]> = {};

        transactionsList.value.forEach((tx) => {
            const txDate = new Date(tx.created_at);
            const isToday = useIsToday(txDate)
            const isYesterday = useIsYesterday(txDate)

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

    const groupedTransactions = computed(() =>
        groupTransactionsByDate(transactionsList.value || [])
    );

    const transactionByCategory = ref<[]>([]);
    const getSumTransactionCategory = async () => {
        if (!user.value) return;

        try {
            const {data, error} = await supabaseClient.rpc('get_category_summary')

            if (error){
                console.log(error)
                return error
            }

            // const result = data.map((item:any) => {
            //     return {
            //         name: item.category_name,
            //         type: item.category_type,
            //         total: item.total_amount
            //     }
            // })
            //
            // console.log('result : ', result)

            transactionByCategory.value = data || []
            return data
        } catch (err) {
            return err
        }
    }

    return {
        transactions: transactionsList,
        loading: readonly(loading),
        incomeThisMonth,
        expenses,
        balance,
        todayTransactions,
        thisMonthTransactions,
        recentTransactions,
        groupedTransactions,
        transactionByCategory,
        getTransactions,
        getSumTransactionCategory
    };
});

export {useTransactionsStore};
