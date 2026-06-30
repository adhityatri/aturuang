<template>
    <section class="w-full rounded-[2rem] border-[2px] border-dark bg-white p-4 shadow-[4px_4px_0px_#111111]">
        <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="size-3 bg-dark" />
                <h2 class="text-lg font-black uppercase text-dark">
                    Transactions
                </h2>
            </div>

            <UButton icon="solar:filter-linear" variant="ghost" color="neutral" :ui="{
                base: 'rounded-xl border-[1.5px] border-dark bg-accent-yellow px-3 py-2 text-xs font-black text-dark shadow-[2px_2px_0px_#111111]',
            }">
                Filter
            </UButton>
        </div>

        <div class="mb-5 grid grid-cols-3 gap-2 rounded-2xl border-[2px] border-dark bg-[#fffaf0] p-2">
            <button v-for="tab in tabs" :key="tab.value" type="button"
                class="rounded-xl border-[1.5px] px-3 py-3 text-xs font-black uppercase transition" :class="activeTab === tab.value
                    ? 'border-dark bg-accent-blue text-white shadow-[2px_2px_0px_#111111]'
                    : 'border-transparent bg-white text-dark'
                    " @click="activeTab = tab.value">
                {{ tab.label }}
            </button>
        </div>

        <div v-if="filteredTransactions.length === 0"
            class="rounded-2xl border-[2px] border-dashed border-dark bg-neutral-50 p-8 text-center">
            <UIcon name="solar:receipt-linear" class="mx-auto text-3xl text-accent-blue" />
            <p class="mt-3 text-sm font-black uppercase text-dark">
                Belum Ada Transaksi
            </p>
        </div>

        <!-- <div v-else class="flex flex-col gap-3">
            <button v-for="item in filteredTransactions" :key="item.id" type="button"
                class="flex items-center gap-3 rounded-2xl border-[2px] border-dark bg-white p-3 text-left shadow-[2px_2px_0px_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                @click="$emit('select', item)">
                <div class="flex size-12 shrink-0 items-center justify-center rounded-xl border-[2px] border-dark text-white"
                    :class="item.type === 'expenses' ? 'bg-accent-red' : 'bg-accent-blue'">
                    <UIcon
                        :name="item.type === 'expenses' ? 'solar:arrow-left-down-linear' : 'solar:arrow-right-up-linear'"
                        class="text-xl" />
                </div>

                <div class="min-w-0 flex-1">
                    <h3 class="truncate text-sm font-black text-dark">
                        {{ item.title }}
                    </h3>
                    <p class="text-xs font-bold text-secondary">
                        {{ item.date }}
                    </p>
                </div>

                <p class="text-sm font-black"
                    :class="item.type === 'expenses' ? 'text-accent-red' : 'text-accent-blue'">
                    {{ item.type === 'expenses' ? '-' : '+' }}
                    {{ useFormatPriceIntl(item.amount) }}
                </p>
            </button>
        </div> -->
    </section>
</template>

<script setup lang="ts">
import type { iGroupedTransaction } from '~/types/transactions';

type TransactionType = "expenses" | "earnings";

interface TransactionItem {
    id: string | number;
    title: string;
    amount: number;
    type: TransactionType;
    date: string;
}

const props = defineProps<{
    transactions: iGroupedTransaction[];
}>();

// const props = withDefaults(
//     defineProps<{
//         transactions?: TransactionItem[];
//     }>(),
//     {
//         transactions: () => [
//             {
//                 id: 1,
//                 title: "Shopping",
//                 amount: 125000,
//                 type: "expenses",
//                 date: "Today, 3:14 pm",
//             },
//             {
//                 id: 2,
//                 title: "Helen T.",
//                 amount: 38600,
//                 type: "earnings",
//                 date: "Today, 2:00 pm",
//             },
//         ],
//     },
// );

defineEmits<{
    select: [transaction: TransactionItem];
}>();

const activeTab = ref<"all" | "expenses" | "earnings">("all");

const tabs = [
    { label: "All", value: "all" },
    { label: "Spendings", value: "expenses" },
    { label: "Earnings", value: "earnings" },
] as const;

const filteredTransactions = computed(() => {
    if (activeTab.value === "all") return props.transactions;

    return props.transactions.filter((item) => item.type === activeTab.value);
});
</script>