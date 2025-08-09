<template>
    <div class="flex items-center gap-2 py-2">
        <div class="h-[42px] w-[42px] bg-secondary rounded-md" />
        <div class="flex justify-between items-start gap-4 w-full">
            <div class="flex flex-col">
                <h3 class="capitalize font-medium">{{ props.transaction?.notes || props.transaction?.categories?.name }}</h3>
                <small>{{ useDateFormat(props.transaction?.created_at, 'DD MMMM YYYY | HH:mm', {
                    locales: 'id-ID'
                }) }}</small>
            </div>
            <transactions-amount :is-expenses="props.transaction?.categories?.type === 'expenses'">{{ useFormatPriceIntl(props.transaction?.amount) }}</transactions-amount>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { iTransaction } from '~/types/transactions';

interface Props {
  transaction?: iTransaction;
}

const props = withDefaults(defineProps<Props>(), {
  transaction: () => ({
    id: 0,
    created_at: new Date().toISOString(),
    amount: 0,
    notes: '',
    categories: { name: '', type: '' }
  } as iTransaction)
});
</script>