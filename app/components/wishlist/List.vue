<template>
    <div class="flex flex-col gap-4">
        <div
            v-if="wishlists.length === 0 && !hideEmpty"
            class="bg-white rounded-xl corner-squircle py-6 shadow-xl shadow-base-color"
        >
            <div class="flex flex-col items-center text-center gap-1 p-4">
                <div
                    class="bg-accent-green size-12 flex justify-center items-center rounded-4xl corner-squircle mb-4"
                >
                    <UIcon name="solar:heart-pulse-linear" class="text-2xl text-dark" />
                </div>
                <p class="text-dark text-sm font-bold uppercase">
                    {{ emptyTitle || "Belum ada impian" }}
                </p>
                <p class="text-xs font-medium text-neutral-400">
                    {{ emptyDesc || "Buat impian untuk mimpi & tujuan dana Anda." }}
                </p>
            </div>
        </div>

        <div v-else class="flex flex-col gap-4">
            <div
                v-for="item in wishlists"
                :key="item.id"
                class="group relative flex flex-col gap-3 rounded-3xl p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-all border border-dark/5"
                @click="navigateTo(`/wishlist/${item.id}`)"
            >
                <div class="flex items-center justify-between px-1">
                    <div class="flex items-center gap-2">
                        <div class="p-2 rounded-xl bg-accent-green/20 text-dark">
                            <UIcon
                                name="solar:star-fall-minimalistic-bold-duotone"
                                class="text-xl"
                            />
                        </div>
                        <div class="flex flex-col">
                            <h3 class="font-black text-dark truncate max-w-[180px]">
                                {{ item.name }}
                            </h3>
                            <div v-if="item.wallet_id" class="flex items-center gap-2">
                                <p class="text-xs text-dark/80">
                                    {{ getWalletName(item.wallet_id) }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <span
                        class="text-[10px] font-black uppercase tracking-wider text-dark bg-dark/5 px-2 py-1 rounded-lg"
                    >
                        {{ progress(item) }}%
                    </span>
                </div>

                <!-- Progress Bar Component -->
                <wishlist-progress-card
                    :current="item.current_amount || 0"
                    :target="item.target_amount || 0"
                    :progress="progress(item)"
                />

                <div v-if="item.notes" class="px-1">
                    <p class="text-[10px] font-medium text-secondary italic truncate italic">
                        "{{ item.notes }}"
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { iWishlist } from "~/types/wishlist";

const props = defineProps<{
    items?: iWishlist[];
    emptyTitle?: string;
    emptyDesc?: string;
    hideEmpty?: boolean;
}>();

const wishlistStore = useWishlist();
const walletStore = useWallets();

const wishlists = computed(() => props.items ?? wishlistStore.wishlists);

const walletList = computed(() => {
    return walletStore.wallets.map((wallet) => ({
        label: useCapitalize(wallet.name),
        value: wallet.id,
    }));
});

const progress = (item: iWishlist) => {
    if (!item.target_amount) return 0;
    return Math.min(
        100,
        Math.round((Number(item.current_amount || 0) / Number(item.target_amount)) * 100),
    );
};

const getWalletName = (id: string) => {
    return walletStore.wallets.find((w) => w.id === id)?.name || "Kantong";
};
</script>
