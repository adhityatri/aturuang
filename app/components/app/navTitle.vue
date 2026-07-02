<template>
    <header class="relative z-10 flex items-center justify-between p-4 pt-6">
        <UButton
            type="button"
            :aria-label="ariaLabel"
            :ui="{
                base: 'flex size-11 items-center justify-center rounded-2xl bg-accent-green p-0 text-dark transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
            }"
            @click="emit('close')"
        >
            <UIcon :name="icon" class="text-2xl" />
        </UButton>

        <div class="max-w-[70%] rounded-2xl bg-accent-green px-5 py-3 text-center">
            <h3 class="truncate text-sm font-black capitalize text-dark">
                {{ title }}
            </h3>
        </div>
    </header>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>();

withDefaults(defineProps<{ title?: string; icon?: string; ariaLabel?: string }>(), {
    title: "Page Title",
    icon: "solar:alt-arrow-left-line-duotone",
    ariaLabel: "Kembali",
});
</script>
