<template>
  <div>
    <transactions-grouped-list
      :source="groupedTransactions"
      title="Riwayat Transaksi"
      is-all
    />
  </div>
</template>

<script setup lang="ts">
import type { iTransaction } from "~/types/transactions";

const supabase = useSupabaseClient();
const { data: transactions } = await useAsyncData(
  "transactions",
  async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `id,
          created_at,
          amount,
          notes,
          categories!inner(name, type)`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
    return data as iTransaction[];
  }
);

const groupTransactionsByDate = (transactions: iTransaction[]) => {
  const groups: Record<string, iTransaction[]> = {};
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  transactions.forEach(tx => {
    const txDate = new Date(tx.created_at);
    const isToday =
      txDate.getFullYear() === today.getFullYear() &&
      txDate.getMonth() === today.getMonth() &&
      txDate.getDate() === today.getDate();

    const isYesterday =
      txDate.getFullYear() === yesterday.getFullYear() &&
      txDate.getMonth() === yesterday.getMonth() &&
      txDate.getDate() === yesterday.getDate();

    let key = txDate.toLocaleDateString();
    if (isToday) key = 'today';
    else if (isYesterday) key = 'yesterday';

    if (!groups[key]) groups[key] = [];
    groups[key]?.push(tx);
  });

  const result = Object.keys(groups).map(key => ({
    title: key,
    value: groups[key] ?? [],
  }));

  return result;
}

// Usage example:
const groupedTransactions = computed(() =>
  groupTransactionsByDate(transactions.value || [])
);
</script>
