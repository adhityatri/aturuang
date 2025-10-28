<template>
  <div class="px-4">
    <div v-for="value in props.incomes" :key="value.title">
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
import { useTransactionNavigation } from "~/composables/useTransactionNavigation";

interface Props {
  incomes?: iGroupedTransaction[];
}

const props = withDefaults(defineProps<Props>(), {
  incomes: () => [],
});

const { navigateToTransactionDetail } = useTransactionNavigation();
</script>
