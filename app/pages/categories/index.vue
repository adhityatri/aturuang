<script setup lang="ts">
definePageMeta({ name: "category-page" });

const categoryStore = useCategory();
const categoryType = ref<categoryType>("all");
const limit = ref(10);
const openCreate = ref(false);

const tabs = [
    { label: "Semua", value: "all" },
    { label: "Pengeluaran", value: "expenses" },
    { label: "Pemasukan", value: "income" },
] as const;

const { refresh } = useAsyncData(
    "category-list",
    async () => await categoryStore.getCategoryByType(categoryType.value),
    { dedupe: "defer", lazy: true },
);

const filteredCategories = computed(() => {
    return categoryStore.categories.slice(0, limit.value);
});

const hasMore = computed(() => {
    return limit.value < categoryStore.categories.length;
});

const loadMore = () => {
    limit.value += 10;
};

watch(categoryType, () => {
    limit.value = 10;
    refresh();
});
</script>

<template>
    <div class="flex flex-1 flex-col relative main-bg overflow-hidden">
        <div class="p-6 pb-4 main-bg">
            <app-title-page dark>
                <p class="font-bold">Kategori</p>
            </app-title-page>
        </div>

        <!-- Banner -->
        <div class="px-6 mb-4">
            <div
                class="rounded-4xl corner-squircle bg-dark px-6 py-10 shadow-xl shadow-base-color flex items-center justify-between relative overflow-hidden"
            >
                <div class="relative z-10">
                    <h2 class="text-xl font-bold text-white uppercase line-clamp-1">
                        Pusat Kategori
                    </h2>
                    <p class="text-sm text-white/60 font-medium">
                        Atur kategori sesuai gaya hidup keluarga Anda.
                    </p>
                </div>
                <UIcon
                    name="solar:tag-bold-duotone"
                    class="absolute -right-4 -bottom-4 text-8xl text-white/10 rotate-12"
                />
            </div>
        </div>

        <!-- Filter Tabs -->
        <div class="py-4 px-6">
            <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    v-for="tab in tabs"
                    :key="tab.value"
                    type="button"
                    class="corner-based text-dark shrink-0 px-4 py-2 text-xs capitalize transition-all active:scale-95 shadow-xl shadow-base-color ring-1 ring-dark/5"
                    :class="categoryType === tab.value ? 'bg-accent-green ' : 'bg-white'"
                    @click="categoryType = tab.value"
                >
                    {{ tab.label }}
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto px-6 pb-24">
            <div class="grid grid-cols-3 gap-3 pt-4">
                <div
                    v-for="category in filteredCategories"
                    :key="category.id"
                    class="shadow-xl shadow-base-color p-4 rounded-4xl corner-squircle bg-white"
                >
                    <UIcon :name="category.icon" />
                    <h3 class="font-bold text-xs capitalize truncate w-full">
                        {{ category.name }}
                    </h3>
                    <!-- <span class="text-xs text-dark/80 truncate w-full">{{ category.type }}</span> -->
                </div>
            </div>

            <!-- Load More Button -->
            <div v-if="hasMore" class="mt-8 flex justify-center pb-4">
                <button
                    class="corner-based bg-dark text-white px-6 py-2 text-xs font-black uppercase transition-all active:scale-95"
                    @click="loadMore"
                >
                    Tampilkan Lebih Banyak
                </button>
            </div>
        </div>

        <category-create v-model:open="openCreate" aria-label="Tambah Kategori" />

        <UButton
            class="fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-xl bg-accent-green text-dark hover:scale-105 active:bg-accent-green/70 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all"
            icon="solar:add-square-bold"
            aria-label="Tambah Kategori"
            @click="openCreate = true"
        />
    </div>
</template>
