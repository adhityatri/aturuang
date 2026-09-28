<script setup lang="ts">
const items = [
    { name: "journal-trade-page", icon: "solar:history-linear", label: "Journal" },
    { name: "transactions-page", icon: "solar:history-linear", label: "History" },
    { name: "improve-page", icon: "solar:chat-round-dots-linear", label: "Feedback" },
    { name: "todo-page", icon: "solar:checklist-minimalistic-linear", label: "Notes" },
];
</script>

<template>
    <div class="flex flex-col gap-4">
        <app-title-page dark>Menu</app-title-page>

        <div class="grid grid-cols-4 px-4 gap-4">
            <div v-for="item in items" :key="item.name">
                <nuxt-link :to="{ name: item.name }">
                    <div
                        class="flex flex-col gap-2 ring-1 ring-dark/20 rounded-4xl corner-based p-2 text-dark items-center justify-center"
                    >
                        <span
                            class="flex size-8 items-center justify-center rounded-xl bg-accent-green text-dark"
                        >
                            <UIcon :name="item.icon" class="text-xl" />
                        </span>

                        <p class="text-sm px-2 text-center">{{ item.label }}</p>
                    </div>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>
