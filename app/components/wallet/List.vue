<template>
  <div class="w-[100%] p-2 flex flex-col gap-4 mb-4 overflow-hidden">
    <div class="flex justify-between items-center mb-2">
      <app-title-page>Kantong Saya</app-title-page>
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
            base: 'flex justify-center ring-2! ring-white shadow-lg leading-3 py-4 px-8 rounded-full min-w-[150px]',
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
    <div class="grid grid-cols-2 gap-4 max-h-[270px] pb-4 overflow-auto">
      <div
        v-for="wallet in list"
        :key="wallet.id"
        class="bg-neutral-200 px-4 py-3 rounded-xl ring-2 ring-white shadow-lg shadow-neutral-300 min-w-[170px] snap-x"
        @click="handleSelected(wallet)"
      >
        <div class="flex flex-col h-full gap-1 justify-between items-end">
          <div class="text-[.87rem] line-clamp-2 font-medium text-neutral-800">
            {{ wallet.name }}
          </div>
          <div class="text-primary font-bold tracking-wide">
            {{ useFormatPriceIntl(wallet.amount) }}
          </div>
        </div>
      </div>
      <div
        class="bg-primary px-4 py-3 rounded-xl shadow-lg shadow-neutral-300 flex flex-col items-center justify-center"
      >
        <div class="text-neutral-200 tracking-wide font-medium">Lihat Semua</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { iWallets } from "~/types/wallets";

const walletStore = useWallets();
const openForm = shallowRef<boolean>(false);

const list = computed(() => walletStore.wallets.slice(0, 5));

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
