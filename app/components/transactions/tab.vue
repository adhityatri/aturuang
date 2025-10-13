<template>
    <UTabs default-value="all" color="neutral" variant="link" :items="items" class="w-full">
        <template #content="{ item }">
            <component :is="item.component" :source="props.source" :is-all="item.value === 'all'"
                :incomes="props.incomes" :expenses="props.expenses" />
        </template>
    </UTabs>
</template>

<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'
import type { iGroupedTransaction } from "~/types/transactions";

const props = defineProps<{
    source: iGroupedTransaction[];
    isAll?: boolean;
    incomes?: iGroupedTransaction[];
    expenses?: iGroupedTransaction[];
}>()

const all = resolveComponent('transactions-all')
const income = resolveComponent('transactions-income')
const outcome = resolveComponent('transactions-outcome')

const items = shallowRef<TabsItem[]>([
    {
        label: 'All Transactions',
        value: 'all',
        component: all,
    },
    {
        label: 'Income',
        value: 'income',
        component: income
    },
    {
        label: 'Expenses',
        value: 'expenses',
        component: outcome,
    }
])
</script>