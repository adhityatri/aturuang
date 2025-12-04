<template>
  <div class="flex flex-1 flex-col p-4 pb-14">
    <div class="flex justify-between items-start pt-[2em]">
      <app-greeting :is-loading="isLoading" />
      <app-hide-show-currency />
    </div>

    <summary-card
      :is-loading="isLoading"
      :current-balance="walletBalance"
      :income="transactionStore.monthlySummary.totalIncomes || 0"
      :expenses="transactionStore.monthlySummary.totalExpenses || 0"
      :reset-date="budgetStore.budgets?.[0]?.monthly_start"
      class="my-6"
    />

    <wallet-list :is-loading="isLoading" />

    <!-- <money-tracker-budget
      :is-loading="isLoading"
      :budget="budgetStore.budgets?.[0]?.amount || 0"
      :reset-date="budgetStore.budgets?.[0]?.monthly_start || '1'"
      :expenses="transactionStore.monthlySummary.totalExpenses || 0"
      :is-open="budgetStore.isBudgetOpen"
      @submit="handleSubmitBudget"
    /> -->

    <transactions-list
      :source="
        transactionStore.todayTransactions.length > 0
          ? transactionStore.todayTransactions
          : transactionStore.recentTransactions
      "
      :is-loading="isLoading"
      class="rounded-lg mt-4"
      title="Riwayat Transaksi"
    />
  </div>
</template>

<script setup lang="ts">
import type { RealtimeChannel } from "@supabase/supabase-js";
const { isDesktop } = useDevice();

definePageMeta({
  name: "homepage",
  // middleware: ["budget-detect"],
});

const supabaseClient = useSupabaseClient();
const transactionStore = useTransactionsStore();
const walletStore = useWallets();
const budgetStore = useBudgets();

let realtimeChannel: RealtimeChannel;
let walletRealtimeChannel: RealtimeChannel;

const { refresh: refreshTransactions, status: statusTransactions } =
  useAsyncData(
    "transactions-data",
    async () => {
      try {
        const result = await transactionStore.getTransactionsWithCategory({
          category_type_filter: "all",
          // page_limit: 5
        });
        return Array?.isArray(result) ? result : [];
      } catch (error) {
        useToast().add({
          title: "Error",
          description: "Gagal mengambil data transaksi : " + error,
          color: "error",
        });
        return []; // Always return a consistent type
      }
    },
    {
      default: () => [],
      lazy: true,
      dedupe: "defer",
      server: true,
    }
  );

const { refresh: refreshWallets, status: statusWallet } = await useAsyncData(
  "wallets-data",
  () => walletStore.getWallets(),
  {
    lazy: true,
    dedupe: "defer",
    server: true,
  }
);

const walletBalance = computed(() => {
  return (
    walletStore.wallets.reduce((acc, wallet) => acc + wallet.amount, 0) ?? 0
  );
});

const isLoading = computed(
  () =>
    statusTransactions.value !== "success" && statusWallet.value !== "success"
);

const handleSubmitBudget = async (payload: any) => {
  const response: any = await budgetStore.update(payload);
  if (response.error) {
    return;
  }

  budgetStore.isBudgetOpen = false;
};

onMounted(() => {
  if (!isDesktop) {
    realtimeChannel = supabaseClient
      .channel("public:transactions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => refreshTransactions()
      );

    walletRealtimeChannel = supabaseClient
      .channel("public:wallets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallets" },
        () => refreshWallets()
      );

    realtimeChannel.subscribe();
    walletRealtimeChannel.subscribe();
  }
});

onUnmounted(() => {
  if (realtimeChannel && !isDesktop) {
    supabaseClient.removeChannel(realtimeChannel);
    supabaseClient.removeChannel(walletRealtimeChannel);
  }
});
</script>
