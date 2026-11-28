<template>
    <div class="relative flex min-h-dvh flex-1 flex-col overflow-hidden main-bg pb-14">
        <div class="relative z-1">
            <app-nav-title title="Impian" @close="$router.back()" />

            <section class="px-4 pt-4">
                <div class="flex flex-col gap-2 pb-6">
                    <h2 class="font-bold">Impian & Target Dana</h2>
                    <p class="text-sm">
                        Simpan mimpi & target finansial kamu di sini. Tambahkan progres dana saat
                        kamu menabung.
                    </p>
                </div>

                <wishlist-list :is-pages="true" />
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

await useAsyncData(
    "wishlist-data-page",
    async () => {
        await Promise.all([wishlistStore.getWishlists(), walletStore.getWallets()]);
    },
    { lazy: true, dedupe: "defer", server: true, immediate: true },
);
</script>
