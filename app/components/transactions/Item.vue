<template>
    <div class="flex items-center gap-2 py-2">
        <div class="flex items-center justify-center w-[42px] h-[38px] rounded-md">
          <UIcon 
            :name="props.transaction?.categories?.type === 'expenses' ? 'solar:arrow-right-up-linear' : 'solar:arrow-left-down-linear'" 
            class="text-[1.5rem]"
            :class="props.transaction?.categories?.type === 'expenses' ? 'text-red-800' : 'text-green-800'"
          />
        </div>
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