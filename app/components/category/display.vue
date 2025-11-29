<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-2 gap-4">
      <UButton
        :ui="{
          base: 'text-[0.875rem] py-3 rounded-2xl place-content-center ring-2 ring-white bg-linear-to-b from-neutral-100 via-neutral-200 to-neutral-300 text-primary',
        }"
        :class="{
          'bg-linear-to-b from-primary via-primary-900/40 to-primary-900/80 inset-shadow-primary-900 text-white':
            active === 'income',
        }"
        @click="selectedTab('income')"
      >
        Pemasukan
      </UButton>
      <UButton
        :ui="{
          base: 'text-[0.875rem] py-3 rounded-2xl place-content-center ring-2 ring-white bg-linear-to-b from-neutral-100 via-neutral-200 to-neutral-300 text-primary',
        }"
        :class="{
          'bg-linear-to-b from-red-500 via-red-700 to-red-900/80 text-white':
            active === 'expenses',
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
          class="relative overflow-hidden bg-linear-to-b from-neutral-100 to-neutral-200 p-2 shadow-lg shadow-neutral-300 ring-2 ring-white rounded-xl main-shadow text-center"
          :class="{
            'bg-linear-to-b from-primary to-primary-900 inset-shadow-primary-900 text-white':
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
      <div
        v-else
        class="grid grid-cols-4 auto-rows-auto gap-4 mt-6 w-full h-[200px]"
      >
        <USkeleton v-for="i in 12" :key="i" class="bg-neutral-300" />
      </div>
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
