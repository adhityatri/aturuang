<template>
  <UApp class="p-0">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtLoadingIndicator color="#0353A4" />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: "flex flex-col h-[100dvh] bg-gray-300",
  },
});
</script>
