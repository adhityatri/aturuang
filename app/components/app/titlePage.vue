<script setup lang="ts">
defineProps({ dark: { type: Boolean, default: false } });
const slot = useSlots();

const hasSubtitle = !!slot.subtitle;
const hasExtra = !!slot.extra;
</script>

<template>
    <div class="relative z-10 flex flex-col gap-4">
        <div
            class="flex items-start gap-3"
            :class="{
                'items-center': !hasSubtitle,
                'items-start': hasSubtitle,
                'justify-between': hasExtra,
                'justify-start': !hasExtra,
            }"
        >
            <div
                class="flex flex-col items-start"
                :class="{ 'text-dark': dark, 'text-white': !dark }"
            >
                <h1 class="font-medium text-xl capitalize">
                    <slot />
                </h1>
                <div v-if="hasSubtitle" class="text-sm font-bold text-dark/50">
                    <slot name="subtitle" />
                </div>
            </div>

            <div v-if="hasExtra">
                <slot name="extra" />
            </div>
        </div>
    </div>
</template>
