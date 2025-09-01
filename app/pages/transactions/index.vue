<template>
  <div class="flex flex-1 flex-col gap-4 pt-8">
    <!-- <transactions-filter/> -->
     <div class="relative overflow-hidden ring-1 ring-neutral-300 rounded-lg shadow-lg">
       <transactions-charts :sources="transactionStore.transactionByMonth"/>
     </div>

    <!-- <UCard class="bg-white shadow-md">
      <template #header>
        <div class="flex items-center justify-between">
          <span>Incomes</span>
        </div>
      </template>
    </UCard> -->

    <div class="rounded-lg">
      <transactions-grouped-list :source="transactionStore.groupedTransactions" title="Riwayat Transaksi" is-all
        class="ring-0 shadow-none bg-unset" />
    </div>
  </div>
</template>

<script setup lang="ts">

const transactionStore = useTransactionsStore();
await callOnce('transactions-data', () => transactionStore.getTransactions(), {
  mode: 'navigation'
})

await callOnce('sub-transactions-data', () => transactionStore.getSumTransactionCategory(), {
  mode: 'navigation'
})

await callOnce('transactions-by-month', () => transactionStore.get_transactions_by_month(), {
  mode: 'navigation'
})

const incomeCategory = computed(() => {
  const filteredIncome = transactionStore.transactionByCategory.filter((item: { category_type: string }) => item.category_type === 'income')
  const totalIncome = filteredIncome.reduce((sum: number, item: { total_amount: number}) => sum + (item.total_amount || 0), 0)
  return { categories: filteredIncome, total: totalIncome }
})
const expensesCategory = computed(() => {
  const filteredExpenses = transactionStore.transactionByCategory.filter((item: { category_type: string }) => item.category_type === 'expenses')
  const totalExpenses = filteredExpenses.reduce((sum: number, item: { total_amount: number}) => sum + (item.total_amount || 0), 0)
  return { categories: filteredExpenses, total: totalExpenses }
})
</script>
