<template>
  <div class="bg-neutral-100 flex flex-col flex-1">
    <div
      v-if="transaction.aiLoading"
      class="flex flex-1 justify-center items-center"
    >
      <app-loader title="Menganalisa Struk" />
    </div>
    <div class="flex flex-col flex-1" v-else>
      <app-nav-title
        title="Review Transaksi"
        @close="$router.push({ name: 'homepage' })"
      />

      <div class="p-4">
        <div
          class="flex items-start justify-between p-4 main-shadow rounded-xl ring-2 ring-white shadow-lg"
        >
          <div class="flex flex-col">
            <h1 class="font-medium">
              {{ transaction.aiResponse?.merchantName }}
            </h1>
            <div class="text-sm">{{ transaction.aiResponse?.date }}</div>
          </div>
          <div class="flex gap-1">
            <UBadge
              class="flex"
              :color="
                transaction.aiResponse?.type === 'INCOME' ? 'success' : 'error'
              "
            >
              {{
                transaction.aiResponse?.type === "INCOME"
                  ? "Pemasukan"
                  : "Pengeluaran"
              }}
            </UBadge>
            <UBadge color="info">
              {{ transaction.aiResponse?.global_category }}
            </UBadge>
          </div>
        </div>
      </div>

      <div class="p-4 flex flex-1 flex-col gap-2">
        <h3 class="font-medium">Detail Item</h3>
        <div
          class="p-4 rounded-xl ring-2 ring-white bg-neutral-100 shadow-lg shadow-neutral-200"
        >
          <div
            v-for="item in transaction.aiResponse?.items"
            :key="item.description"
            class="flex justify-between items-center"
          >
            <p class="lowercase">{{ item.description }}</p>
            <div
              class="flex-1 mx-2 border-b border-dotted border-neutral-400"
            />
            <p class="text-red-500 text-sm">
              {{ useFormatPriceIntl(item.amount) }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Kantong" name="wallet_id" class="my-4">
            <USelect
              v-model="walletId"
              :items="walletList"
              size="xl"
              :ui="{
                base: 'px-6 py-4 rounded-full w-full',
                trailingIcon: 'h-[20px] w-[20px]',
                content:
                  'main-shadow rounded-2xl mt-1 ring-2 ring-white shadow-lg shadow-neutral-300 w-full',
              }"
              trailing-icon="i-lucide-wallet"
              placeholder="Kantong"
            />
          </UFormField>
          <UFormField label="Kategori" name="category_id" class="my-4">
            <USelect
              v-model="categoryId"
              :items="categoryList"
              size="xl"
              :ui="{
                base: 'px-6 py-4 rounded-full w-full',
                trailingIcon: 'h-[20px] w-[20px]',
                content:
                  'main-shadow rounded-2xl mt-1 ring-2 ring-white shadow-lg shadow-neutral-300 w-full',
              }"
              trailing-icon="i-lucide-wallet"
              placeholder="Kantong"
            />
          </UFormField>
        </div>
      </div>

      <UBadge
        class="m-4 flex items-start gap-2 rounded-xl px-2 py-3 bg-neutral-300 text-primary"
      >
        <UIcon name="i-lucide-alert-octagon" size="1.5rem" />
        Cek Kembali Data Anda, Pastikan Data yang Anda Masukkan Benar!
      </UBadge>

      <div class="p-4 bg-white">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-xs tracking-wider font-bold text-neutral-500">
              TOTAL
            </h3>
            <h1 class="font-bold text-xl">
              {{ useFormatPriceIntl(totalAmount) }}
            </h1>
          </div>
          <UButton
            size="xl"
            :disabled="!isReady"
            color="primary"
            :ui="{
              base: 'px-6 py-4 rounded-full mt-4',
            }"
            trailing-icon="solar:check-square-bold-duotone"
            @click="handleSave"
          >
            Simpan
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { iCategory } from "~/types/category";
import type { iWallets } from "~/types/wallets";

definePageMeta({
  name: "new-transaction-page",
});

const transaction = useTransactionsStore();
const categoryStore = useCategory();
const walletStore = useWallets();

const walletId = ref<string>("");
const walletList = computed(() => {
  return Array.isArray(walletStore.wallets)
    ? walletStore.wallets.map((wallet: iWallets) => ({
        label: useCapitalize(wallet.name),
        value: wallet.id,
      }))
    : [];
});

const selectedCategory = computed(() =>
  categoryStore.categories.find(
    (category) => category.name === transaction.aiResponse?.global_category
  )
);

const categoryId = ref<string>(String(selectedCategory.value?.id ?? ""));
const categoryList = computed(() => {
  return Array.isArray(categoryStore.categories)
    ? categoryStore.categories.map((category: iCategory) => ({
        label: useCapitalize(category.name),
        value: category.id,
      }))
    : [];
});

if (!transaction.aiResponse && !transaction.aiLoading) {
  navigateTo({ name: "homepage" });
}

const totalAmount = computed(() =>
  transaction.aiResponse?.items.reduce((acc, item) => acc + item.amount, 0)
);

const isReady = computed(() => walletId.value && categoryId.value);

const handleSave = async () => {
  const transactionStore = useTransactionsStore();

  const response = await transactionStore.addTransactions({
    wallet_id: walletId.value,
    category_id: Number(categoryId.value),
    amount: totalAmount.value as number,
    notes: transaction.aiResponse?.merchantName,
  });

  if (response.success) {
    navigateTo({ name: "homepage" });
  }
};
</script>
