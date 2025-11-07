<template>
  <div class="bg-neutral-50 flex flex-col flex-1 gap-4 pb-14">
    <div class="p-4 flex justify-between">
      <UButton
        class="active:bg-neutral-300 text-primary ring-2 ring-white inset-shadow-sm inset-shadow-neutral-300 bg-neutral-200 rounded-full shadow-xl w-[50px] h-[50px] flex items-center justify-center"
        @click="$router.back()"
      >
        <UIcon name="solar:alt-arrow-left-line-duotone" size="1.5rem" />
      </UButton>
      <div class="flex gap-2">
        <div
          class="bg-neutral-200 ring-2 ring-white inset-shadow-sm inset-shadow-neutral-300 rounded-full shadow-xl p-4 px-6 font-medium"
        >
          <h3>Kantong Saya</h3>
        </div>
      </div>
    </div>

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

await useAsyncData("wallets-data", () => walletStore.getWallets(), {
  lazy: true,
  dedupe: "defer",
  server: true,
  immediate: true,
});
</script>
