<template>
  <div
    class="cursor-pointer"
    @click="async () => navigateTo({ path: '/', replace: true })"
  >
    <b class="text-md">Kitacatat.com</b>
    |
    <span class="text-sm">Kelola Keuanganmu</span>
  </div>
</template>
