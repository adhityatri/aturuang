<template>
    <div class="px-4">
        <div class="px-4">
            <div v-for="value in props.expenses" :key="value.title">
                <small class="uppercase text-neutral-400">{{ value.title }}</small>

                <transactions-item v-for="transaction in value.value" :key="transaction.id"
                    :transaction="transaction" />
            </div>
        </div>
        <!-- <div v-for="item in props.expenses.categories" :key="item.id"
            class="flex justify-between items-start gap-2 w-full py-2">
            <template v-if="item?.total_amount && item.total_amount > 0">
                <div class="flex items-center justify-center w-[42px] h-[38px] rounded-md">
                    <UIcon
                        :name="item?.category_type === 'expenses' ? 'solar:arrow-right-up-linear' : 'solar:arrow-left-down-linear'"
                        class="text-[1.5rem]"
                        :class="item?.category_type === 'expenses' ? 'text-red-800' : 'text-green-800'" />
                </div>
                <div class="flex justify-between items-start gap-4 w-full">
                    <div class="flex flex-col">
                        <h3 class="capitalize font-medium">{{ item?.category_name }}
                        </h3>
                        <small>
                            {{ useDateFormat(item?.created_at, 'DD MMMM YYYY | HH:mm', {
                                locales: 'id-ID'
                            }) }}
                        </small>
                    </div>
                    <transactions-amount>{{
                        useFormatPriceIntl(item?.total_amount ?? item?.amount) }}</transactions-amount>
                </div>
            </template>
</div> -->
    </div>
</template>

<script setup lang="ts">
import type { iGroupedTransaction } from '~/types/transactions';
interface Props {
    expenses?: iGroupedTransaction[];
}

const props = withDefaults(defineProps<Props>(), {
    expenses: () => [] as iGroupedTransaction[],
});
</script>
