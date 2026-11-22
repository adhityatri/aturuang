<template>
    <div class="relative pb-8 flex flex-1 flex-col gap-4 main-bg">
        <div class="">
            <app-nav-title
                title="Aktivitas"
                icon="solar:alt-arrow-left-line-duotone"
                @close="$router.back()"
            />
        </div>

        <div class="px-4 mt-4 h-[25dvh]">
            <money-tracker-budget
                :is-loading="activeTab === 'all' ? isLoading : false"
                :budget="useBudgets()?.budgetAmount"
                :reset-date="useBudgets()?.budgetResetDate"
                :expenses="useTransactionsStore()?.totalExpenses"
            />
        </div>

        <div class="relative flex-1">
            <div
                ref="tabContainer"
                class="h-12 grid grid-cols-3 bg-white shadow-xl shadow-base-color relative"
            >
                <div
                    ref="tabIndicator"
                    class="absolute bottom-0 h-1 bg-accent-green transition-all duration-300 ease-out rounded-t-full"
                    :style="{
                        width: indicatorWidth + 'px',
                        transform: 'translateX(' + indicatorX + 'px)',
                    }"
                />

                <button
                    v-for="tab in tabs"
                    :key="tab.value"
                    class="relative z-10 text-sm corner-based tracking-wide transition"
                    @click="selectTab(tab.value as categoryType)"
                >
                    {{ tab.label }}
                </button>
            </div>

            <div
                ref="scrollComponent"
                class="flex-1 rounded-t-4xl corner-squircle bg-white shadow-2xl px-6 py-6"
            >
                <transactions-item-list />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { categoryType } from "~/types/category";
definePageMeta({ name: "transactions-page" });
useHead({ bodyAttrs: { class: "" }, title: "Aktivitas" });

const tabs = shallowRef<Array<{ label: string; value: categoryType }>>([
    { label: "All", value: "all" },
    { label: "Expense", value: "expenses" },
    { label: "Income", value: "income" },
]);

const activeTab = ref<categoryType>("all");

// Tab indicator refs and computed
const tabContainer = ref<HTMLElement | null>(null);
const tabIndicator = ref<HTMLElement | null>(null);

const activeTabIndex = computed(() => tabs.value.findIndex((t) => t.value === activeTab.value));

const indicatorWidth = computed(() => {
    if (!tabContainer.value) return 0;
    return tabContainer.value.clientWidth / tabs.value.length;
});

const indicatorX = computed(() => {
    return activeTabIndex.value * indicatorWidth.value;
});

watch(activeTab, () => {
    nextTick(() => {
        // Force reflow for smooth animation
        if (tabIndicator.value) {
            tabIndicator.value.style.transition =
                "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
        }
    });
});

const selectTab = (tab: categoryType) => {
    activeTab.value = tab;
    loadMore();
};

const transactionStore = useTransactionsStore();

const page = ref<number>(20);
// const scrollContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const scrollComponent = ref(null);

const loadMore = async () => {
    if (isLoading.value) return;
    isLoading.value = true;
    try {
        page.value += 30;
        await transactionStore.getTransactionsWithCategory({
            category_type_filter: activeTab.value,
            page_limit: page.value,
        });
    } finally {
        isLoading.value = false;
    }
};

const handleScroll = (e) => {
    const element = scrollComponent?.value;
    if (element.getBoundingClientRect().bottom < window.innerHeight) {
        loadMore();
    }
};

onMounted(async () => {
    window.addEventListener("scroll", handleScroll);
    await useBudgets().getBudgetsByUserId();
    await Promise.all([
        loadMore(),
        transactionStore.getTransactionsCurrentMonth(),
        transactionStore.getPreviousMonthTransactions(),
    ]);
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>
