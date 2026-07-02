<template>
    <div class="flex flex-col items-start justify-end">
        <template v-if="props.isLoading">
            <USkeleton class="bg-neutral-300 h-4 w-[150px] mb-2" />
            <USkeleton class="bg-neutral-300 h-8 w-[200px]" />
        </template>
        <template v-else>
            <h2 class="text-sm font-medium uppercase tracking-wider">Halo</h2>
            <h1
                class="text-3xl font-extrabold uppercase tracking-wide leading-none"
            >
                {{ getFirstWord(identity?.full_name || "User") }}
            </h1>
        </template>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({ isLoading: { type: Boolean, default: false } });
const identity = getIdentities();
</script>
