<template>
    <div class="relative flex min-h-dvh flex-1 flex-col overflow-hidden main-bg pb-14">
        <div class="relative z-1">
            <app-nav-title
                title="Kantong Saya"
                icon="solar:alt-arrow-left-line-duotone"
                @close="$router.back()"
            />

            <section class="px-4 pt-4">
                <wallet-list :is-pages="true" />
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ name: "wallets" });

useHead({ bodyAttrs: { class: "" }, title: "Kantong Saya" });

const walletStore = useWallets();

await useAsyncData("wallets-data-page", () => walletStore.getWallets(), {
    lazy: true,
    dedupe: "defer",
    server: true,
    immediate: true,
});
</script>
