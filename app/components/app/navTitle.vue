<template>
    <header class="relative z-10 flex items-center justify-between p-4 pt-6">
        <UButton
            type="button"
            :aria-label="ariaLabel"
            :ui="{
                base: 'flex size-11 items-center justify-center rounded-2xl border-[1.5px] border-dark bg-white p-0 text-dark shadow-[3px_3px_0px_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
            }"
            @click="emit('close')"
        >
            <UIcon :name="icon" class="text-2xl" />
        </UButton>

        <div
            class="max-w-[70%] rounded-2xl border-[1.5px] border-dark bg-accent-yellow px-5 py-2 text-center shadow-[3px_3px_0px_#111111]"
        >
            <h3
                class="truncate text-sm font-black uppercase tracking-wide text-dark"
            >
                {{ title }}
            </h3>
        </div>
    </header>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>();

withDefaults(
    defineProps<{ title?: string; icon?: string; ariaLabel?: string }>(),
    {
        title: "Page Title",
        icon: "solar:alt-arrow-left-line-duotone",
        ariaLabel: "Kembali",
    },
);
</script>
