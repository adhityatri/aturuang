<template>
    <div class="relative flex min-h-dvh flex-1 flex-col overflow-hidden main-bg pb-14">
        <div class="relative z-1">
            <app-nav-title title="Impian" @close="$router.back()" />

            <section class="px-4 pt-4 flex flex-col gap-8">
                <div class="flex flex-col gap-2 pb-2">
                    <h2 class="font-bold">Impian & Target Dana</h2>
                    <p class="text-sm">
                        Simpan mimpi & target finansial kamu di sini. Tambahkan progres dana saat
                        kamu menabung.
                    </p>
                </div>

                <div class="flex flex-col gap-4">
                    <h3 class="font-black text-dark px-1">Milik Saya</h3>
                    <wishlist-list :items="myWishlists" />
                </div>

                <div v-if="sharedWishlists.length > 0" class="flex flex-col gap-4 pb-12">
                    <h3 class="font-black text-dark px-1">Dibagikan ke Saya</h3>
                    <wishlist-list :items="sharedWishlists" hide-empty />
                </div>
            </section>

            <wishlist-add v-model:open="openAdd" />

            <UButton
                class="fixed bottom-24 right-6 z-50 p-4 rounded-4xl corner-squircle shadow-xl bg-accent-green text-dark hover:scale-105 transition-transform"
                icon="solar:add-square-linear"
                aria-label="Tambah Impian"
                @click="openAdd = true"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ name: "wishlist-page" });

useHead({ bodyAttrs: { class: "" }, title: "Impian Saya" });

const openAdd = shallowRef(false);

const wishlistStore = useWishlist();
const walletStore = useWallets();
const user = useSupabaseUser();

const myWishlists = computed(() =>
    wishlistStore.wishlists.filter((w) => w.user_id === user.value?.id),
);
const sharedWishlists = computed(() =>
    wishlistStore.wishlists.filter((w) => w.user_id !== user.value?.id),
);

await useAsyncData(
    "wishlist-data-page",
    async () => {
        await Promise.all([wishlistStore.getWishlists(), walletStore.getWallets()]);
    },
    { lazy: true, dedupe: "defer", server: true, immediate: true },
);
</script>
