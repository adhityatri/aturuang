<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <UButton
        size="xl"
        :ui="{
          base: 'w-1/2 flex justify-center bg-neutral-200 inset-shadow-sm inset-shadow-neutral-300 ring-2 ring-white text-primary active:bg-neutral-400/20',
        }"
        :class="{
          'bg-primary inset-shadow-primary-900 text-white': active === 'income',
        }"
        @click="selectedTab('income')"
      >
        Pemasukan
      </UButton>
      <UButton
        size="xl"
        :ui="{
          base: 'w-1/2 flex justify-center bg-neutral-200 inset-shadow-sm inset-shadow-neutral-300 ring-2 ring-white text-primary active:bg-neutral-400/20',
        }"
        :class="{
          'bg-red-400 inset-shadow-red-900 text-white': active === 'expenses',
        }"
        @click="selectedTab('expenses')"
      >
        Pengeluaran
      </UButton>
    </div>

    <div class="h-[200px] overflow-auto">
      <div v-if="!isLoading" class="grid grid-cols-4 auto-rows-auto gap-4 mt-6">
        <div
          v-for="category in categoryStore.categories"
          :key="category.id"
          class="relative overflow-hidden bg-neutral-200 p-2 shadow-lg shadow-neutral-300 ring-2 ring-white inset-shadow-sm inset-shadow-neutral-300 rounded-md text-center"
          :class="{
            'bg-primary inset-shadow-primary-900 text-white':
              selectedCategory.id === category.id,
          }"
          @click="selectCategory(category)"
        >
          <div class="flex items-center justify-center">
            <UIcon :name="category.icon" size="1.5rem" />
          </div>
          <span class="text-xs font-medium capitalize tracking-tight">
            {{ category.name }}
          </span>
        </div>
      </div>
      <USkeleton v-else class="bg-neutral-300 w-full h-[200px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { iCategory } from "~/types/category";

const categoryStore = useCategory();

const emits = defineEmits(["select"]);
defineProps({
  selectedCategory: {
    type: Object as () => iCategory,
    default: () => ({}),
  },
});

const active = ref<"all" | "expenses" | "income">("income");
const isLoading = ref<boolean>(false);
await categoryStore.getCategoryByType(active.value);

const selectedTab = async (tab: "all" | "expenses" | "income") => {
  active.value = tab;
  isLoading.value = true;
  await categoryStore.getCategoryByType(active.value);
  isLoading.value = false;
};

const selectCategory = (category: iCategory) => {
  emits("select", category);
};
</script>
