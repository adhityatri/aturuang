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
                :class="
                    activeIndex === 0
                        ? 'scale-100 opacity-100'
                        : 'scale-95 opacity-50'
                "
            >
                <USkeleton
                    v-if="isLoading"
                    class="relative overflow-hidden h-[220px] bg-neutral-300 rounded-xl border-[1.5px] border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col items-start justify-end px-4 py-2"
                />
                <div v-else class="rounded-xl">
                    <div
                        class="relative overflow-hidden h-[220px] bg-[#064EAF] rounded-xl border-[1.5px] border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col items-start justify-between p-6 text-white"
                    >
                        <!-- Bauhaus Geometric Decorative Shapes -->
                        <div
                            class="absolute -top-6 -right-6 w-24 h-24 bg-[#EF2B24] rounded-full border-[1.5px] border-[#111111] pointer-events-none"
                        />
                        <div
                            class="absolute top-12 -right-2 w-12 h-12 bg-[#FFD21E] border-[1.5px] border-[#111111] pointer-events-none"
                        />

                        <div class="relative z-10 w-full">
                            <p
                                class="text-white/80 text-xs font-bold uppercase tracking-widest mb-1"
                            >
                                Saldo Saat Ini
                            </p>
                            <div class="flex items-center gap-2">
                                <app-privacy
                                    v-if="isPrivacyAccepted"
                                    size="lg"
                                    color="white"
                                />
                                <h1
                                    v-else
                                    class="text-3xl font-black tracking-tight"
                                >
                                    {{ formattedBalance }}
                                </h1>
                            </div>
                        </div>

                        <div class="relative z-10 w-full mt-auto">
                            <div
                                class="grid grid-cols-2 gap-3 p-3 bg-white text-[#0A0A0A] rounded-lg border-[1.5px] border-[#111111] shadow-[2px_2px_0px_#111111]"
                            >
                                <div class="flex items-center gap-3 px-2">
                                    <div class="p-1.5 bg-[#064EAF] text-white rounded border border-[#111111]">
                                        <UIcon
                                            name="solar:arrow-down-left-linear"
                                            class="text-md block"
                                        />
                                    </div>
                                    <div class="flex flex-col">
                                        <small
                                            class="text-[#6B7280] text-[10px] uppercase tracking-wider font-bold"
                                            >Pemasukan</small
                                        >
                                        <div class="flex items-center gap-1">
                                            <app-privacy
                                                v-if="isPrivacyAccepted"
                                                size="sm"
                                                color="primary"
                                            />
                                            <span
                                                v-else
                                                class="text-sm font-bold"
                                                >{{
                                                    summaryItems[0]
                                                        .formattedValue
                                                }}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="flex items-center justify-end gap-3 px-2 text-right"
                                >
                                    <div class="flex flex-col">
                                        <small
                                            class="text-[#6B7280] text-[10px] uppercase tracking-wider font-bold"
                                            >Pengeluaran</small
                                        >
                                        <div
                                            class="flex items-center justify-end gap-1"
                                        >
                                            <app-privacy
                                                v-if="isPrivacyAccepted"
                                                size="sm"
                                                color="primary"
                                            />
                                            <span
                                                v-else
                                                class="text-sm font-bold"
                                                >{{
                                                    summaryItems[1]
                                                        .formattedValue
                                                }}</span
                                            >
                                        </div>
                                    </div>
                                    <div class="p-1.5 bg-[#EF2B24] text-white rounded border border-[#111111]">
                                        <UIcon
                                            name="solar:arrow-up-right-linear"
                                            class="text-md block"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 2: Money Tracker -->
            <div
                class="snap-center shrink-0 w-full flex flex-col justify-center"
            >
                <div>
                    <money-tracker-budget
                        :is-loading="isLoading"
                        :budget="budget"
                        :reset-date="resetDate"
                        :expenses="expenses"
                        @submit="$emit('submit-budget', $event)"
                    />
                </div>
            </div>
        </div>

        <!-- Indicators -->
        <div class="flex justify-center gap-3 mt-4">
            <button
                v-for="index in 2"
                :key="index"
                class="w-6 h-3 transition-all duration-200 border border-[#111111]"
                :class="[
                    activeIndex === index - 1
                        ? 'bg-[#064EAF]'
                        : 'bg-white hover:bg-neutral-100',
                ]"
                @click="scrollToSlide(index - 1)"
            ></button>
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

const formattedBalance = computed(() =>
    useFormatPriceIntl(props.currentBalance),
);

const summaryItems = computed(() => [
    {
        label: "Pemasukan",
        value: props.income,
        icon: "solar:arrow-left-down-linear",
        iconColor: "text-green-800",
        formattedValue: useFormatPriceIntl(props.income),
        class: "basis-1/2 justify-start",
    },
    {
        label: "Pengeluaran",
        value: props.expenses,
        icon: "solar:arrow-right-up-linear",
        iconColor: "text-red-800",
        formattedValue: useFormatPriceIntl(props.expenses),
        class: "basis-1/2 justify-end",
    },
]);
</script>
