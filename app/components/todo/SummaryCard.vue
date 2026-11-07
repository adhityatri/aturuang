<template>
    <button
        type="button"
        :aria-pressed="selected"
        class="corner-based flex h-full w-full cursor-pointer flex-col items-start justify-end p-4 text-left transition-all active:scale-99 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark/40"
        :class="[preset.card, selected && SELECTED_CLASS]"
        @click="$emit('click', $event)"
    >
        <UIcon :name="icon ?? preset.icon" class="mb-3 text-[2.5rem]" />

        <p class="text-sm font-medium">{{ label ?? preset.label }}</p>
        <h2 class="text-3xl font-bold text-dark/60">{{ value }}</h2>
    </button>
</template>

<script setup lang="ts">
type SummaryCardVariant = "all" | "progress";

interface Props {
    variant: SummaryCardVariant;
    value: number | string;
    label?: string;
    icon?: string;
    selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    selected: false,
});

defineEmits<{ click: [event: MouseEvent] }>();

const presets = {
    all: {
        label: "Semua Catatan",
        icon: "solar:copy-check-line-duotone",
        card: "bg-accent-green text-dark active:bg-accent-green/80",
    },
    progress: {
        label: "Sedang Berjalan",
        icon: "solar:loader-bold",
        card: "bg-white text-dark shadow-xl shadow-base-color ring-1 ring-dark/6 active:bg-gray-100",
    },
} as const satisfies Record<
    SummaryCardVariant,
    { label: string; icon: string; card: string }
>;

const SELECTED_CLASS = "ring-2 ring-dark/20";

const preset = computed(() => presets[props.variant]);
</script>
