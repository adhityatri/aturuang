<template>
  <UButton variant="soft" class="rounded-lg py-3 px-4 shadow-xl ring-2 ring-white transition-all" :trailing-icon="isHidden ? 'solar:eye-bold' : 'solar:eye-closed-bold'" @click="handleEye">
  </UButton>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isHidden = ref(true);

const handleEye = () => {
  isHidden.value = !isHidden.value;
};
</script>
