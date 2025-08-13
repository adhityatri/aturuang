<template>
  <div class="flex flex-1 flex-col py-4">
    <app-greeting />
    <summary-card
      :current-balance="transactionStore.balance"
      :income="transactionStore.incomeThisMonth"
      :expenses="transactionStore.expenses?.total"
      class="my-6"
    />

    <button @click="refreshTransactions()">Execute</button>

    <transactions-list
      :source="transactionStore.todayTransactions.length > 0 ? transactionStore.todayTransactions : transactionStore.recentTransactions"
      class="rounded-lg"
      title="Riwayat Transaksi"
    />
  </div>
</template>

<script setup lang="ts">
import type { RealtimeChannel } from "@supabase/supabase-js";

definePageMeta({
  name: "homepage",
});

const supabaseClient = useSupabaseClient();
let realtimeChannel: RealtimeChannel;

const transactionStore = useTransactionsStore()

const {refresh: refreshTransactions} = await useAsyncData('transactions-data', () => transactionStore.getTransactions(), {
  lazy: true,
  dedupe: 'defer',
  server: true
});

// Lifecycle hooks
onMounted(() => {
  realtimeChannel = supabaseClient
    .channel("public:transactions")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "transactions" },
      () => refreshTransactions()
    );

  realtimeChannel.subscribe();
});

onUnmounted(() => {
  if (realtimeChannel) {
    supabaseClient.removeChannel(realtimeChannel);
  }
});
</script>
