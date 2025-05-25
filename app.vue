<template>
  <UApp class="p-0">
    <NuxtRouteAnnouncer />
    <app-topbar />
    <UContainer as="main" class="flex flex-col flex-1">
      <NuxtPage />
    </UContainer>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: "flex flex-col h-[100dvh]",
  },
});
</script>
