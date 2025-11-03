<template>
  <UButton
    :ui="{
      base: 'h-[50px] w-[50px] bg-neutral-200 inset-shadow-sm inset-shadow-neutral-300 rounded-full py-3 px-4 shadow-xl ring-2 ring-white transition-all text-primary hover:bg-neutral-300 active:bg-neutral-300',
    }"
    :trailing-icon="
      privacyStore.isPrivacyAccepted
        ? 'solar:eye-closed-bold'
        : 'solar:eye-bold'
    "
    @click="handleEye"
  />
</template>

<script setup lang="ts">
const privacyStore = usePrivacy();

const handleEye = () => {
  privacyStore.setPrivacyAccepted();
};
</script>
