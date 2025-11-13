<template>
  <USkeleton
    v-if="isLoading"
    class="h-[150px] w-full bg-neutral-300 rounded-2xl"
  />
  <div
    v-else
    class="p-4 w-full bg-neutral-50 main-shadow ring-2 ring-white rounded-2xl"
  >
    <h1 class="font-bold text-lg capitalize">batas anggaran bulanan</h1>
    <h2 class="text-md text-neutral-500">{{ calculateBudget.message }}</h2>

    <div class="flex flex-col mt-4 gap-2">
      <div class="flex items-end gap-2">
        <h1 class="font-bold text-red-700 text-[1.5rem]">
          {{ useFormatPriceIntl(props.expenses) }}
        </h1>
        <span class="font-bold text-neutral-400">/</span>
        <h2 class="text-[0.875rem]">{{ useFormatPriceIntl(props.budget) }}</h2>
      </div>
      <UProgress
        v-model="calculateBudget.percent"
        size="lg"
        !status
        :ui="{
          base: 'bg-neutral-300',
          indicator: 'bg-red-700',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isLoading?: boolean;
    budget?: number;
    expenses?: number;
  }>(),
  {
    isLoading: false,
    budget: 0,
    expenses: 0,
  }
);

// const currentMonth = useDateFormat(new Date(), "MMMM", { locales: "id-ID" });

const calculateBudget = computed(() => {
  const percentage = (props.expenses / props.budget) * 100;
  const message = getBudgetMessage(percentage);
  return {
    percent: percentage <= 100 ? percentage : 100,
    message,
  };
});
</script>
