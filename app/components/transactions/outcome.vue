<template>
  <div class="px-4">
    <div v-for="value in props.expenses" :key="value.title">
      <small class="uppercase text-neutral-400">{{ value.title }}</small>

      <transactions-item
        v-for="transaction in value.value"
        :key="transaction.id"
        :transaction="transaction"
        @click="navigateToTransactionDetail(transaction)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { iGroupedTransaction } from "~/types/transactions";

interface Props {
  expenses?: iGroupedTransaction[];
}

const { navigateToTransactionDetail } = useTransactionNavigation();
const props = withDefaults(defineProps<Props>(), {
  expenses: () => [] as iGroupedTransaction[],
});
</script>
