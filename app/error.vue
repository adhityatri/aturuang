<template>
  <UError :error="error" />
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps({
  error: {
    type: Object as () => NuxtError,
    default: () => ({}),
  },
});
</script>
