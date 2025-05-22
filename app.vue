<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <app-topbar />
    <UContainer as="main" class="flex flex-col flex-1">
      <div class="flex flex-col mt-8 mb-4">
        <div
          class="text-1xl capitalize py-1 px-4 bg-gray-200 shadow-md self-start rounded-sm"
        >
          KitaCatat.com
        </div>

        <span class="text-2xl font-bold mt-2">Welcome Back </span>
      </div>

      <hr class="border-gray-300 mb-8" />

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
