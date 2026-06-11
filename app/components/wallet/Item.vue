<template>
    <button
        v-for="wallet in props.list"
        :key="wallet.id"
        type="button"
        class="group relative overflow-hidden rounded-2xl border-[1.5px] border-dark bg-white p-4 text-left shadow-[3px_3px_0px_#111111] transition hover:bg-neutral-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        @click="emit('selected', wallet)"
    >
        <div
            class="absolute -right-6 -top-6 size-16 rounded-full bg-accent-yellow"
        />

        <div class="relative z-1 flex flex-col justify-between gap-4">
            <div>
                <p
                    class="text-[10px] font-black uppercase tracking-[0.22em] text-secondary"
                >
                    Kantong
                </p>

                <h3
                    class="mt-1 line-clamp-2 text-base font-black leading-5 text-dark"
                >
                    {{ wallet.name }}
                </h3>
            </div>

            <app-privacy
                v-if="privacyStore.isPrivacyAccepted"
                size="md"
                color="primary"
            />

            <p
                v-else
                class="text-lg font-black tracking-tight text-accent-blue"
            >
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
