<template>
    <div class="flex flex-1 flex-col p-6 pb-14 bg-[#1e1e1e] text-white">
        <div class="mb-8">
            <!-- <p class="text-[12px] font-medium uppercase tracking-[0.2em] mb-2">
                {{ currentDate }}
            </p> -->
            <div class="flex justify-between items-end">
                <app-greeting :is-loading="isLoading" />
                <app-hide-show-currency />
            </div>
        </div>

        <summary-card
            :is-loading="isLoading"
            :current-balance="walletBalance"
            :income="totalIncomes"
            :expenses="totalExpenses"
            :reset-date="budgetResetDate"
            :budget="budgetAmount"
            class="mb-10"
            @submit-budget="handleSubmitBudget"
        />

        <transactions-list
            :source="transactionsSource"
            :is-loading="isLoading"
            class="rounded-lg"
        />

        <div class="my-10">
            <wallet-list :is-loading="isLoading" />
        </div>
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

const currentDate = computed(() => {
    return new Date()
        .toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        .toUpperCase();
});

let realtimeChannel: RealtimeChannel | null = null;
let walletRealtimeChannel: RealtimeChannel | null = null;

const { status: statusTransactions } = await useAsyncData(
    "transactions-data",
    () =>
        transactionStore
            .getTransactionsWithCategory({ category_type_filter: "all" })
            .then((result) => (Array.isArray(result) ? result : []))
            .catch(() => []),
    { default: () => [], lazy: true, dedupe: "defer", server: true },
);

await useAsyncData("wallets-data", () => walletStore.getWallets(), {
    lazy: true,
    dedupe: "defer",
    server: true,
});

const walletBalance = computed(() =>
    walletStore.wallets.reduce((acc, wallet) => acc + wallet.amount, 0),
);

const totalIncomes = computed(() => transactionStore.monthlySummary.totalIncomes ?? 0);
const totalExpenses = computed(() => transactionStore.monthlySummary.totalExpenses ?? 0);

const firstBudget = computed(() => budgetStore.budgets?.[0]);
const budgetAmount = computed(() => firstBudget.value?.amount ?? 0);
const budgetResetDate = computed(() => firstBudget.value?.monthly_start ?? "1");

const transactionsSource = computed(() =>
    transactionStore.todayTransactions.length > 0
        ? transactionStore.todayTransactions
        : transactionStore.recentTransactions,
);

const isLoading = computed(() => statusTransactions.value !== "success");

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

    walletRealtimeChannel = supabaseClient
        .channel("public:wallets")
        .on("postgres_changes", { event: "*", schema: "public", table: "wallets" }, () =>
            walletStore.getWallets(),
        )
        .subscribe();
});

onUnmounted(() => {
    if (isDesktop) return;

    if (realtimeChannel) supabaseClient.removeChannel(realtimeChannel);
    if (walletRealtimeChannel) supabaseClient.removeChannel(walletRealtimeChannel);
});
</script>
