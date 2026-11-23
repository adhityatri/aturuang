<template>
    <div class="relative flex min-h-dvh flex-1 flex-col overflow-hidden main-bg">
        <div class="relative z-1">
            <app-nav-title title="Detail Kantong" @close="$router.back()" />

            <!-- Wallet Hero -->
            <section class="px-4 pb-6 pt-4">
                <div
                    class="flex flex-col relative overflow-hidden shadow-xl shadow-base-color corner-based bg-accent-green min-h-50"
                >
                    <div class="flex justify-end bg-dark/15 p-4">
                        <div class="flex items-center -space-x-1.5">
                            <template v-if="walletStore.members?.length">
                                <UAvatar alt="Owner" size="md" class="ring-4 ring-accent-green" />
                                <template
                                    v-for="member in walletStore?.members?.slice(0, 3)"
                                    :key="member.id"
                                >
                                    <UAvatar
                                        :alt="member.email"
                                        size="md"
                                        class="ring-4 ring-accent-green"
                                    />
                                </template>
                                <div
                                    v-if="walletStore.members.length > 3"
                                    class="relative flex size-8 items-center justify-center rounded-full bg-dark text-[10px] font-bold text-white ring-4 ring-accent-green"
                                >
                                    +{{ walletStore.members.length - 3 }}
                                </div>
                            </template>

                            <wallet-member class="z-2" />
                        </div>
                    </div>

                    <div class="flex flex-col p-6">
                        <p class="truncate text-xl font-black leading-tight text-dark">
                            {{ walletStore.detailWallet?.name || "Kantong" }}
                        </p>

                        <div class="flex-1 mt-2">
                            <p class="capitalize">saldo</p>
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

                <div class="my-2 flex items-center gap-4">
                    <wallet-edit @click="handleEditWallet" />
                    <wallet-move @refresh="handleRefresh" />
                </div>
                <!-- <div
                    class="flex flex-col relative overflow-hidden corner-based bg-accent-green shadow-xl shadow-base-color px-4"
                >
                    <div class="flex flex-col py-6">
                        <div class="flex justify-between items-center">
                            <div class="flex flex-col gap-1">
                                <p class="truncate text-xl font-black leading-tight text-dark">
                                    {{ walletStore.detailWallet?.name || "Kantong" }}
                                </p>
                            </div>
                        </div>

                        <div class="flex-1 mt-2">
                            <p class="capitalize">saldo</p>
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
                    <div class="mb-4 flex items-center gap-4">
                        <wallet-edit @click="handleEditWallet" />
                        <wallet-move @refresh="handleRefresh" />
                        <div class="flex items-center -space-x-1.5">
                            <template v-if="walletStore.members?.length">
                                <UAvatar alt="Owner" size="xl" class="ring-2 ring-accent-green" />
                                <template
                                    v-for="member in walletStore?.members?.slice(0, 3)"
                                    :key="member.id"
                                >
                                    <UAvatar
                                        :alt="member.email"
                                        size="xl"
                                        class="ring-2 ring-accent-green"
                                    />
                                </template>
                            </template>

                            <wallet-member />
                        </div>
                    </div>
                </div> -->
            </section>
        </div>

        <!-- Transactions Panel -->
        <main
            class="relative z-1 flex flex-1 flex-col border-t-2 border-dark/10 rounded-t-[2rem] bg-dark/4 p-4"
        >
            <div class="mb-4 flex items-center justify-between">
                <h2 class="text-lg font-black text-dark">Riwayat Transaksi</h2>

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
                        <UIcon name="solar:banknote-linear" class="text-3xl" />
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

useAsyncData("fetch-wallet-member", () => walletStore.getMembers(id.value?.toString() ?? ""), {
    dedupe: "defer",
    server: true,
    lazy: true,
});

const handleEditWallet = () => {
    walletStore.isEditOpen = true;
};

const handleMemberClick = () => {
    walletStore.isMemberOpen = true;
    walletStore.getMembers(id.value as string);
};

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
</script>
