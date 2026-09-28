<template>
    <div class="grid grid-cols-3 bg-white corner-based overflow-hidden">
        <button
            v-for="tab in tabs"
            :key="tab.value"
            class="py-4 text-xs font-black uppercase tracking-wide transition"
            :class="
                modelValue === tab.value
                    ? 'bg-[#FFD21E] text-dark'
                    : 'bg-white text-dark hover:bg-neutral-100'
            "
            @click="$emit('update:modelValue', tab.value)"
        >
            {{ tab.label }}
            <span
                v-if="counts[tab.value] > 0"
                class="ml-1 inline-flex size-5 items-center justify-center rounded-full text-[10px]"
                :class="
                    modelValue === tab.value ? 'bg-dark text-white' : 'bg-neutral-200 text-dark'
                "
            >
                {{ counts[tab.value] }}
            </span>
        </button>
    </div>
</template>

<script setup lang="ts">
interface Tab {
    label: string;
    value: string;
}

defineProps<{ tabs: Tab[]; modelValue: string; counts: Record<string, number> }>();

defineEmits(["update:modelValue"]);
</script>
