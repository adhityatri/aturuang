<template>
  <div class="relative flex flex-col flex-1">
    <UContainer
      as="main"
      class="flex flex-col flex-1 bg-neutral-50 pb-[70px] px-0"
    >
      <slot />
      <money-tracker-create
        :is-open="transaction.isCreateOpen"
        @close="handleCreate(false)"
      />
    </UContainer>
    <UButton
      v-if="canCreate"
      :ui="{
        base: 'main-shadow active:bg-neutral-300 fixed flex items-center justify-center rounded-full px-2 shadow-xl shadow-neutral-300/90 w-[100px] h-[50px] bottom-23 right-4 text-primary ring-2 ring-white',
      }"
      @click="handleCreate(true)"
    >
      <UIcon name="solar:add-square-broken" class="size-5" />
      Baru
    </UButton>
    <app-footer v-if="!isDesktop" />
  </div>
</template>

<script setup lang="ts">
const { isDesktop } = useDevice();

const router = useRouter();
const currentRouter = computed(() => {
  return router.currentRoute.value.path;
});
const canCreate = computed(() => {
  return currentRouter.value === "/";
});

const transaction = useTransactionsStore();
const handleCreate = (value: boolean) => {
  transaction.isCreateOpen = value;
};
</script>
