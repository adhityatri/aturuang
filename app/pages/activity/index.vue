<template>
    <div class="relative flex flex-1 flex-col overflow-hidden bg-[#fffaf0]">
        <!-- Decorative Shapes -->
        <div class="absolute -top-20 -right-20 size-48 rounded-full bg-accent-yellow" />

        <div class="absolute top-48 -left-16 size-32 rounded-full bg-accent-red" />

        <div class="absolute bottom-20 right-10 h-24 w-24 bg-accent-blue rotate-12" />

        <div class="relative z-10 flex flex-1 flex-col gap-6 px-6 pt-8 pb-8">
            <!-- Header -->
            <div class="flex items-center gap-3">
                <div class="size-4 bg-text-dark" />

                <h1 class="text-2xl font-black uppercase tracking-tight text-dark">
                    Activity
                </h1>
            </div>

            <!-- Content -->
            <!-- <div class="flex-1 rounded-[2rem] border-[2px] border-dark bg-white p-5 shadow-[6px_6px_0px_#111111]">
                <div class="flex items-center gap-2 mb-4">
                    <div class="size-3 bg-accent-blue" />

                    <h3 class="font-black uppercase text-dark">
                        Content
                    </h3>
                </div>

                <div
                    class="flex h-full min-h-[250px] items-center justify-center rounded-2xl border-[2px] border-dashed border-dark bg-neutral-50">
                    <p class="text-sm font-bold uppercase tracking-wide text-secondary">
                        Your Content Here
                    </p>
                </div>
            </div> -->
        </div>
    </div>
</template>

<!-- <template>
    <div class="flex flex-1 flex-col gap-4 pt-8 px-6 bg-bg-light">
        <transactions-tab :transactions="transactionStore.groupedTransactions" />

        <div class="relative overflow-hidden px-4 bg-primary-900 min-h-[200px]">
      <lazy-transactions-charts
        :sources="transactionStore.transactionByMonth"
      />
    </div>

        <div ref="scrollComponent" class="rounded-tl-2xl rounded-tr-2xl bg-white flex flex-1 overflow-auto">
            <transactions-tab-v1 :source="transactionStore.groupedTransactions" :incomes="income" :expenses="expenses"
                class="pt-4" />
        </div>
    </div>
</template> -->

<script setup lang="ts">
definePageMeta({ name: "transactions-page" });
useHead({ bodyAttrs: { class: "" }, title: "Transaksi" });

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
            category_type_filter: "all",
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

const income = useFilterByCategory(
    transactionStore.groupedTransactions,
    "income",
);
const expenses = useFilterByCategory(
    transactionStore.groupedTransactions,
    "expenses",
);
</script>
