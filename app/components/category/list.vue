<script setup lang="ts">
import type { iCategory, categoryType } from "~/types/category";

const categoryStore = useCategory();

const props = withDefaults(
    defineProps<{ tab?: categoryType; selectedCategory: iCategory }>(),
    { tab: "all" },
);

const { execute } = useAsyncData(
    "category-list",
    async () => await categoryStore.getCategoryByType(props.tab),
    { dedupe: "defer", lazy: true, immediate: true },
);

const isLoading = ref(false);
const active = ref<"all" | "expenses" | "income">("income");

watch(
    () => props.tab,
    async () => {
        isLoading.value = true;
        active.value = props.tab;
        await execute();
        isLoading.value = false;
    },
);

const emits = defineEmits(["select"]);
const selectCategory = (category: iCategory) => {
    emits("select", category);
};
</script>

<template>
    <div v-if="!isLoading" class="mt-2 grid grid-cols-4 gap-3">
        <!-- <USelect v-model="selectedCategory" :items="categoryStore.categories" /> -->
        <button
            v-for="category in categoryStore.categories"
            :key="category.id"
            type="button"
            class="group flex flex-col items-center justify-center gap-2 rounded-2xl border-[2px] border-dark bg-bg-light py-4 text-center transition-all"
            :class="
                selectedCategory?.id === category.id
                    ? active === 'income'
                        ? 'bg-accent-blue! text-white shadow-[3px_3px_0px_#111111]'
                        : 'bg-accent-red! text-white shadow-[3px_3px_0px_#111111]'
                    : 'shadow-[2px_2px_0px_#111111]'
            "
            @click="selectCategory(category)"
        >
            <UIcon :name="category.icon" class="text-xl" />

            <span
                class="line-clamp-2 text-[10px] font-black uppercase leading-tight"
            >
                {{ category.name }}
            </span>
        </button>
    </div>

    <!-- Skeleton -->
    <div v-else class="mt-2 grid grid-cols-4 gap-3">
        <USkeleton
            v-for="i in 12"
            :key="i"
            class="h-23 rounded-2xl bg-neutral-300"
        />
    </div>
</template>
