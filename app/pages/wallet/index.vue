<template>
  <div class="bg-neutral-50 flex flex-col flex-1 gap-4 pb-14">
    <app-nav-title
      title="Kantong Saya"
      icon="solar:alt-arrow-left-line-duotone"
      @close="$router.back()"
    />

    <div class="flex flex-col gap-4 p-4">
      <wallet-list :is-pages="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: "wallets",
});

useHead({
  bodyAttrs: {
    class: "",
  },
  title: "Kantong Saya",
});

const walletStore = useWallets();

await useAsyncData("wallets-data-page", () => walletStore.getWallets(), {
  lazy: true,
  dedupe: "defer",
  server: true,
  immediate: true,
});
</script>
