<template>
  <div
    class="relative overflow-hidden ring-1 ring-neutral-100 bg-white flex flex-col h-[200px] rounded-2xl shadow-lg items-start justify-between"
  >
    <div class="px-4 leading-[2rem] flex-1 flex flex-col justify-center">
      <p class="text-gray-500">Saldo Saat Ini</p>
      <h1 class="text-[2rem] font-bold">{{ useFormatPriceIntl(props.currentBalance) }}</h1>
    </div>
    <div class="p-4 h-auto bg-gray-50 w-full flex justify-between">
      <div class="flex flex-col items-center leading-[1.2rem]">
        <small>Pemasukan</small>
        <h2 class="text-[1.2rem] text-green-500">{{ useFormatPriceIntl(props.income) }}</h2>
      </div>
      <div class="flex flex-col items-center leading-[1.2rem]">
        <small>Pengeluaran</small>
        <h2 class="text-[1.2rem] text-red-500">{{ useFormatPriceIntl(props.expenses) }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
    currentBalance?: number
    income?: number
    expenses?: number,
}

const props = withDefaults(defineProps<Props>(), {
  currentBalance: 0,
  income: 0,
  expenses: 0
});
</script>