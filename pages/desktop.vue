<template>
  <div class="bg-white flex-1 flex flex-col items-center justify-center">
    <nuxt-img
      src="/images/maintenance.png"
      alt="maintenance desktop image"
      class="w-[300px] h-[300px] mb-8"
    />
    <div class="w-[600px] text-center p-4">
        <h1 class="text-4xl font-bold mb-4">Buka di Ponsel Anda</h1>
        <p class="text-gray-600 text-2xl">
          Situs ini dirancang untuk pengalaman terbaik di perangkat seluler.
        </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: "desktop-home",
  title: "Kitacatat.com | Desktop Home",
  layout: false,
});
</script>
