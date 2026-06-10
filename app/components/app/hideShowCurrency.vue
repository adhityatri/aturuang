<template>
    <UButton
        :ui="{
            base: 'h-full w-full bg-transparent text-[#0A0A0A] hover:bg-transparent hover:text-[#0A0A0A] active:bg-transparent active:text-[#0A0A0A]',
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
