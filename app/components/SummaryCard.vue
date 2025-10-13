<template>
  <div class="flex flex-col gap-4">
    <div
      class="relative overflow-hidden h-[200px] rounded-2xl shadow-xl bg-primary flex flex-col items-start justify-between ring-4 ring-white shadow-neutral-300 px-4 py-2"
    >
      <div class="absolute inset-0 z-0 custom-bg" />
      <div>
        <UIcon
          name="solar:wallet-money-bold"
          class="text-[10rem] opacity-20 text-white absolute right-0 bottom-[-10px]"
        />
      </div>
      <div
        class="leading-[2rem] flex-1 flex flex-col justify-center text-white z-1"
      >
        <p>Saldo Saat Ini</p>
        <h1 class="text-[2rem] font-bold">
          {{ useFormatPriceIntl(props.currentBalance) }}
        </h1>
      </div>
      <div
        class="bg-primary-900/80 gap-2 ring-1 ring-primary-950 rounded-2xl p-2 h-auto text-white w-full flex justify-between z-1"
      >
        <div
          class="flex flex-1/2 items-center gap-2 px-4 py-2"
        >
        <div class="bg-white/90 rounded-lg place-items-center flex">
          <UIcon
            name="solar:arrow-left-down-linear"
            class="text-[2rem] text-green-800"
          />
        </div>
          <div class="flex flex-col items-start leading-[1.2rem]">
            <small class="font-medium tracking-wide">Pemasukan</small>
            <h2 class="text-[1.1rem]">{{ useFormatPriceIntl(props.income) }}</h2>
          </div>
        </div>
        <div
          class="flex flex-1/2 flex-row-reverse items-center gap-2 rounded-xl px-4 py-2"
        >
          <div class="bg-white/90 rounded-lg place-items-center flex">
            <UIcon
              name="solar:arrow-right-up-linear"
              class="text-[2rem] text-red-800"
            />
          </div>
          <div class="flex flex-col w-full items-end leading-[1.2rem]">
            <small class="font-medium tracking-wide">Pengeluaran</small>
            <h2 class="text-[1.1rem]">
              {{ useFormatPriceIntl(props.expenses) }}
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentBalance?: number;
  income?: number;
  expenses?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentBalance: 0,
  income: 0,
  expenses: 0,
});
</script>
