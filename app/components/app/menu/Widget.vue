<script setup lang="ts">
const items = [
    { name: "debt-page", icon: "solar:hand-money-broken", label: "Utang Piutang" },
    { name: "transactions-page", icon: "solar:history-linear", label: "Riwayat" },
    { name: "improve-page", icon: "solar:chat-round-dots-linear", label: "Feedback" },
    { name: "note-page", icon: "solar:checklist-minimalistic-linear", label: "Catatan" },
];
</script>

<template>
    <div class="flex flex-col gap-4">
        <app-title-page dark>Menu</app-title-page>

        <div class="flex flex-wrap flex-1 gap-2">
            <div v-for="item in items" :key="item.name" class="w-20% h-full flex flex-col flex-1">
                <nuxt-link
                    :to="{ name: item.name }"
                    class="flex flex-col items-center gap-2 h-full"
                >
                    <div
                        class="h-1/2 p-2 bg-accent-green corner-based shadow-lg shadow-based-color w-fit flex"
                    >
                        <UIcon
                            :name="item.icon"
                            class="flex size-6 items-center justify-center text-dark"
                        />
                    </div>
                    <div class="text-dark active:bg-accent-green/10">
                        <p class="text-xs px-2 text-center">{{ item.label }}</p>
                    </div>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>
