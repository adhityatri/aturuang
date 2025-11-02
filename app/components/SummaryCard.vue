<template>
  <div class="flex flex-col gap-4">
    <USkeleton
      v-if="isLoading"
      class="relative overflow-hidden h-[200px] bg-neutral-300 rounded-2xl flex flex-col items-start justify-end px-4 py-2"
    >
      <div class="gap-2 flex flex-col mb-6">
        <USkeleton class="h-4 w-[150px] bg-neutral-500 rounded-2xl" />
        <USkeleton class="h-10 w-[250px] bg-neutral-500 rounded-lg" />
      </div>
      <USkeleton class="h-[70px] w-full rounded-2xl bg-neutral-500" />
    </USkeleton>
    <div
      v-else
      class="relative overflow-hidden h-[200px] rounded-2xl shadow-xl bg-primary flex flex-col items-start justify-between ring-4 ring-white shadow-neutral-300 px-4 py-2"
    >
      <div class="absolute inset-0 z-0 custom-bg" />
      <div>
        <UIcon
          name="solar:wallet-money-bold"
          class="text-[10rem] opacity-20 text-white absolute right-0 bottom-[-10px]"
        />
      </div>
      <div class="leading-8 flex-1 flex flex-col justify-center text-white z-1">
        <p>Saldo Saat Ini</p>
        <app-privacy v-if="usePrivacyStore.isPrivacyAccepted" size="lg" />
        <h1 v-else class="text-[2rem] font-bold">
          {{ useFormatPriceIntl(props.currentBalance) }}
        </h1>
      </div>
      <div
        class="bg-primary-900/80 gap-2 ring-1 ring-primary-950 rounded-2xl p-2 h-auto text-white w-full flex justify-between z-1"
      >
        <div class="flex flex-1/2 items-center justify-start gap-2 px-2 py-2">
          <div class="bg-white/90 rounded-lg place-items-center flex">
            <UIcon
              name="solar:arrow-left-down-linear"
              class="text-[2rem] text-green-800"
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
        <div
          class="flex flex-1/2 flex-row-reverse items-center justify-end gap-2 rounded-xl px-2 py-2"
        >
          <div class="bg-white/90 rounded-lg place-items-center flex">
            <UIcon
              name="solar:arrow-right-up-linear"
              class="text-[2rem] text-red-800"
            />
          </div>
          <div class="flex flex-col w-full items-end leading-[1.2rem]">
            <small class="font-medium tracking-wide">Pengeluaran</small>
            <app-privacy v-if="usePrivacyStore.isPrivacyAccepted" size="sm" />
            <h2 v-else class="text-[0.85rem]">
              {{ useFormatPriceIntl(props.expenses) }}
            </h2>
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
