<template>
    <div
        v-for="(item, index) in transactionStore.groupedTransactions"
        :key="index"
    >
        <small class="uppercase text-neutral-400">
            {{ item.title }}
        </small>

        <div
            v-for="data in item.value"
            :key="data.id"
            @click="navigateToTransactionDetail(data)"
        >
            <div
                class="flex items-center gap-3 py-3 border-b-[1px] border-[#111111]/20 last:border-b-0 cursor-pointer hover:bg-neutral-50 transition-colors"
            >
                <div
                    class="flex items-center justify-center w-10 h-10 border-[1.5px] border-[#111111]"
                    :class="
                        data?.category_type === 'expenses'
                            ? 'bg-[#EF2B24]'
                            : 'bg-[#064EAF]'
                    "
                >
                    <UIcon
                        :name="
                            data?.category_type === 'expenses'
                                ? 'solar:arrow-right-up-linear'
                                : 'solar:arrow-left-down-linear'
                        "
                        class="text-[1.2rem] text-white"
                    />
                </div>
                <div class="flex justify-between items-center gap-4 w-full">
                    <div class="flex flex-col">
                        <h3
                            class="uppercase font-bold text-[#0A0A0A] text-xs tracking-wider"
                        >
                            {{
                                data?.notes ||
                                data?.categories?.name ||
                                data?.category_name
                            }}
                        </h3>
                        <small
                            class="text-[#6B7280] text-[10px] font-bold tracking-widest mt-0.5"
                            >{{
                                useDateFormat(
                                    data?.created_at,
                                    "DD MMM YYYY | HH:mm",
                                    { locales: "id-ID" },
                                )
                            }}</small
                        >
                    </div>
                    <app-privacy
                        v-if="usePrivacyStore.isPrivacyAccepted"
                        size="sm"
                        color="primary"
                    />
                    <transactions-amount
                        v-else
                        :is-expenses="data?.category_type === 'expenses'"
                        class="font-black text-sm"
                        :class="
                            data?.category_type === 'expenses'
                                ? 'text-[#EF2B24]'
                                : 'text-[#064EAF]'
                        "
                    >
                        {{ useFormatPriceIntl(data?.amount) }}
                    </transactions-amount>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const usePrivacyStore = usePrivacy();
const transactionStore = useTransactionsStore();
const { navigateToTransactionDetail } = useTransactionNavigation();
</script>
