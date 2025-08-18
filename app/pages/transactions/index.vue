<template>
  <div class="flex flex-1 flex-col gap-4 pt-8">
<!--    <transactions-filter/>-->
<!--    <transactions-diagram/>-->

<!--    <pre>{{ transactionStore.transactionByCategory}}</pre>-->

    <div class="rounded-lg">
      <transactions-grouped-list
          :source="transactionStore.groupedTransactions"
          title="Riwayat Transaksi"
          is-all
          class="ring-0 shadow-none bg-unset"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

const transactionStore = useTransactionsStore();
await callOnce('transactions-data', () => transactionStore.getTransactions(), {
  mode: 'navigation'
})

// await callOnce('sub-transactions-data', () => transactionStore.getSumTransactionCategory(), {
//   mode: 'navigation'
// })
</script>
