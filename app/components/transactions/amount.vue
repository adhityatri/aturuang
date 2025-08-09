<template>
    <div class="flex" 
         :class="{
            'text-red-500': isExpenses,
            'text-green-500': !isExpenses
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