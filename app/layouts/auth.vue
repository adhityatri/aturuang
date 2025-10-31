<template>
  <UContainer
    v-if="!isDesktop"
    as="main"
    class="flex px-0 flex-1 max-w-md bg-primary"
  >
    <slot />
  </UContainer>

  <div v-else>Page Desktop Ini</div>
</template>

<script setup lang="ts">
const { isDesktop } = useDevice();
</script>
