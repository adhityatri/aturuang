<template>
    <div class="flex items-center gap-3 py-3 cursor-pointer hover:bg-neutral-50 transition-colors">
        <div class="flex items-center justify-center h-12 w-14 rounded-2xl bg-dark">
            <!-- :class="isExpenses ? 'bg-accent-red' : 'bg-accent-blue'" -->
            <UIcon
                :name="isExpenses ? 'solar:arrow-right-up-linear' : 'solar:arrow-left-down-linear'"
                class="text-xl text-accent-green"
            />
        </div>
        <div class="flex justify-between items-start gap-4 w-full">
            <div class="flex flex-col">
                <h3 class="capitalize font-bold text-dark text-sm tracking-wide">
                    {{
                        props.transaction?.notes ||
                        props.transaction?.categories?.name ||
                        props.transaction?.category_name
                    }}
                </h3>
                <small class="text-dark text-[12px] tracking-widest mt-0.5">{{
                    useDateFormat(props.transaction?.created_at, "DD MMM YYYY | HH:mm", {
                        locales: "id-ID",
                    })
                }}</small>
            </div>
            <app-privacy v-if="usePrivacyStore.isPrivacyAccepted" size="sm" color="primary" />
            <transactions-amount v-else :is-expenses="isExpenses" class="text-sm">
                <!-- :class="isExpenses ? 'text-[#EF2B24]' : 'text-[#064EAF]'" -->
                {{ useFormatPriceIntl(props.transaction?.amount) }}
            </transactions-amount>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { iTransaction } from "~/types/transactions";

interface Props {
    transaction?: iTransaction;
}

const usePrivacyStore = usePrivacy();

const props = withDefaults(defineProps<Props>(), {
    transaction: () =>
        ({
            id: 0,
            created_at: new Date().toISOString(),
            amount: 0,
            notes: "",
            categories: { name: "", type: "" },
        }) as iTransaction,
});

const isExpenses = computed(() => {
    return (
        props.transaction?.categories?.type === "expenses" ||
        props.transaction?.category_type === "expenses"
    );
});
</script>
