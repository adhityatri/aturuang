<template>
  <div class="flex items-center gap-3 py-3 border-b-[1px] border-[#111111]/20 last:border-b-0 cursor-pointer hover:bg-neutral-50 transition-colors">
    <div
      class="flex items-center justify-center w-10 h-10 border-[1.5px] border-[#111111]"
      :class="isExpenses ? 'bg-[#EF2B24]' : 'bg-[#064EAF]'"
    >
      <UIcon
        :name="
          isExpenses
            ? 'solar:arrow-right-up-linear'
            : 'solar:arrow-left-down-linear'
        "
        class="text-[1.2rem] text-white"
      />
    </div>
    <div class="flex justify-between items-center gap-4 w-full">
      <div class="flex flex-col">
        <h3 class="uppercase font-bold text-[#0A0A0A] text-xs tracking-wider">
          {{
            props.transaction?.notes ||
            props.transaction?.categories?.name ||
            props.transaction?.category_name
          }}
        </h3>
        <small class="text-[#6B7280] text-[10px] font-bold tracking-widest mt-0.5">{{
          useDateFormat(props.transaction?.created_at, "DD MMM YYYY | HH:mm", {
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
        class="font-black text-sm"
        :class="isExpenses ? 'text-[#EF2B24]' : 'text-[#064EAF]'"
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
