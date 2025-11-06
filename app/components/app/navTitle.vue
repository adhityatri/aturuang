<template>
  <div class="p-4 flex justify-between mt-4">
    <UButton
      class="active:bg-neutral-300 text-primary ring-2 ring-white inset-shadow-sm inset-shadow-neutral-300 bg-neutral-200 rounded-full shadow-xl w-[40px] h-[40px] flex items-center justify-center"
      @click="emit('close')"
    >
      <UIcon :name="icon" size="1.5rem" />
    </UButton>
    <div
      class="bg-neutral-200 ring-2 ring-white inset-shadow-sm inset-shadow-neutral-300 rounded-full shadow-xl p-2 px-6 font-medium"
    >
      <h3>{{ title }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"]);
defineProps({
  title: {
    type: String,
    default: "Page Title",
  },
  icon: {
    type: String,
    default: "solar:alt-arrow-left-line-duotone",
  },
});
</script>
