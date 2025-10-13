<template>
  <div
    class="w-[100%] p-2 flex gap-4 mb-4 overflow-x-auto"
  >
    <div
      v-for="wallet in walletStore.wallets"
      :key="wallet.id"
      class="bg-primary/30 px-4 py-3 rounded-xl shadow-lg shadow-neutral-300 min-w-[170px] snap-x"
      @click="handleSelected(wallet)"
    >
      <div class="flex flex-col h-full gap-1 justify-between items-end">
        <div
          class="text-[.87rem] line-clamp-2 font-medium text-neutral-800"
        >
          {{ wallet.name }}
        </div>
        <div class="text-primary font-bold tracking-wide">
          {{ useFormatPriceIntl(wallet.amount) }}
        </div>
      </div>
    </div>
    <USlideover
      v-model:open="openForm"
      :dismissible="true"
      :title="selectedWallet?.name || 'Kantong Baru'"
      side="bottom"
      :close="{ onClick: () => closeForm() }"
    >
      <UButton
        variant="subtle"
        :ui="{
          base: 'flex flex-col justify-center ring-2! ring-white shadow-lg leading-3 p-4 rounded-xl min-w-[150px]',
        }"
        icon="solar:add-square-linear"
      >
        Buat Kantong
      </UButton>
      <template #body>
        <wallet-form
          :name="selectedWallet?.name"
          :amount="selectedWallet?.amount"
          @close="closeForm"
          @submit="handleSubmit"
        />
      </template>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import type { iWallets } from "~/types/wallets";

const walletStore = useWallets();
const openForm = shallowRef<boolean>(false);

const selectedWallet = shallowRef<iWallets | null>(null);
const handleSelected = (wallet: iWallets) => {
  selectedWallet.value = wallet;
  openForm.value = true;
};

const handleSubmit = async (value: { name: string; amount: number }) => {
  const payload = {
...(selectedWallet.value ? { id: selectedWallet.value.id } : {}),
    name: value.name,
    amount: value.amount,
  };

  const response = shallowRef<any>(null);

  if (selectedWallet.value?.id) {
    response.value = await walletStore.updateWallet({ ...payload });
  } else {
    response.value = await walletStore.insert({ ...payload });
  }

  const error = response.value?.error;

  if (error) {
    useToast().add({
      title: "Update Kantong",
      description: error.message,
    });
    return;
  }

  useToast().add({
    title: "Update Kantong",
    description: "Kantong berhasil diupdate",
  });

  closeForm();
};

const closeForm = () => {
  selectedWallet.value = null;
  openForm.value = false;
  console.log("masuk sini");
};
</script>
