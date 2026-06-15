<template>
  <div class="flex flex-col gap-4">
    <!-- Type Selector -->
    <div class="rounded-2xl border-[2px] border-dark bg-[#fffaf0] p-2">
      <div class="grid grid-cols-2 gap-2">
        <button type="button" @click="selectedTab('income')"
          class="rounded-xl border-[2px] px-4 py-3 text-sm font-black uppercase transition-all" :class="active === 'income'
            ? 'border-dark bg-accent-blue text-white shadow-[2px_2px_0px_#111111]'
            : 'border-transparent bg-white text-dark'
            ">
          Pemasukan
        </button>

        <button type="button" @click="selectedTab('expenses')"
          class="rounded-xl border-[2px] px-4 py-3 text-sm font-black uppercase transition-all" :class="active === 'expenses'
            ? 'border-dark bg-accent-red text-white shadow-[2px_2px_0px_#111111]'
            : 'border-transparent bg-white text-dark'
            ">
          Pengeluaran
        </button>
      </div>
    </div>

    <!-- Categories -->
    <div class="py-4 max-h-[320px] overflow-y-auto">
      <span class="line-clamp-2 text-[12px] font-black uppercase leading-tight">
        Sering Diguakan
      </span>
      <div v-if="!isLoading" class="mt-2 grid grid-cols-4 gap-3">
        <button v-for="category in categoryStore.categories" :key="category.id" type="button"
          class="group flex flex-col items-center justify-center gap-2 rounded-2xl border-[2px] border-dark bg-white py-4 text-center transition-all"
          :class="selectedCategory?.id === category.id
            ? active === 'income'
              ? 'bg-accent-blue text-white shadow-[3px_3px_0px_#111111]'
              : 'bg-accent-red text-white shadow-[3px_3px_0px_#111111]'
            : 'shadow-[2px_2px_0px_#111111]'
            " @click="selectCategory(category)">
          <UIcon :name="category.icon" class="text-xl" />

          <span class="line-clamp-2 text-[10px] font-black uppercase leading-tight">
            {{ category.name }}
          </span>
        </button>
      </div>

      <!-- Skeleton -->
      <div v-else class="mt-2 grid grid-cols-4 gap-3">
        <USkeleton v-for="i in 12" :key="i" class="h-[92px] rounded-2xl bg-neutral-300" />
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
const isLoading = ref(false);

await categoryStore.getCategoryByType(active.value);

const selectedTab = async (
  tab: "all" | "expenses" | "income",
) => {
  active.value = tab;

  isLoading.value = true;

  await categoryStore.getCategoryByType(tab);

  isLoading.value = false;
};

const selectCategory = (category: iCategory) => {
  emits("select", category);
};
</script>