<script setup lang="ts">
type debtSummaryVariant = "debt" | "receivable";

interface Props {
    variant: debtSummaryVariant;
    amount: number;
    count: number;
    selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), { selected: false });

defineEmits<{ click: [event: MouseEvent] }>();

const presets = {
    debt: {
        label: "Utang",
        caption: "yang harus dibayar",
        icon: "solar:arrow-left-down-linear",
        card: "bg-white text-dark ring-1 ring-dark/6 shadow-xl shadow-base-color",
        iconClass: "bg-accent-red/15 text-accent-red",
    },
    receivable: {
        label: "Piutang",
        caption: "yang harus ditagih",
        icon: "solar:arrow-right-up-linear",
        card: "bg-accent-green text-dark shadow-xl shadow-base-color",
        iconClass: "bg-dark/10 text-dark",
    },
} as const satisfies Record<
    debtSummaryVariant,
    { label: string; caption: string; icon: string; card: string; iconClass: string }
>;

const preset = computed(() => presets[props.variant]);
</script>

<template>
    <button
        type="button"
        :aria-pressed="selected"
        class="corner-based flex h-full w-full cursor-pointer flex-col items-start justify-end p-4 text-left transition-all active:scale-99 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark/40"
        :class="[preset.card, selected && 'ring-2 ring-dark/25']"
        @click="$emit('click', $event)"
    >
        <div class="flex w-full items-center justify-between">
            <p class="text-sm font-black text-dark/60">
                {{ preset.label }}
            </p>
            <div
                class="flex size-8 items-center justify-center rounded-xl text-sm"
                :class="preset.iconClass"
            >
                <UIcon :name="preset.icon" class="text-lg" />
            </div>
        </div>
        <h2 class="text-lg font-bold text-dark">
            {{ useFormatPriceIntl(amount) }}
        </h2>
        <!-- <p class="text-[10px] font-medium text-dark/40">{{ count }} catatan aktif</p> -->
    </button>
</template>
