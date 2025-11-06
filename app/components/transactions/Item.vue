<template>
  <div class="flex items-center gap-2 py-2">
    <div class="flex items-center justify-center w-[42px] h-[38px] rounded-md">
      <UIcon
        :name="
          isExpenses
            ? 'solar:arrow-right-up-linear'
            : 'solar:arrow-left-down-linear'
        "
        class="text-[1.5rem]"
        :class="isExpenses ? 'text-red-800' : 'text-green-800'"
      />
    </div>
    <div class="flex justify-between items-start gap-4 w-full">
      <div class="flex flex-col">
        <h3 class="capitalize font-medium">
          {{
            props.transaction?.notes ||
            props.transaction?.categories?.name ||
            props.transaction?.category_name
          }}
        </h3>
        <small>{{
          useDateFormat(props.transaction?.created_at, "DD MMMM YYYY | HH:mm", {
            locales: "id-ID",
          })
        }}</small>
      </div>
      <app-privacy
        v-if="usePrivacyStore.isPrivacyAccepted"
        size="sm"
        color="primary"
      />
      <transactions-amount
        v-else
        :is-expenses="isExpenses"
      >
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
    } as iTransaction),
});

const isExpenses = computed(() => {
  return (
    props.transaction?.categories?.type === "expenses" ||
    props.transaction?.category_type === "expenses"
  );
});
</script>
