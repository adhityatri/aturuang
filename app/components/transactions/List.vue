<template>
  <div class="flex flex-col gap-2">
    <transactions-title class="text-primary-500">{{ title }}</transactions-title>
    <div>
      <small>Hari Ini</small>
      <transactions-item />
      <transactions-item />
      <transactions-item />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Hari Ini",
});
</script>
