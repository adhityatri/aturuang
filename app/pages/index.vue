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
      :source="todayTransactions.length > 0 ? todayTransactions : transactionList"
      class="rounded-3xl"
      title="Riwayat Transaksi"
    />
    <!-- <transactions-list :source="transactionList" title="Riwayat Transaksi"/> -->
  </div>
</template>

<script setup lang="ts">
import type { RealtimeChannel } from "@supabase/supabase-js";

definePageMeta({
  name: "homepage",
});

const supabase = useSupabaseClient();
let realtimeChannel: RealtimeChannel;

const { data: transactions, refresh: refreshTransactions } = await useAsyncData(
  "transactions",
  async () => {
    return useTransactions().getTransactions();
  }
);

onMounted(() => {
  // Real time listener for new workouts
  realtimeChannel = supabase
    .channel("public:transactions")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "transactions" },
      () => refreshTransactions()
    );

  realtimeChannel.subscribe();
});

onUnmounted(() => {
  supabase.removeChannel(realtimeChannel);
});

const calculateTotals = (type: "income" | "expenses") => {
  const filtered =
    transactions.value?.filter((item) => item?.categories.type === type) || [];
  const total = filtered.reduce(
    (sum, transaction) => sum + (transaction.amount || 0),
    0
  );
  return { transactions: filtered, total };
};

const limit = 5;
// const copyTransactions = ref(transactions.value || []);
const transactionList = computed(() => {
  return transactions.value?.slice(0, limit);
});
const todayTransactions = computed(() => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const transactionsToday = [];
  const allTransactions = transactions.value || [];

  for (const item of allTransactions) {
    if (transactionsToday.length >= limit) {
      break;
    }

    const transactionDate = new Date(item.created_at);
    if (
      transactionDate.getFullYear() === currentYear &&
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getDate() === currentDay
    ) {
      transactionsToday.push(item);
    }
  }

  return transactionsToday;
});

const income = computed(() => calculateTotals("income"));
const expenses = computed(() => calculateTotals("expenses"));
const incomeThisMonth = computed(() => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  return (
    transactions.value?.reduce((sum, transaction) => {
      const { created_at, categories, amount } = transaction;
      if (categories?.type === "income" && amount) {
        const date = new Date(created_at);
        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        ) {
          return sum + amount;
        }
      }
      return sum;
    }, 0) || 0
  );
});

const currentBalance = computed(() => {
  return income.value.total - expenses.value.total;
});
</script>
