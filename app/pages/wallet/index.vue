<template>
    <div
        class="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-[#fffaf0] pb-14"
    >
        <!-- Background -->
        <div class="absolute inset-0 z-0 bg-accent-blue" />
        <div class="absolute inset-0 z-0 custom-bg opacity-30" />
        <div
            class="absolute -right-16 top-24 size-40 rounded-full bg-accent-yellow"
        />
        <div
            class="absolute -left-16 top-60 size-36 rounded-full bg-accent-red"
        />

        <div class="relative z-1">
            <app-nav-title
                title="Kantong Saya"
                icon="solar:alt-arrow-left-line-duotone"
                @close="$router.back()"
            />

            <section class="px-4 pt-4">
                <div
                    class="rounded-[2rem] border-[2px] border-dark bg-white p-4 shadow-[5px_5px_0px_#111111]"
                >
                    <wallet-list :is-pages="true" />
                </div>
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
