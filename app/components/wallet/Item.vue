<template>
    <button
        v-for="wallet in props.list"
        :key="wallet.id"
        type="button"
        class="group relative overflow-hidden rounded-2xl bg-accent-green p-4 text-left transition hover:bg-neutral-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        @click="emit('selected', wallet)"
    >
        <div class="relative z-1 flex flex-col justify-between gap-4">
            <div>
                <h3 class="line-clamp-2 text-base font-black leading-5 text-dark">
                    {{ wallet.name }}
                </h3>
            </div>

            <app-privacy v-if="privacyStore.isPrivacyAccepted" size="md" color="primary" />

            <p v-else class="text-lg font-black tracking-tight text-dark">
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
