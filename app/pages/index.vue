<template>
  <div class="flex flex-1 flex-col gap-4 py-4">
    <app-greeting />
    <summary-card :current-balance="income.total" :income="income.total" :expenses="expenses.total" class="mb-6" />
    <transactions-list :source="transactions" title="Riwayat Transaksi"/>
  </div>
</template>

<script setup lang="ts">
import type { iTransaction } from '~/types/transactions';

definePageMeta({
  name: 'homepage'
});
const supabase = useSupabaseClient();
// const { data: categories } = await supabase
//   .from('categories')
//   .select('*')
//   .order('created_at', { ascending: false })
  

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

const income = computed(() => calculateTotals('income'));
const expenses = computed(() => calculateTotals('expenses'));
</script>

