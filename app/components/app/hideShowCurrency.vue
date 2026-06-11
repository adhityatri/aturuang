<template>
    <UButton
        :ui="{
            base: 'h-12 w-12 flex items-center justify-center border-[1.5px] border-dark shadow-[4px_4px_0px_#111111] bg-white p-2 bg-transparent text-dark hover:bg-transparent hover:text-dark active:bg-transparent active:text-dark active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
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
