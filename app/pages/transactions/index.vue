<template>
  <div class="flex flex-1 flex-col gap-4 pt-8 bg-primary-900">
    <!-- <transactions-filter/> -->
    <div class="relative overflow-hidden px-4 bg-primary-900 min-h-[200px]">
      <transactions-charts :sources="transactionStore.transactionByMonth" />
    </div>

    <div class="rounded-tl-2xl rounded-tr-2xl bg-white flex flex-1 overflow-auto">
      <transactions-tab :source="transactionStore.groupedTransactions" :incomes="income" :expenses="expenses"
        class="pt-4" />
    </div>
  </div>
</template>

<script setup lang="ts">

useHead({
  bodyAttrs: {
    class: ''
  },
  title: 'Transaksi'
})

const transactionStore = useTransactionsStore();
await callOnce('transactions-data', () => transactionStore.getTransactionsWithCategory({
  category_type_filter: 'all'
}), {
  mode: 'navigation'
})


await callOnce('transactions-by-month', () => transactionStore.get_transactions_by_month(), {
  mode: 'navigation'
})

const income = useFilterByCategory(transactionStore.groupedTransactions, 'income');
const expenses = useFilterByCategory(transactionStore.groupedTransactions, 'expenses');
</script>
