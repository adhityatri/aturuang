<template>
    <div class="flex justify-end gap-2 bg-white overflow-hidden py-4 px-4">
        <button
            v-for="tab in tabs"
            :key="tab.value"
            class="py-1 px-3 text-xs corner-based font-black transition"
            :class="
                modelValue === tab.value
                    ? 'bg-accent-green/50 text-dark'
                    : 'bg-white-smooth text-dark hover:bg-neutral-100'
            "
            @click="$emit('update:modelValue', tab.value)"
        >
            {{ tab.label }}
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
