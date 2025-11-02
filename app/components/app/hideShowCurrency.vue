<template>
  <UButton
    variant="soft"
    class="rounded-lg py-3 px-4 shadow-xl ring-2 ring-white transition-all"
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
