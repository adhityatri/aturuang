<template>
  <div class="flex flex-1 flex-col gap-4 py-4">
    <app-greeting />

    <summary-card :current-balance="currentBalance" :income="incomeThisMonth" :expenses="expenses.total" class="mb-6" />
    <transactions-list :source="todayTransactions" title="Riwayat Transaksi"/>
  </div>
</template>

<script setup lang="ts">
import type { iTransaction } from '~/types/transactions';

definePageMeta({
  name: 'homepage',
});

const supabase = useSupabaseClient();
const { data: transactions } = await supabase.from('transactions')
  .select(`id,
        created_at,
        amount,
        notes,
        categories!inner(name, type)`)
  .order('created_at', { ascending: false }) as { data: iTransaction[] };

const calculateTotals = (type: 'income' | 'expenses') => {
  const filtered = transactions?.filter(item => item?.categories.type === type) || [];
  const total = filtered.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
  return { transactions: filtered, total };
};

const todayTransactions = computed(() => {
  const today = new Date();
  return (
    transactions
      ?.filter(item => {
        const transactionDate = new Date(item.created_at);
        return (
          transactionDate.getFullYear() === today.getFullYear() &&
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getDate() === today.getDate()
        );
      })
      .slice(0, 5) || []
  );
});

const income = computed(() => calculateTotals('income'));
const expenses = computed(() => calculateTotals('expenses'));
const incomeThisMonth = computed(() => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  return (
    transactions
      ?.filter(item => {
        const date = new Date(item.created_at);
        return (
          item?.categories.type === 'income' &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce((sum, transaction) => sum + (transaction.amount || 0), 0) || 0
  );
});

const currentBalance = computed(() => {
  return income.value.total - expenses.value.total;
});
</script>

