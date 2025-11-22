<template>
  <div class="flex flex-col gap-4">
    <USkeleton
      v-if="isLoading"
      class="relative overflow-hidden h-[200px] bg-neutral-300 rounded-2xl flex flex-col items-start justify-end px-4 py-2"
    />
    <div v-else class="rounded-2xl">
      <div
        class="flex font-medium bg-primary-900/20 rounded-tl-2xl rounded-tr-2xl gap-2 items-center p-4 mx-2"
      >
        <UIcon name="solar:info-square-linear" />
        <p class="text-sm">
          Reset saldo dan anggaran setiap tanggal
          {{ useBudgets().budgets?.[0]?.monthly_start }}
        </p>
      </div>
      <div
        class="relative overflow-hidden h-[200px] bg-gradient rounded-xl shadow-lg flex flex-col items-start justify-between ring-2 ring-primary shadow-neutral-400 inset-shadow-sm inset-shadow-primary-700"
      >
        <div class="absolute inset-0 z-0 custom-bg" />
        <div class="flex flex-col flex-1 px-4 py-2">
          <!-- <div>
            <UIcon
              name="solar:wallet-money-bold"
              class="text-[10rem] opacity-20 text-white absolute right-0 bottom-[-10px]"
            />
          </div> -->
          <div
            class="leading-8 flex-1 flex flex-col justify-center text-white z-1"
          >
            <p>Saldo Saat Ini</p>
            <app-privacy v-if="usePrivacyStore.isPrivacyAccepted" size="lg" />
            <h1 v-else class="text-[2rem] font-bold">
              {{ useFormatPriceIntl(props.currentBalance) }}
            </h1>
          </div>
        </div>
        <div
          class="bg-linear-to-b from-primary-900/10 via-primary-900/70 to-primary-900 gap-2 rounded-xl p-2 h-auto text-white w-full flex justify-between z-1"
        >
          <div class="flex flex-1/2 items-center justify-start gap-2 px-2 py-2">
            <div
              class="main-shadow h-[32px] w-[32px] rounded-xl flex items-center justify-center"
            >
              <UIcon
                name="solar:arrow-left-down-linear"
                class="text-[1.5rem] text-green-800"
              />
            </div>
            <div class="flex flex-col items-start leading-[1.2rem]">
              <small class="font-medium tracking-wide">Pemasukan</small>
              <app-privacy v-if="usePrivacyStore.isPrivacyAccepted" size="sm" />
              <h2 v-else class="text-[0.85rem]">
                {{ useFormatPriceIntl(props.income) }}
              </h2>
            </div>
          </div>
          <div class="flex flex-1/2 items-center justify-end gap-2 px-2 py-2">
            <div class="flex flex-col items-end leading-[1.2rem]">
              <small class="font-medium tracking-wide">Pengeluaran</small>
              <app-privacy v-if="usePrivacyStore.isPrivacyAccepted" size="sm" />
              <h2 v-else class="text-[0.85rem]">
                {{ useFormatPriceIntl(props.expenses) }}
              </h2>
            </div>
            <div
              class="main-shadow h-[32px] w-[32px] rounded-xl flex items-center justify-center"
            >
              <UIcon
                name="solar:arrow-right-up-linear"
                class="text-[1.5rem] text-red-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const usePrivacyStore = usePrivacy();

interface Props {
  currentBalance?: number;
  income?: number;
  expenses?: number;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currentBalance: 0,
  income: 0,
  expenses: 0,
  isLoading: false,
});
</script>
