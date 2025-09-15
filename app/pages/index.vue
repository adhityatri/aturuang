<template>
  <div v-if="isDesktop" class="bg-white flex-1 flex flex-col items-center justify-center">
    <mobile-only />
  </div>
  <div v-else class="flex flex-1 flex-col p-4">
    <app-greeting />
    <summary-card 
      :current-balance="transactionStore.balance" 
      :income="transactionStore.incomeThisMonth"
      :expenses="transactionStore.expensesThisMonth" 
      class="my-6" />

    <transactions-list
      :source="transactionStore.todayTransactions.length > 0 ? transactionStore.todayTransactions : transactionStore.recentTransactions"
      class="rounded-lg" title="Riwayat Transaksi" />
  </div>
</template>

<script setup lang="ts">
import type { RealtimeChannel } from "@supabase/supabase-js";
const { isDesktop } = useDevice();

definePageMeta({
  name: "homepage",
});

const supabaseClient = useSupabaseClient();
const transactionStore = useTransactionsStore()
let realtimeChannel: RealtimeChannel;

const { refresh: refreshTransactions } = await useAsyncData('transactions-data', async () => {
  try {
    const result = await transactionStore.getTransactionsWithCategory({
      category_type_filter: 'all'
    });
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return []; // Always return a consistent type
  }
}, {
  default: () => [],
  lazy: true,
  dedupe: 'defer',
  server: true
}
);

// // Lifecycle hooks
onMounted(() => {
  if (!isDesktop) {
    realtimeChannel = supabaseClient
      .channel("public:transactions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => refreshTransactions()
      );

    realtimeChannel.subscribe();
  }
});

onUnmounted(() => {
  if (realtimeChannel && !isDesktop) {
    supabaseClient.removeChannel(realtimeChannel);
  }
});
</script>
