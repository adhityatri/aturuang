<template>
  <div
    v-for="wallet in props.list"
    :key="wallet.id"
    class="bg-neutral-200 px-4 py-3 rounded-xl ring-2 ring-white shadow-lg shadow-neutral-300 min-w-[170px] snap-x"
    @click="emit('selected', wallet)"
  >
    <div class="flex flex-col h-full gap-1 justify-between items-end">
      <div class="text-[.87rem] line-clamp-2 font-medium text-neutral-800">
        {{ wallet.name }}
      </div>
      <div v-if="privacyStore.isPrivacyAccepted" class="text-primary font-bold tracking-wide">
        {{ useFormatPriceIntl(wallet.amount) }}
      </div>
      <app-privacy v-else size="md" color="primary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { iWallets } from "~/types/wallets";

const props = defineProps<{
  list: iWallets[];
}>();

const privacyStore = usePrivacy();
const emit = defineEmits(["selected"]);
</script>
