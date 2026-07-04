<template>
    <div class="relative flex min-h-dvh flex-1 flex-col overflow-hidden main-bg">
        <div class="relative z-1">
            <app-nav-title title="Detail Kantong" @close="$router.back()" />

            <!-- Wallet Hero -->
            <section class="px-4 pb-6 pt-4">
                <div class="relative overflow-hidden rounded-4xl bg-accent-green p-5">
                    <div class="relative z-1 flex items-start gap-4">
                        <div
                            class="flex size-24 shrink-0 items-center justify-center rounded-3xl bg-white-smooth text-dark"
                        >
                            <UIcon name="solar:mask-happly-linear" class="text-[3rem]" />
                        </div>

                        <div class="min-w-0 flex-1">
                            <p class="text-[10px] font-black uppercase tracking-[0.24em] text-dark">
                                Kantong
                            </p>

                            <h1
                                class="truncate text-lg font-black uppercase leading-tight text-dark"
                            >
                                {{ walletStore.detailWallet?.name || "Kantong" }}
                            </h1>

                            <div class="mt-2">
                                <app-privacy
                                    v-if="usePrivacyStore.isPrivacyAccepted"
                                    size="sm"
                                    color="primary"
                                />

                                <p v-else class="text-xl font-black leading-none text-dark">
                                    {{ useFormatPriceIntl(walletStore.detailWallet?.amount || 0) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="relative z-1 mt-5 grid grid-cols-2 gap-3">
                        <wallet-edit @click="handleEditWallet" />
                        <wallet-move @refresh="handleRefresh" />
                    </div>
                </div>
            </section>
        </div>

        <!-- Transactions Panel -->
        <main class="relative z-1 flex flex-1 flex-col rounded-t-[2rem] bg-white-smooth p-4">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="text-lg font-black uppercase text-dark">Riwayat Transaksi</h2>

                <UButton
                    icon="solar:refresh-linear"
                    color="neutral"
                    variant="ghost"
                    :ui="{
                        base: 'flex size-11 items-center justify-center rounded-xl bg-accent-green p-0 text-dark ',
                    }"
                    @click="handleRefresh"
                />
            </div>

            <template v-if="transactionStore.walletTransactions.length === 0">
                <div
                    class="flex flex-1 flex-col items-center justify-center rounded-2xl border-[1.5px] border-dashed border-dark bg-neutral-50 px-6 py-10 text-center"
                >
                    <div
                        class="mb-4 flex size-16 items-center justify-center rounded-full bg-accent-green text-dark"
                    >
                        <UIcon name="solar:receipt-linear" class="text-3xl" />
                    </div>

                    <h3 class="text-sm font-black uppercase text-dark">Belum Ada Transaksi</h3>

                    <p class="mt-2 max-w-[240px] text-xs font-medium leading-5 text-secondary">
                        Transaksi yang memakai kantong ini akan muncul di halaman ini.
                    </p>
                </div>
            </template>

            <template v-else>
                <div class="flex flex-col gap-5">
                    <div
                        v-for="value in transactionStore.walletTransactions"
                        :key="value.title"
                        class="flex flex-col gap-2"
                    >
                        <div class="flex items-center justify-between">
                            <small
                                class="text-[10px] font-black uppercase tracking-[0.2em] text-dark"
                            >
                                {{ value.title }}
                            </small>

                            <span
                                class="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold text-dark"
                            >
                                {{ value.value.length }} item
                            </span>
                        </div>

                        <transactions-item
                            v-for="transaction in value.value"
                            :key="transaction.id"
                            :transaction="transaction"
                            @click="navigateToTransactionDetail(transaction)"
                        />
                    </div>
                </div>
            </template>
        </main>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ name: "wallet-detail" });

const route = useRoute();
const id = computed(() => route.query.id);

const { navigateToTransactionDetail } = useTransactionNavigation();

const walletStore = useWallets();
const usePrivacyStore = usePrivacy();

const { refresh: refreshWallet } = useAsyncData(
    "detail-wallet-page",
    () => walletStore.getWalletById(id.value as string),
    { lazy: true, dedupe: "defer", server: true },
);

const transactionStore = useTransactionsStore();

const { refresh: refreshTransactions } = useAsyncData(
    "detail-wallet-transactions-page",
    () => transactionStore.getTransactionsByWalletId(id.value as string),
    { lazy: true, dedupe: "defer", server: true },
);

const handleRefresh = () => {
    refreshWallet();
    refreshTransactions();
};

const handleEditWallet = () => {
    walletStore.isEditOpen = true;
};
</script>
