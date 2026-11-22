<template>
    <header
        class="relative z-10 flex items-center justify-between p-4 pt-6"
        :class="{ '': subtitle !== '' }"
    >
        <UButton
            type="button"
            :aria-label="ariaLabel"
            class="flex size-11 items-center justify-center corner-based shadow-xl shadow-base-color bg-white p-0 text-dark active:bg-accent-green/70 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all active:shadow-none',"
            @click="emit('close')"
        >
            <UIcon :name="icon" class="text-2xl" />
        </UButton>

        <div class="max-w-[70%] px-2 text-center" :class="{ 'text-end': subtitle !== '' }">
            <h3 class="truncate text-lg font-black capitalize text-dark">
                {{ title }}
            </h3>
            <p v-if="subtitle !== ''" class="text-xs">{{ subtitle }}</p>
        </div>
    </header>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>();

withDefaults(
    defineProps<{ title?: string; icon?: string; ariaLabel?: string; subtitle?: string }>(),
    { title: "Page Title", icon: "solar:alt-arrow-left-line-duotone", ariaLabel: "Kembali" },
);
</script>
