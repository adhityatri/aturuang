<template>
    <div class="flex flex-1 flex-col relative main-bg overflow-hidden">
        <div class="p-6 main-bg">
            <app-title-page dark>
                <p class="font-bold">Catatan</p>
                <template #subtitle> Catat hari ini, rencanakan esok </template>
                <template #extra>
                    <UButton
                        :ui="{
                            base: 'rounded-4xl corner-squircle shadow-xl shadow-base-color bg-accent-green text-dark text-sm p-2 active:bg-accent-green/50',
                        }"
                        leading-icon="solar:add-square-bold"
                        @click="openCreate = true"
                    />
                    <notes-create
                        v-model:open="openCreate"
                        :is-adding="isAdding"
                        @submit="addTodo"
                    />
                </template>
            </app-title-page>
        </div>

        <div class="p-6 grid grid-cols-2 gap-2">
            <todo-summary-card
                variant="all"
                :value="todos.length"
                :selected="activeTab === 'all'"
                @click="setActiveTabs('all')"
            />
            <todo-summary-card
                variant="progress"
                :value="tabCounts.progress"
                :selected="activeTab === 'progress'"
                @click="setActiveTabs('progress')"
            />
        </div>

        <div class="p-4 w-full">
            <UInput
                v-model="search"
                icon="i-lucide-search"
                class="w-full"
                size="xl"
                variant="outline"
                placeholder="Cari catatan kamu"
                aria-label="Cari catatan"
                :ui="{ base: 'ps-12! pr-12!' }"
                @keydown.esc="search = ''"
            >
                <template v-if="search" #trailing>
                    <UButton
                        icon="i-lucide-x"
                        color="neutral"
                        variant="link"
                        size="xs"
                        aria-label="Hapus pencarian"
                        class="text-dark/50 hover:text-dark"
                        @click="search = ''"
                    />
                </template>
            </UInput>
        </div>
        <app-title-page class="p-4" dark>
            <span>Aktivitas Terbaru</span>
        </app-title-page>
        <div class="flex flex-1 overflow-y-auto pb-22">
            <todo-list
                ref="scrollComponent"
                :todos="filteredTodos"
                :loading="todoStore.loading"
                :empty-icon="emptyIcon"
                :empty-title="emptyTitle"
                :empty-desc="emptyDesc"
                @toggle="toggleTodo"
                @remove="removeTodo"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ name: "note-page" });
useHead({ title: "Catatan Kita" });

const todoStore = useTodos();
const isAdding = ref(false);
const activeTab = ref<"all" | "progress" | "monthly">("all");
const search = ref("");
const debouncedsearch = refDebounced(search, 300);
const openCreate = ref(false);

const todos = computed(() => todoStore.todos);

const normalizedSearch = computed(() => debouncedsearch.value.trim().toLowerCase());
const isSearching = computed(() => normalizedSearch.value.length > 0);

const filteredTodos = computed(() => {
    let result = todos.value;

    if (activeTab.value === "progress") {
        result = result.filter((t) => !t.done);
    } else if (activeTab.value === "monthly") {
        result = result.filter((t) => t.is_monthly);
    }

    if (isSearching.value) {
        result = result.filter((t) => t.text.toLowerCase().includes(normalizedSearch.value));
    }

    return result;
});

const tabCounts = computed(() => ({
    all: todos.value.length,
    progress: todos.value.filter((t) => !t.done).length,
    done: todos.value.filter((t) => t.done).length,
    monthly: todos.value.filter((t) => t.is_monthly).length,
}));

const emptyIcon = computed(() => {
    if (isSearching.value) return "solar:magnifer-bug-line-duotone";
    if (activeTab.value === "monthly") return "solar:check-circle-bold";
    if (activeTab.value === "progress") return "solar:clock-circle-bold";
    return "solar:inbox-archive-line-duotone";
});

const emptyTitle = computed(() => {
    if (isSearching.value) return "Catatan tidak ditemukan";
    if (activeTab.value === "monthly") return "Belum ada yang selesai";
    if (activeTab.value === "progress") return "Tidak ada dalam progress";
    return "Belum ada catatan";
});

const emptyDesc = computed(() => {
    if (isSearching.value) {
        return `Tidak ada catatan yang cocok dengan "${debouncedsearch.value.trim()}".`;
    }
    if (activeTab.value === "monthly") return "Selesaikan tugasmu untuk melihatnya di sini";
    if (activeTab.value === "progress") return "Semua tugasmu sudah selesai!";
    return "Tulis todo baru di atas untuk memulai";
});

const setActiveTabs = (value: "all" | "progress" | "monthly") => {
    activeTab.value = value;
};

const addTodo = async (newTitle: string, newDescription: string, newType: string) => {
    const text = newTitle.trim();
    if (!text || isAdding.value) return;

    isAdding.value = true;
    try {
        await todoStore.addTodo(text, newType === "plan");
    } catch (err) {
        console.error("Failed to add todo:", err);
    } finally {
        isAdding.value = false;
    }
};

const toggleTodo = async (id: string) => {
    await todoStore.toggleTodo(id);
};

const removeTodo = async (id: string) => {
    await todoStore.removeTodo(id);
};

await useAsyncData("todos-data", () => todoStore.getTodosByUserId(), {
    lazy: true,
    dedupe: "defer",
    server: false,
});
</script>
