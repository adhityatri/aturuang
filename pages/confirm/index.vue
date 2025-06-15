<script setup lang="ts">
definePageMeta({
  name: 'confirm-page',
  layout: false,
})

useHead({
  title: "kitacatat - confirmation page"
})

const user = useSupabaseUser()
const error = ref(null);

watch(user, () => {
  if (user.value) {
    return navigateTo('/')
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Memproses Autentikasi...</h1>
      <p class="text-gray-600 mb-6">Harap tunggu sebentar...</p>
      <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
    </div>
  </div>
</template>