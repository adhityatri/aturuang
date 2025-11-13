<template>
  <div class="flex flex-col flex-1 bg-gradient gap-4">
    <app-nav-title title="Detail Kantong" @close="$router.back()" />

    <div class="px-4 pt-8 flex gap-4">
      <div
        class="h-[100px] w-[100px] ring-2 ring-white shadow-xl main-shadow bg-neutral-200 rounded-xl flex items-center justify-center"
      >
        <UIcon name="solar:mask-happly-linear" class="text-[3em]" />
      </div>
      <div class="flex flex-col justify-end">
        <h2 class="font-medium text-neutral-200 tracking-wide">
          {{ walletStore.detailWallet?.name }}
        </h2>
        <app-privacy
          v-if="usePrivacyStore.isPrivacyAccepted"
          size="sm"
          color="primary"
        />
        <span v-else class="text-white text-[1.2rem]">
          {{ useFormatPriceIntl(walletStore.detailWallet?.amount) }}
        </span>

        <div class="py-4 flex gap-4">
          <wallet-edit @click="handleEditWallet" />
          <wallet-move @refresh="handleRefresh" />
          <!-- <UButton
            class=" rounded-md text-sm ring-2 ring-white bg-neutral-200 shadow-lg text-primary inset-shadow-sm inset-shadow-neutral-300 active:bg-neutral-300"
            size="xl"
          >
            Budget
          </UButton> -->
        </div>
      </div>
    </div>

    <div class="rounded-tl-2xl rounded-tr-2xl flex-1 p-4 bg-white">
      <div
        v-for="value in transactionStore.walletTransactions"
        :key="value.title"
      >
        <small class="uppercase text-neutral-400">{{ value.title }}</small>

        <transactions-item
          v-for="transaction in value.value"
          :key="transaction.id"
          :transaction="transaction"
          @click="navigateToTransactionDetail(transaction)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: "wallet-detail",
});

const route = useRoute();
const id = computed(() => route.query.id);

const { navigateToTransactionDetail } = useTransactionNavigation();

const walletStore = useWallets();
const usePrivacyStore = usePrivacy();

const { refresh: refreshWallet } = useAsyncData(
  "detail-wallet-page",
  () => walletStore.getWalletById(id.value as string),
  {
    lazy: true,
    dedupe: "defer",
    server: true,
  }
);

const transactionStore = useTransactionsStore();

const { refresh: refreshTransactions } = useAsyncData(
  "detail-wallet-transactions-page",
  () => transactionStore.getTransactionsByWalletId(id.value as string),
  {
    lazy: true,
    dedupe: "defer",
    server: true,
  }
);

const handleRefresh = () => {
  refreshWallet();
  refreshTransactions();
};

const handleEditWallet = () => {
  walletStore.isEditOpen = true;
};
</script>
