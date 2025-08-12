<template>
    <div 
        class="flex" 
        :class="{
            'text-red-800': isExpenses,
            'text-green-800': !isExpenses
        }">
        <slot />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    isExpenses?: boolean;
}>();

const isExpenses = computed(() => {
    return props.isExpenses ?? false;
});
</script>