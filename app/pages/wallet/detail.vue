<template>
  <div class="flex flex-col flex-1 bg-neutral-200 gap-4">
    <app-nav-title title="Detail Kantong" @close="$router.back()" />

    <div class="px-4 py-8 flex gap-4">
      <div
        class="h-[100px] w-[100px] ring-2 ring-white shadow-xl shadow-neutral-300 inset-shadow-sm inset-shadow-neutral-300 bg-neutral-200 rounded-xl flex items-center justify-center"
      >
        <UIcon name="solar:mask-happly-linear" class="text-[3em]" />
      </div>
      <div class="flex flex-col justify-end">
        <h2 class="font-medium">
          {{ walletStore.detailWallet?.name }}
        </h2>
        <span class="text-neutral-600 text-[1.2rem]">{{
          useFormatPriceIntl(walletStore.detailWallet?.amount)
        }}</span>
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
      <!-- <transactions-all :source="transactionStore.walletTransactions" :is-all="true" /> -->
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

callOnce(async () => await walletStore.getWalletById(id.value as string), {
  mode: "navigation",
});

const transactionStore = useTransactionsStore();
callOnce(
  async () =>
    await transactionStore.getTransactionsByWalletId(id.value as string),
  {
    mode: "navigation",
  }
);
</script>
