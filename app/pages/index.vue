<template>
  <div class="flex flex-1 flex-col p-4">
    <div class="flex justify-between items-center pt-[2em]">
      <app-greeting :is-loading="isLoading" />
    </div>

    <summary-card
      :is-loading="isLoading"
      :current-balance="walletBalance"
      :income="transactionStore.incomeThisMonth"
      :expenses="transactionStore.expensesThisMonth"
      class="my-6"
    />

    <wallet-list />

    <transactions-list
      :source="
        transactionStore.todayTransactions.length > 0
          ? transactionStore.todayTransactions
          : transactionStore.recentTransactions
      "
      class="rounded-lg"
      title="Riwayat Transaksi"
    />
  </div>
</template>

<script setup lang="ts">
import type { RealtimeChannel } from "@supabase/supabase-js";
const { isDesktop } = useDevice();

definePageMeta({
  name: "homepage",
});

const supabaseClient = useSupabaseClient();
const transactionStore = useTransactionsStore();
const walletStore = useWallets();

let realtimeChannel: RealtimeChannel;
let walletRealtimeChannel: RealtimeChannel;

const { refresh: refreshTransactions, status: statusTransactions } =
  await useAsyncData(
    "transactions-data",
    async () => {
      try {
        const result = await transactionStore.getTransactionsWithCategory({
          category_type_filter: "all",
        });
        return Array.isArray(result) ? result : [];
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
