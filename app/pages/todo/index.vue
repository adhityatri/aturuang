<template>
    <div class="relative flex min-h-dvh flex-1 flex-col main-bg">
        <main class="flex flex-1 flex-col pt-6">
            <!-- Header -->
            <div class="mb-6 px-6">
                <app-title-page>
                    Todo
                    <template #subtitle>
                        <span class="text-white text-md">{{ todos.length }} tugas tercatat</span>
                    </template>
                </app-title-page>
            </div>

            <!-- Input -->
            <div class="flex px-6 gap-2">
                <div class="flex-1">
                    <UInput
                        v-model="newTodo"
                        placeholder="Tulis todo baru..."
                        size="xl"
                        class="w-full"
                        :ui="{
                            base: 'corner-squircle! rounded-xl! px-4 py-3 text-dark font-medium',
                        }"
                        @keyup.enter="addTodo"
                    />
                </div>
                <UButton
                    size="xl"
                    :loading="isAdding"
                    class="corner-squircle bg-accent-green px-6 font-black uppercase text-dark hover:bg-accent-green/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    icon="solar:add-circle-bold"
                    @click="addTodo"
                />
            </div>

            <!-- Tabs -->
            <div class="my-6 mx-6">
                <todo-tabs v-model="activeTab" :tabs="tabs" :counts="tabCounts" />
            </div>

            <!-- Todo List -->
            <todo-list
                ref="scrollComponent"
                :todos="filteredTodos"
                :loading="todoStore.loading"
                :empty-icon="emptyIcon"
                :empty-title="emptyTitle"
                :empty-desc="emptyDesc"
                class="flex-1 pb-22 overflow-auto"
                @toggle="toggleTodo"
                @remove="removeTodo"
            />
        </main>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ name: "todo-page" });
useHead({ title: "Todo List" });

const todoStore = useTodos();
const newTodo = ref("");
const isAdding = ref(false);
const activeTab = ref<"all" | "progress" | "done">("all");

const tabs = shallowRef([
    { label: "Semua", value: "all" as const },
    { label: "Progress", value: "progress" as const },
    { label: "Done", value: "done" as const },
]);

const todos = computed(() => todoStore.todos);

const filteredTodos = computed(() => {
    if (activeTab.value === "progress") return todos.value.filter((t) => !t.done);
    if (activeTab.value === "done") return todos.value.filter((t) => t.done);
    return todos.value;
});

const tabCounts = computed(() => ({
    all: todos.value.length,
    progress: todos.value.filter((t) => !t.done).length,
    done: todos.value.filter((t) => t.done).length,
}));

const emptyIcon = computed(() => {
    if (activeTab.value === "done") return "solar:check-circle-bold";
    if (activeTab.value === "progress") return "solar:clock-circle-bold";
    return "solar:note-text-bold";
});

const emptyTitle = computed(() => {
    if (activeTab.value === "done") return "Belum ada yang selesai";
    if (activeTab.value === "progress") return "Tidak ada dalam progress";
    return "Belum ada todo";
});

const emptyDesc = computed(() => {
    if (activeTab.value === "done") return "Selesaikan tugasmu untuk melihatnya di sini";
    if (activeTab.value === "progress") return "Semua tugasmu sudah selesai!";
    return "Tulis todo baru di atas untuk memulai";
});

const addTodo = async () => {
    const text = newTodo.value.trim();
    if (!text || isAdding.value) return;

    isAdding.value = true;
    try {
        await todoStore.addTodo(text);
        newTodo.value = "";
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
