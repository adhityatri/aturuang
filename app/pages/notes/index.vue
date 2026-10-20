<template>
    <div class="flex flex-1 flex-col relative main-bg overflow-hidden">
        <div class="p-6 sticky top-0 main-bg">
            <app-title-page dark>
                Catatan Kita
                <template #subtitle>
                    <span class="text-md">{{ todos.length }} tugas tercatat</span>
                </template>
            </app-title-page>
        </div>

        <todo-tabs v-model="activeTab" :tabs="tabs" :counts="tabCounts" />

        <div class="flex h-[80dvh] overflow-y-auto pb-60">
            <todo-list
                ref="scrollComponent"
                :todos="filteredTodos"
                :loading="todoStore.loading"
                :empty-icon="emptyIcon"
                :empty-title="emptyTitle"
                :empty-desc="emptyDesc"
                class="rounded-b-4xl corner-squircle shadow-sm shadow-base-color"
                @toggle="toggleTodo"
                @remove="removeTodo"
            />
        </div>

        <div
            class="fixed bg-white bottom-[100px] left-6 right-6 rounded-4xl corner-squircle p-4 shadow-xl shadow-base-color ring-1 ring-dark/6 flex flex-col gap-4"
        >
            <UInput
                v-model="newTodo"
                placeholder="Tulis todo baru..."
                size="xl"
                class="w-full"
                :ui="{ base: 'corner-based rounded-xl px-4 py-3 text-dark font-medium' }"
                @keyup.enter="addTodo"
            />

            <div class="flex gap-4 justify-between">
                <UCheckbox
                    v-model="isMonthly"
                    indicator="hidden"
                    variant="card"
                    icon="solar:repeat-bold"
                    label="Bulanan"
                    class="corner-based bg-white text-dark shadow-xl shadow-base-color ring-1 ring-dark/8"
                    :ui="{ wrapper: 'flex flex-row gap-2' }"
                />
                <UButton
                    size="lg"
                    :loading="isAdding"
                    class="corner-based bg-accent-green px-6 font-black text-dark hover:bg-accent-green/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    @click="addTodo"
                    label="Simpan"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ name: "note-page" });
useHead({ title: "Catatan Kita" });

const todoStore = useTodos();
const newTodo = ref("");
const isAdding = ref(false);
const activeTab = ref<"all" | "progress" | "monthly">("all");
const isMonthly = ref(false);

const tabs = shallowRef([
    { label: "Semua", value: "all" as const },
    { label: "Progress", value: "progress" as const },
    { label: "Monthly", value: "monthly" as const },
]);

const todos = computed(() => todoStore.todos);

const filteredTodos = computed(() => {
    if (activeTab.value === "progress") return todos.value.filter((t) => !t.done);
    if (activeTab.value === "monthly") return todos.value.filter((t) => t.is_monthly);
    return todos.value;
});

const tabCounts = computed(() => ({
    all: todos.value.length,
    progress: todos.value.filter((t) => !t.done).length,
    done: todos.value.filter((t) => t.done).length,
    monthly: todos.value.filter((t) => t.is_monthly).length,
}));

const emptyIcon = computed(() => {
    if (activeTab.value === "monthly") return "solar:check-circle-bold";
    if (activeTab.value === "progress") return "solar:clock-circle-bold";
    return "solar:inbox-archive-line-duotone";
});

const emptyTitle = computed(() => {
    if (activeTab.value === "monthly") return "Belum ada yang selesai";
    if (activeTab.value === "progress") return "Tidak ada dalam progress";
    return "Belum ada catatan";
});

const emptyDesc = computed(() => {
    if (activeTab.value === "monthly") return "Selesaikan tugasmu untuk melihatnya di sini";
    if (activeTab.value === "progress") return "Semua tugasmu sudah selesai!";
    return "Tulis todo baru di atas untuk memulai";
});

const addTodo = async () => {
    const text = newTodo.value.trim();
    if (!text || isAdding.value) return;

    isAdding.value = true;
    try {
        await todoStore.addTodo(text, isMonthly.value);
        isMonthly.value = false;
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
