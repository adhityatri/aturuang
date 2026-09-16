<template>
    <div class="flex-1 rounded-t-4xl bg-white-smooth px-6 py-6 overflow-auto">
        <div class="mt-4 flex flex-1 flex-col gap-3">
            <!-- Loading Skeleton -->
            <template v-if="loading">
                <div
                    v-for="i in 3"
                    :key="i"
                    class="flex items-center gap-3 corner-squircle bg-white p-4"
                >
                    <USkeleton class="size-10 shrink-0 rounded-xl" />
                    <div class="flex-1 space-y-2">
                        <USkeleton class="h-4 w-3/4" />
                        <USkeleton class="h-3 w-1/2" />
                    </div>
                    <USkeleton class="h-6 w-16 rounded-full" />
                </div>
            </template>

            <!-- Todo Items -->
            <template v-else-if="todos.length > 0">
                <div
                    v-for="todo in todos"
                    :key="todo.id"
                    class="flex items-center gap-3 corner-squircle bg-white p-4 transition-all"
                    :class="todo.done ? 'opacity-60' : ''"
                >
                    <!-- Checkbox -->
                    <button
                        class="flex size-10 shrink-0 items-center justify-center corner-squircle ring-1 ring-dark transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        :class="
                            todo.done
                                ? 'bg-accent-green text-dark '
                                : 'bg-white text-transparent hover:bg-neutral-100'
                        "
                        @click="$emit('toggle', todo.id)"
                    >
                        <UIcon v-if="todo.done" name="solar:check-read-bold" class="text-lg" />
                    </button>

                    <!-- Content -->
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

                    <!-- Status Badge -->
                    <!-- <span
                        class="shrink-0 corner-squircle ring-1 ring-dark px-3 py-2 text-[10px] font-black uppercase"
                        :class="
                            todo.done
                                ? 'bg-accent-green/20 text-dark'
                                : 'bg-accent-yellow/20 text-dark'
                        "
                    >
                        {{ todo.done ? "Done" : "Progress" }}
                    </span> -->

                    <!-- Delete -->
                    <button
                        class="flex size-8 shrink-0 items-center justify-center corner-squircle bg-accent-red border-dark text-white transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        @click="$emit('remove', todo.id)"
                    >
                        <UIcon name="solar:trash-bin-minimalistic-bold" class="text-sm" />
                    </button>
                </div>
            </template>

            <!-- Empty State -->
            <div
                v-else
                class="flex flex-1 flex-col items-center justify-center gap-4 rounded-4xl bg-white-smooth p-8"
            >
                <div
                    class="flex size-16 items-center justify-center rounded-2xl border-2 border-dark bg-accent-yellow text-dark shadow-[3px_3px_0_#111]"
                >
                    <UIcon :name="emptyIcon" class="text-3xl" />
                </div>
                <div class="text-center">
                    <p class="text-sm font-black uppercase text-dark">
                        {{ emptyTitle }}
                    </p>
                    <p class="mt-1 text-xs text-neutral-400">
                        {{ emptyDesc }}
                    </p>
                </div>
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
