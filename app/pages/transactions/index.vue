<template>
  <div class="flex flex-col gap-4 pt-8">
    <transactions-filter />
    <transactions-diagram />

    <transactions-grouped-list
      :source="groupedTransactions"
      title="Riwayat Transaksi"
      is-all
      class="ring-0 shadow-none bg-unset"
    />
  </div>
</template>

<script setup lang="ts">
import type { iTransaction } from "~/types/transactions";
const transactionStore = useTransactionsStore();
await callOnce('transactions-data', () => transactionStore.getTransactions(), {
  mode: 'navigation'
})

const groupTransactionsByDate = (transactions: iTransaction[]) => {
  const groups: Record<string, iTransaction[]> = {};

  transactions.forEach((tx) => {
    const txDate = new Date(tx.created_at);
    const isToday = useIsToday(txDate)
    const isYesterday = useIsYesterday(txDate)

    let key = txDate.toLocaleDateString();
    if (isToday) key = "today";
    else if (isYesterday) key = "yesterday";

    if (!groups[key]) groups[key] = [];
    groups[key]?.push(tx);
  });

  const result = Object.keys(groups).map((key) => ({
    title: key,
    value: groups[key] ?? [],
  }));

  return result;
};

const groupedTransactions = computed(() =>
  groupTransactionsByDate(transactionStore.transactions || [])
);
</script>
