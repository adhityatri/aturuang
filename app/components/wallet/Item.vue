<template>
    <button
        v-for="wallet in props.list"
        :key="wallet.id"
        type="button"
        class="min-w-37.5 group relative overflow-hidden corner-based p-4 text-left shadow-xl shadow-base-color transition hover:bg-neutral-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        @click="emit('selected', wallet)"
    >
        <!-- <UIcon class="size-10 bg-dark/20 absolute bottom-4 right-2" name="solar:wallet-linear" /> -->
        <div class="relative z-1 flex flex-col justify-between gap-1">
            <h3 class="line-clamp-2 font-bold text-sm text-dark/70">
                {{ wallet.name }}
            </h3>
            <app-privacy v-if="privacyStore.isPrivacyAccepted" size="md" color="primary" />
            <p v-else class="text-sm font-black tracking-tight text-dark">
                {{ useFormatPriceIntl(wallet.amount) }}
            </p>
        </div>
    </button>
</template>

<script setup lang="ts">
import type { iWallets } from "~/types/wallets";

const props = defineProps<{ list: iWallets[] }>();

const privacyStore = usePrivacy();

const emit = defineEmits<{ selected: [wallet: iWallets] }>();
</script>
