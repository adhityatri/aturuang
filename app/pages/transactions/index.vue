<template>
  <div class="flex flex-1 flex-col gap-4 pt-8 bg-primary-900">
    <!-- <transactions-filter/> -->
    <div class="relative overflow-hidden px-4 bg-primary-900 min-h-[200px]">
      <transactions-charts :sources="transactionStore.transactionByMonth" />
    </div>

    <div class="rounded-tl-2xl rounded-tr-2xl bg-white flex-1">
      <transactions-tab :source="transactionStore.groupedTransactions"
        :incomes="{ categories: transactionStore.income.transactions, total: transactionStore.income.total }"
        :expenses="expensesCategory" class="pt-4" />
    </div>
  </div>
</template>

<script setup lang="ts">

const transactionStore = useTransactionsStore();
await callOnce('transactions-data', () => transactionStore.getTransactionsWithCategory({
  category_type_filter: 'all'
}), {
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
  const totalIncome = filteredIncome.reduce((sum: number, item: { total_amount: number }) => sum + (item.total_amount || 0), 0)
  return { categories: filteredIncome, total: totalIncome }
})
const expensesCategory = computed(() => {
  const filteredExpenses = transactionStore.transactionByCategory.filter((item: { category_type: string }) => item.category_type === 'expenses')
  const totalExpenses = filteredExpenses.reduce((sum: number, item: { total_amount: number }) => sum + (item.total_amount || 0), 0)
  return { categories: filteredExpenses, total: totalExpenses }
})
</script>
