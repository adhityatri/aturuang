<template>
  <UModal class="bg-neutral-200" :open="isOpen">
    <template #header>
      <div class="flex justify-between py-2 w-full pt-4">
        <UButton
          class="all:unset text-primary ring-2 ring-white inset-shadow-sm inset-shadow-neutral-300 bg-neutral-200 rounded-full shadow-xl w-[40px] h-[40px] flex items-center justify-center active:bg-neutral-300"
          @click="emit('close')"
        >
          <UIcon name="material-symbols:close-rounded" size="1.5rem" />
        </UButton>
        <div
          class="flex items-center justify-center bg-neutral-200 ring-2 ring-white inset-shadow-sm inset-shadow-neutral-300 rounded-full shadow-xl p-2 px-6 font-medium"
        >
          <span>Sesuaikan Budget</span>
        </div>
      </div>
    </template>

    <template #body>
        <div class="ring-1 ring-black">

        </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  isOpen?: boolean;
}>();

const emit = defineEmits(["close"]);
</script>
