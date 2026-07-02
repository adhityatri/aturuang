<script setup lang="ts">
defineProps({ dark: { type: Boolean, default: false } });
const slot = useSlots();

const hasSubtitle = !!slot.subtitle;
</script>

<template>
    <div class="relative z-10 flex flex-col gap-4">
        <div class="flex items-start gap-3">
            <div
                class="size-4 mt-2 rounded-md"
                :class="{ 'bg-dark': dark, 'bg-accent-green': !dark }"
            />

            <div class="flex flex-col items-start">
                <h1
                    class="text-2xl font-black capitalize tracking-tight"
                    :class="{ 'text-dark': dark, 'text-white': !dark }"
                >
                    <slot />
                </h1>
                <div v-if="hasSubtitle">
                    <slot name="subtitle" />
                </div>
            </div>
        </div>
    </div>
</template>
