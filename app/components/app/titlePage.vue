<script setup lang="ts">
defineProps({ dark: { type: Boolean, default: false } });
const slot = useSlots();

const hasSubtitle = !!slot.subtitle;
</script>

<template>
    <div class="relative z-10 flex flex-col gap-4">
        <div
            class="flex gap-3"
            :class="{ 'items-center': !hasSubtitle, 'items-start': hasSubtitle }"
        >
            <div
                class="size-4 mt-2 rounded-md"
                :class="{ 'bg-dark': dark, 'bg-accent-green': !dark }"
            />

            <div
                class="flex flex-col items-start"
                :class="{ 'text-dark': dark, 'text-white': !dark }"
            >
                <h1 class="text-xl capitalize">
                    <slot />
                </h1>
                <div v-if="hasSubtitle" class="text-sm font-bold text-dark/50">
                    <slot name="subtitle" />
                </div>
            </div>
        </div>
    </div>
</template>
