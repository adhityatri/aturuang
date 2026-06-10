<template>
    <UButton
        :ui="{
            base: 'h-12 w-12 flex items-center justify-center ring-2 ring-dark  bg-white p-2 bg-transparent text-dark hover:bg-transparent hover:text-dark active:bg-transparent active:text-dark',
        }"
        :icon="
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
