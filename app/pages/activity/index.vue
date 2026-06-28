<template>
    <div
        class="relative px-6 py-8 flex flex-1 flex-col gap-4 overflow-hidden bg-[#fffaf0]"
    >
        <app-decorative-shape />
        <app-title-page>Activity</app-title-page>
        <div class="flex flex-col flex-1 gap-4 overflow-auto z-1">
            <div
                class="sticky! top-0 grid grid-cols-3 border-2 border-black bg-white shadow-[4px_4px_0_#111]"
            >
                <button
                    v-for="tab in tabs"
                    :key="tab.value"
                    class="py-3 text-xs font-black uppercase tracking-wide transition"
                    :class="
                        activeTab === tab.value
                            ? 'bg-[#FFD21E] text-black'
                            : 'bg-white text-black hover:bg-neutral-100'
                    "
                    @click="selectTab(tab.value as categoryType)"
                >
                    {{ tab.label }}
                </button>
            </div>
            <div
                ref="scrollComponent"
                class="flex-1 shadow-[4px_4px_0_#111] overflow-auto"
            >
                <transactions-item-list />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { categoryType } from "~/types/category";
definePageMeta({ name: "transactions-page" });
useHead({ bodyAttrs: { class: "" }, title: "Transaksi" });

const tabs = shallowRef<Array<{ label: string; value: categoryType }>>([
    { label: "All", value: "all" },
    { label: "Expense", value: "expenses" },
    { label: "Income", value: "income" },
]);

const activeTab = ref<categoryType>("all");

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

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
    loadMore();
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});

await callOnce(
    "transactions-by-month",
    () => transactionStore.get_transactions_by_month(),
    { mode: "navigation" },
);
</script>
