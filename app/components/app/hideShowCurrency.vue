<template>
    <UButton
        :ui="{
            base: 'h-12 w-12 rounded-2xl bg-accent-green flex items-center justify-center p-2 text-dark hover:bg-accent-green/90 active:bg-accent-green/80 active:translate-x-[2px] active:translate-y-[2px]',
        }"
        :icon="privacyStore.isPrivacyAccepted ? 'solar:eye-closed-bold' : 'solar:eye-bold'"
        @click="handleEye"
    />
</template>

<script setup lang="ts">
const privacyStore = usePrivacy();

const handleEye = () => {
    privacyStore.setPrivacyAccepted();
};
</script>
