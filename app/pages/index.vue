<template>
    <div class="flex flex-1 flex-col p-6 pb-30 main-bg text-white">
        <div class="mb-8 flex justify-between items-end">
            <app-greeting :is-loading="isLoading" />
            <app-hide-show-currency />
        </div>

        <summary-card
            :is-loading="walletStore.isFetching"
            :current-balance="walletBalance"
            :income="totalIncomes"
            :expenses="totalExpenses"
            :reset-date="budgetResetDate"
            :budget="budgetAmount"
            class="mb-10"
            @submit-budget="handleSubmitBudget"
        />

        <app-menu-widget />

        <wallet-list class="py-5" :is-loading="isLoading" />

        <transactions-list
            :source="transactionsSource"
            :is-loading="isLoading"
            class="rounded-lg"
        />
    </div>
</template>

<script setup lang="ts">
import type { RealtimeChannel } from "@supabase/supabase-js";

definePageMeta({ name: "homepage", middleware: ["budget-detect"] });

const supabaseClient = useSupabaseClient();
const transactionStore = useTransactionsStore();
const walletStore = useWallets();
const budgetStore = useBudgets();
const { isDesktop } = useDevice();

let realtimeChannel: RealtimeChannel | null = null;

const transactionsAsync = useLazyAsyncData<Transaction[]>(
    "transactions:all",
    () => transactionStore.getTransactionsWithCategory({ category_type_filter: "all" }),
    { default: () => [], server: false },
);

const walletsAsync = useLazyAsyncData<Wallet[]>("wallets", () => walletStore.getWallets(), {
    default: () => [],
});

const { status: statusTransactions } = transactionsAsync;
const { status: statusWallets } = walletsAsync;

const isLoading = computed(
    () => statusTransactions.value === "pending" || statusWallets.value === "pending",
);

const walletBalance = computed(() =>
    (walletStore.wallets ?? []).reduce((acc, wallet) => acc + Number(wallet.amount ?? 0), 0),
);

const totalIncomes = computed(() => transactionStore.monthlySummary?.totalIncomes ?? 0);
const totalExpenses = computed(() => transactionStore.monthlySummary?.totalExpenses ?? 0);

const firstBudget = computed(() => budgetStore.budgets?.[0] ?? null);
const budgetAmount = computed(() => firstBudget.value?.amount ?? 0);
const budgetResetDate = computed(() => firstBudget.value?.monthly_start ?? "1");

const transactionsSource = computed(() => {
    const today = transactionStore.todayTransactions ?? [];
    return today.length > 0 ? today : (transactionStore.recentTransactions ?? []);
});

const handleSubmitBudget = async (payload: { amount: number }) => {
    const response = await budgetStore.update(payload);
    if (response?.error) return;

    budgetStore.isBudgetOpen = false;
};

onMounted(() => {
    if (isDesktop) return;

    realtimeChannel = supabaseClient
        .channel("public:transactions")
        .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () =>
            transactionStore.getTransactionsWithCategory({ category_type_filter: "all" }),
        )
        .subscribe();

    walletStore.initialize();
});

onUnmounted(() => {
    if (isDesktop) return;

    if (realtimeChannel) supabaseClient.removeChannel(realtimeChannel);
    walletStore.teardownRealtime();
});
</script>
