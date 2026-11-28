<template>
    <div
        class="relative h-14 w-full overflow-hidden rounded-4xl corner-squircle bg-white flex items-center border border-dark/10 shadow-xl shadow-base-color"
    >
        <div
            class="absolute inset-y-0 left-0 bg-accent-green/60 transition-all duration-500 ease-out"
            :style="{ width: `${progress}%`, borderRight: '2px solid rgba(0,0,0,0.05)' }"
        >
            <div class="absolute right-[-8px] inset-y-0 w-4 bg-accent-green/80 skew-x-[-15deg]" />
        </div>

        <div class="relative z-1 flex w-full h-full">
            <!-- Current Amount Section -->
            <div class="flex flex-1 flex-col items-center justify-center border-r border-dark/5">
                <span
                    class="text-lg font-black leading-none transition-colors duration-500"
                    :class="progress >= 20 ? 'text-dark' : 'text-accent-green'"
                >
                    {{ formatShort(current) }}
                </span>
                <span
                    class="text-[9px] font-bold uppercase tracking-widest mt-1 transition-colors duration-500"
                    :class="progress >= 20 ? 'text-dark/80' : 'text-accent-green/70'"
                >
                    Terkumpul
                </span>
            </div>

            <!-- Target Amount Section -->
            <div class="flex flex-1 flex-col items-center justify-center">
                <span
                    class="text-lg font-black leading-none transition-colors duration-500 text-dark"
                >
                    {{ formatShort(target) }}
                </span>
                <span class="text-[9px] font-bold uppercase tracking-widest text-dark/80 mt-1">
                    Target
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ current: number; target: number; progress: number }>();

const formatShort = (amount: number) => {
    if (amount >= 1000000) return (amount / 1000000).toFixed(1).replace(/\.0$/, "") + "jt";
    if (amount >= 1000) return (amount / 1000).toFixed(0) + "rb";
    return amount.toString();
};
</script>
