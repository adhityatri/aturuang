<template>
    <div class="bg-white overflow-auto w-full flex flex-col flex-1">
        <template v-if="loading">
            <div v-for="i in 3" :key="i" class="flex items-center gap-3 corner-based bg-white p-4">
                <USkeleton class="size-10 shrink-0 rounded-xl" />
                <div class="flex-1 space-y-2">
                    <USkeleton class="h-4 w-3/4" />
                    <USkeleton class="h-3 w-1/2" />
                </div>
                <USkeleton class="h-6 w-16 rounded-full" />
            </div>
        </template>

        <template v-else-if="todos.length > 0">
            <div
                v-for="todo in todos"
                :key="todo.id"
                class="flex items-center gap-3 corner-based shadow-sm shadow-base-color bg-white p-4 transition-all"
                :class="todo.done ? 'opacity-60' : ''"
            >
                <button
                    class="flex size-10 shrink-0 items-center justify-center corner-based transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    :class="
                        todo.done
                            ? 'bg-accent-green text-dark '
                            : 'bg-dark/6 text-transparent hover:bg-neutral-100'
                    "
                    @click="$emit('toggle', todo.id)"
                >
                    <UIcon v-if="todo.done" name="solar:check-read-bold" class="text-lg" />
                </button>

                <div class="min-w-0 flex-1">
                    <p
                        class="text-sm font-bold text-dark leading-5"
                        :class="todo.done ? 'line-through text-neutral-400' : ''"
                    >
                        {{ todo.text }}
                    </p>
                    <p class="text-[10px] font-medium text-neutral-400 mt-1">
                        {{ formatDate(todo.created_at) }}
                    </p>
                </div>

                <button
                    v-if="!todo.done"
                    class="flex size-8 shrink-0 items-center justify-center corner-based bg-accent-red border-dark text-white transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    @click="$emit('remove', todo.id)"
                >
                    <UIcon name="solar:trash-bin-minimalistic-bold" class="text-sm" />
                </button>
            </div>
        </template>

        <div v-else class="flex flex-1 flex-col items-center justify-center gap-4">
            <div
                class="flex size-16 items-center justify-center rounded-2xl shadow-xl shadow-base-color border-dark bg-accent-green text-dark"
            >
                <UIcon :name="emptyIcon" class="text-3xl" />
            </div>
            <div class="text-center">
                <p class="text-lg font-black text-dark">
                    {{ emptyTitle }}
                </p>
                <p class="mt-1 text-md text-neutral-400">
                    {{ emptyDesc }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { iTodo } from "~/types/todo";

defineProps<{
    todos: iTodo[];
    loading: boolean;
    emptyIcon: string;
    emptyTitle: string;
    emptyDesc: string;
}>();

defineEmits<{ toggle: [id: string]; remove: [id: string] }>();

const formatDate = (dateStr: string) => {
    return useDateFormat(dateStr, "DD MMM YYYY | HH:mm", { locales: "id-ID" });
};
</script>
