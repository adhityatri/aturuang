<template>
  <div
    class="flex"
    :class="{
      'gap-1 pt-[0.7rem]': props.size === 'sm',
      'gap-2 py-2': props.size === 'md',
      'gap-3 py-3': props.size === 'lg',
    }"
  >
    <div
      v-for="i in 6"
      :key="i"
      class="h-2 w-2 rounded-full"
      :class="{
        'bg-white': props.color === 'white',
        'bg-primary': props.color === 'primary',
      }"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  size: {
    type: String as () => "sm" | "md" | "lg",
    default: "lg",
  },
  color: {
    type: String as () => "white" | "primary",
    default: "white",
  },
});
</script>
