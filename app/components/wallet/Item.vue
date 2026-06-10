<template>
  <div
    v-for="wallet in props.list"
    :key="wallet.id"
    class="bg-white border-[1.5px] border-[#111111] shadow-[2px_2px_0px_#111111] px-4 py-3 rounded-xl min-w-[170px] snap-x cursor-pointer hover:bg-neutral-50 transition-colors"
    @click="emit('selected', wallet)"
  >
    <div class="flex flex-col h-full gap-2 justify-between items-start">
      <div class="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
        KANTONG
      </div>
      <div class="text-[.87rem] line-clamp-2 font-bold text-[#0A0A0A]">
        {{ wallet.name }}
      </div>
      <app-privacy v-if="privacyStore.isPrivacyAccepted" size="md" color="primary" />
      <div v-else class="text-[#064EAF] font-black tracking-wide text-sm">
        {{ useFormatPriceIntl(wallet.amount) }}
      </div>
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
