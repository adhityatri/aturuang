<template>
    <div class="relative flex flex-col flex-1 bg-dark">
        <UContainer as="main" class="flex flex-col flex-1 px-0">
            <slot />
            <money-tracker-create
                :is-open="transaction.isCreateOpen"
                @close="handleCreate(false)"
            />
        </UContainer>

        <UButton
            v-if="canCreate"
            class="fixed bottom-24 right-6 z-50 p-4 rounded-4xl corner-squircle shadow-xl bg-accent-green text-dark hover:scale-105 active:bg-accent-green/70 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all"
            icon="solar:add-square-bold"
            @click="handleCreate(true)"
        />
        <app-footer v-if="!isDesktop" />
    </div>
</template>

<script setup lang="ts">
const { isDesktop } = useDevice();

const router = useRouter();
const currentRouter = computed(() => {
    return router.currentRoute.value.path;
});
const canCreate = computed(() => {
    return currentRouter.value === "/" || currentRouter.value === "/activity";
});

const transaction = useTransactionsStore();
const handleCreate = (value: boolean) => {
    transaction.isCreateOpen = value;
};
</script>
