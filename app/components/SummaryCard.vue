<template>
    <div class="flex flex-col gap-4">
        <!-- Slider Container -->
        <div
            ref="scrollContainer"
            class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none w-full gap-4"
            @scroll="handleScroll"
        >
            <!-- Slide 1: Saldo Utama -->
            <div
                class="snap-center shrink-0 w-full"
                :class="activeIndex === 0 ? 'scale-100 opacity-100' : 'scale-95 opacity-50'"
            >
                <USkeleton
                    v-if="isLoading"
                    class="relative overflow-hidden h-55 bg-neutral-300 rounded-[1.4rem] border-[1.5px] border-border-dark shadow-[4px_4px_0px_#111111] flex flex-col items-start justify-end px-4 py-2"
                />
                <div v-else class="rounded-[1.4rem]">
                    <div
                        class="relative overflow-hidden h-55 bg-accent-green rounded-[2em] flex flex-col items-start justify-between p-6 text-text-dark"
                    >
                        <div class="relative z-10 flex flex-col justify-center flex-1 w-full">
                            <p class="text-xs font-bold uppercase">Saldo Saat Ini</p>
                            <div class="flex items-center gap-2">
                                <app-privacy v-if="isPrivacyAccepted" size="lg" color="white" />
                                <h1 v-else class="text-4xl font-black tracking-tight">
                                    {{ formattedBalance }}
                                </h1>
                            </div>
                        </div>

                        <div class="relative z-10 w-full mt-auto">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-3">
                                    <div class="flex flex-col">
                                        <small class="text-dark text-[1rem]"> Pemasukan </small>
                                        <div class="flex items-center gap-1">
                                            <app-privacy
                                                v-if="isPrivacyAccepted"
                                                size="sm"
                                                color="primary"
                                            />
                                            <span v-else class="font-bold text-lg">
                                                {{ summaryItems[0]?.formattedValue ?? 0 }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <USeparator
                                    orientation="vertical"
                                    class="h-6"
                                    :ui="{ border: 'border-dark' }"
                                />
                                <div class="flex items-center justify-end gap-3 text-right">
                                    <div class="flex flex-col">
                                        <small class="text-dark text-[1rem]"> Pengeluaran </small>
                                        <div class="flex items-center justify-end">
                                            <app-privacy
                                                v-if="isPrivacyAccepted"
                                                size="sm"
                                                color="primary"
                                            />
                                            <span v-else class="text-lg font-bold">
                                                {{ summaryItems[1]?.formattedValue ?? 0 }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2: Money Tracker -->
            <div class="snap-center shrink-0 w-full flex flex-col justify-center">
                <money-tracker-budget
                    :is-loading="isLoading"
                    :budget="budget"
                    :reset-date="resetDate"
                    :expenses="expenses"
                    @submit="$emit('submit-budget', $event)"
                />
            </div>
        </div>

        <!-- Indicators -->
        <div class="flex justify-center gap-3 mt-4">
            <button
                v-for="index in 2"
                :key="index"
                class="w-6 h-3 transition-all duration-200 rounded-xl"
                :class="[
                    activeIndex === index - 1 ? 'bg-accent-green' : 'bg-white hover:bg-neutral-100',
                ]"
                @click="scrollToSlide(index - 1)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

interface Props {
    currentBalance?: number;
    income?: number;
    expenses?: number;
    isLoading?: boolean;
    resetDate?: string;
    budget?: number;
}

const props = withDefaults(defineProps<Props>(), {
    currentBalance: 0,
    income: 0,
    expenses: 0,
    isLoading: false,
    resetDate: "1",
    budget: 0,
});

defineEmits(["submit-budget"]);

const { isPrivacyAccepted } = storeToRefs(usePrivacy());

const scrollContainer = ref<HTMLElement | null>(null);
const activeIndex = ref(0);

const handleScroll = (event: Event) => {
    const container = event.target as HTMLElement;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    activeIndex.value = index;
};

const scrollToSlide = (index: number) => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollTo({
            left: scrollContainer.value.clientWidth * index,
            behavior: "smooth",
        });
        activeIndex.value = index;
    }
};

const formattedBalance = computed(() => useFormatPriceIntl(props.currentBalance));

const summaryItems = computed(() => [
    {
        label: "Pemasukan",
        value: props?.income ?? 0,
        icon: "solar:arrow-left-down-linear",
        iconColor: "text-green-800",
        formattedValue: useFormatPriceIntl(props?.income ?? 0),
        class: "basis-1/2 justify-start",
    },
    {
        label: "Pengeluaran",
        value: props?.expenses ?? 0,
        icon: "solar:arrow-right-up-linear",
        iconColor: "text-red-800",
        formattedValue: useFormatPriceIntl(props?.expenses ?? 0),
        class: "basis-1/2 justify-end",
    },
]);
</script>
