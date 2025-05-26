<template>
  <UApp class="p-0">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: "flex flex-col h-[100dvh]",
  },
});
</script>
