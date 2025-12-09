<template>
  <div class="flex flex-1 flex-col gap-4 pt-8 bg-primary-900">
    <div class="relative overflow-hidden px-4 bg-primary-900 min-h-[200px]">
      <lazy-transactions-charts
        :sources="transactionStore.transactionByMonth"
      />
    </div>

    <div
      ref="scrollComponent"
      class="rounded-tl-2xl rounded-tr-2xl bg-white flex flex-1 overflow-auto"
    >
      <transactions-tab
        :source="transactionStore.groupedTransactions"
        :incomes="income"
        :expenses="expenses"
        class="pt-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: "transactions-page",
});
useHead({
  bodyAttrs: {
    class: "",
  },
  title: "Transaksi",
});

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
  {
    mode: "navigation",
  }
);

const income = useFilterByCategory(
  transactionStore.groupedTransactions,
  "income"
);
const expenses = useFilterByCategory(
  transactionStore.groupedTransactions,
  "expenses"
);
</script>
