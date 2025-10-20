<template>
  <div class="w-[100%] ring-1 ring-orange-500 p-2 flex gap-4 mb-4 overflow-x-auto">
    <div
      v-for="wallet in walletStore.wallets"
      :key="wallet.id"
      class="bg-neutral-300 ring-2 ring-neutral-100 px-4 py-3 rounded-xl shadow-lg shadow-neutral-300 min-w-[170px]"
      @click="handleSelected(wallet)"
    >
      <div class="flex flex-col gap-1 justify-between items-end ring-1">
        <div class="text-[.87rem] line-clamp-2 ring-1 ring-blue tracking-wider font-bold">
          {{ wallet.name }}
        </div>
        <div class="text-primary">
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

<script lang="ts" setup>
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
};
</script>
