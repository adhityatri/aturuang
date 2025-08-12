<template>
  <div class="flex flex-1 flex-col py-4">
    <app-greeting />
    <summary-card
      :current-balance="currentBalance"
      :income="incomeThisMonth"
      :expenses="expenses.total"
      class="my-6"
    />
    <transactions-list
      :source="todayTransactions.length > 0 ? todayTransactions : displayTransactions"
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

const TRANSACTION_LIMIT = 5;

const supabase = useSupabaseClient();
let realtimeChannel: RealtimeChannel;

const { data: transactions, refresh: refreshTransactions } = await useAsyncData(
  "transactions",
  () => useTransactions().getTransactions(),
  {
    default: () => [],
    server: true,
  }
);

const filterTransactionsByType = (type: "income" | "expenses") => {
  return transactions.value.filter(item => item?.categories?.type === type);
};

const income = computed(() => {
  const incomeTransactions = filterTransactionsByType("income");
  const total = incomeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  return { transactions: incomeTransactions, total };
});

const expenses = computed(() => {
  const expenseTransactions = filterTransactionsByType("expenses");
  const total = expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  return { transactions: expenseTransactions, total };
});

const incomeThisMonth = computed(() => {
  return transactions.value.reduce((sum, transaction) => {
    const { created_at, categories, amount } = transaction;
    if (categories?.type === "income" && amount) {
      const date = new Date(created_at);
      if (useIsThisMonth(date)) {
        return sum + amount;
      }
    }
    return sum;
  }, 0);
});

const currentBalance = computed(() => {
  return income.value.total - expenses.value.total;
});

const todayTransactions = computed(() => {
  return transactions.value
    .filter(item => useIsToday(new Date(item.created_at)))
    .slice(0, TRANSACTION_LIMIT);
});

const recentTransactions = computed(() => {
  return transactions.value.slice(0, TRANSACTION_LIMIT);
});

const displayTransactions = computed(() => {
  return todayTransactions.value.length > 0 
    ? todayTransactions.value 
    : recentTransactions.value;
});

// Lifecycle hooks
onMounted(() => {
  // Setup realtime subscription
  realtimeChannel = supabase
    .channel("public:transactions")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "transactions" },
      () => {
        // Debounce refresh to prevent excessive API calls
        nextTick(() => refreshTransactions());
      }
    );

  realtimeChannel.subscribe();
});

onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
  }
});
</script>
