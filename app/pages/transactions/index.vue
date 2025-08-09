<template>
  <div>
    <transactions-list :source="transactions" title="Riwayat Transaksi" is-all/>
  </div>
</template>

<script setup lang="ts">
import type { iTransaction } from '~/types/transactions';

  const supabase = useSupabaseClient();
  const {data: transactions, refresh: refreshTransactions } = await useAsyncData('transactions', async () => {
  const { data, error } = await supabase.from('transactions')
    .select(`id,
          created_at,
          amount,
          notes,
          categories!inner(name, type)`)  
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
  return data as iTransaction[];
});

</script>