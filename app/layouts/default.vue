<template>
    <div class="relative flex flex-col flex-1 bg-dark">
        <UContainer as="main" class="flex flex-col flex-1 px-0">
            <slot />
            <money-tracker-create
                :is-open="transaction.isCreateOpen"
                @close="handleCreate(false)"
            />
        </UContainer>
        <button
            v-if="canCreate"
            class="fixed flex flex-col items-center justify-center rounded-2xl size-16 bottom-24 right-5 bg-accent-green text-dark hover:bg-accent-green/90 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all z-50"
            @click="handleCreate(true)"
        >
            <UIcon name="solar:add-square-bold" class="size-6 mb-0.5" />
            <span class="text-[10px] font-black uppercase tracking-wide leading-none"> Baru </span>
        </button>
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
    return currentRouter.value === "/";
});

const transaction = useTransactionsStore();
const handleCreate = (value: boolean) => {
    transaction.isCreateOpen = value;
};
</script>
