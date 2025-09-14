<template>
    <div class="px-4">
        <div v-for="value in props.incomes" :key="value.title">
            <small class="uppercase text-neutral-400">{{ value.title }}</small>

            <transactions-item v-for="transaction in value.value" :key="transaction.id" :transaction="transaction" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { iGroupedTransaction } from '~/types/transactions';
interface Props {
    incomes?: iGroupedTransaction[];
}

const props = withDefaults(defineProps<Props>(), {
    incomes: () => [] as iGroupedTransaction[],
});
</script>