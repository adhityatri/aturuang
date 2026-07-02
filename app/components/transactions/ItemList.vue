<template>
    <div v-for="(item, index) in transactionStore.groupedTransactions" :key="index">
        <small class="uppercase text-neutral-400">
            {{ item.title }}
        </small>

        <div v-for="data in item.value" :key="data.id" @click="navigateToTransactionDetail(data)">
            <div
                class="flex items-center gap-3 pt-3 pb-6 cursor-pointer hover:bg-neutral-50 transition-colors"
            >
                <div class="flex items-center justify-center h-12 w-14 rounded-2xl bg-dark">
                    <UIcon
                        :name="
                            data?.category_type === 'expenses'
                                ? 'solar:arrow-right-up-linear'
                                : 'solar:arrow-left-down-linear'
                        "
                        class="text-xl"
                        :class="
                            data?.category_type === 'expenses'
                                ? 'text-accent-red'
                                : 'text-accent-green'
                        "
                    />
                </div>
                <div class="flex justify-between items-start gap-4 w-full">
                    <div class="flex flex-col">
                        <h3 class="capitalize font-bold text-dark text-sm tracking-wide">
                            {{ data?.notes || data?.categories?.name || data?.category_name }}
                        </h3>
                        <small class="text-dark text-[12px] tracking-widest mt-0.5">
                            {{
                                useDateFormat(data?.created_at, "DD MMM YYYY | HH:mm", {
                                    locales: "id-ID",
                                })
                            }}
                        </small>
                    </div>
                    <app-privacy
                        v-if="usePrivacyStore.isPrivacyAccepted"
                        size="sm"
                        color="primary"
                    />
                    <transactions-amount
                        v-else
                        class="text-sm"
                        :is-expenses="data?.category_type === 'expenses'"
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
