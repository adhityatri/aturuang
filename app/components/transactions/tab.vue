<template>
    <div class="w-full">
        <div class="grid grid-cols-3 w-full border-b-2 border-black">
            <button
                v-for="item in items"
                :key="item.value"
                @click="activeValue = item.value"
                :class="[
                    'relative px-4 py-3 text-xs font-extrabold uppercase tracking-widest transition-all duration-150',
                    'border-b-[3px] min-h-[48px] flex items-center justify-center',
                    activeValue === item.value
                        ? 'bg-primary text-white border-primary -mb-[2px]'
                        : 'bg-surface text-black border-transparent hover:bg-canvas',
                ]"
                @mousedown="isPressed = item.value"
                @mouseup="isPressed = ''"
                @mouseleave="isPressed = ''"
            >
                <span :class="{ 'scale-95': isPressed === item.value && activeValue !== item.value }">
                    {{ item.label }}
                </span>
            </button>
        </div>

        <component
            :is="getActiveComponent()"
            :source="props.source"
            :is-all="activeValue === 'all'"
            :incomes="props.incomes"
            :expenses="props.expenses"
        />
    </div>
</template>

<script lang="ts" setup>
import type { TabsItem } from "@nuxt/ui";
import type { iGroupedTransaction } from "~/types/transactions";

const props = defineProps<{
    source: iGroupedTransaction[];
    isAll?: boolean;
    incomes?: iGroupedTransaction[];
    expenses?: iGroupedTransaction[];
}>();

const all = resolveComponent("transactions-all");
const income = resolveComponent("transactions-income");
const outcome = resolveComponent("transactions-outcome");

const items = shallowRef<TabsItem[]>([
    { label: "All Transactions", value: "all", component: all },
    { label: "Income", value: "income", component: income },
    { label: "Expenses", value: "expenses", component: outcome },
]);

const activeValue = ref("all");
const isPressed = ref("");

const getActiveComponent = () => {
    const value = activeValue.value;
    if (value === "income") return income;
    if (value === "expenses") return outcome;
    return all;
};
</script>
