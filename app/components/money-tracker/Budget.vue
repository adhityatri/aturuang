<template>
  <div
    class="flex gap-4 justify-between bg-neutral-200 ring-2 ring-white shadow-xl p-4 inset-shadow-sm inset-shadow-neutral-300 rounded-2xl"
  >
    <div class="flex flex-col">
      <h2 class="font-bold">Monthly Budget</h2>
    </div>

    <div class="flex gap-1 text-right">
      <h2 class="text-sm font-bold text-red-800">
        {{ useFormatPriceIntl(props.expenses) }}
      </h2>
      <p class="text-sm text-neutral-600">
        /
        {{ useFormatPriceIntl(props.budget) }}
      </p>
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
</script>
