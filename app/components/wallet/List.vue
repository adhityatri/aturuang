<template>
  <div class="w-full flex flex-col gap-4 mb-4 overflow-hidden">
    <template v-if="isLoading">
      <div class="flex justify-between items-center">
        <USkeleton class="h-4 w-[150px] bg-neutral-500 rounded-2xl" />
        <USkeleton class="h-6 w-[150px] bg-neutral-500 rounded-2xl" />
      </div>

      <div class="grid grid-cols-2 gap-4 mt-4">
        <USkeleton class="h-[70px] bg-neutral-500 rounded-2xl" />
        <USkeleton class="h-[70px] bg-neutral-500 rounded-2xl" />
        <USkeleton class="h-[70px] bg-neutral-500 rounded-2xl" />
        <USkeleton class="h-[70px] bg-neutral-500 rounded-2xl" />
      </div>
    </template>
    <template v-else>
      <div
        class="flex justify-between items-center mb-2"
        :class="{ 'mb-0': isPages }"
      >
        <app-title-page v-if="!isPages">Kantong Saya</app-title-page>
        <USlideover
          v-model:open="openForm"
          :dismissible="true"
          :title="selectedWallet?.name || 'Kantong Baru'"
          side="bottom"
          :close="{ onClick: () => closeForm() }"
        >
          <UButton
            v-if="!isPages"
            variant="subtle"
            :ui="{
              base: 'bg-neutral-200 inset-shadow-sm inset-shadow-neutral-300 py-3 px-6 rounded-full ring-2 ring-white shadow-xl',
            }"
            icon="solar:add-square-linear"
          >
            Kantong Baru
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
      <div
        v-if="list.length > 0"
        class="grid grid-cols-2 gap-4 max-h-[270px] pb-4 overflow-x-hidden overflow-y-auto"
        :class="{ 'max-h-screen': isPages }"
      >
        <wallet-item :list="list" @selected="handleSelected" />
        <UButton
          v-if="!isPages"
          class="bg-primary inset-shadow-sm inset-shadow-primary-900/40 ring-2 ring-white px-4 py-3 rounded-xl shadow-lg shadow-neutral-400 flex flex-col items-center justify-center"
          @click="handleWallet()"
        >
          <div class="text-white tracking-wide font-medium">Lihat Semua</div>
        </UButton>
      </div>
      <div
        v-else
        class="bg-neutral-200 inset-shadow-sm inset-shadow-neutral-400 ring-4 ring-white rounded-xl py-8"
      >
        <div class="text-neutral-400 tracking-wide text-md text-center py-4">
          <p>Kamu belum mempunyai kantong</p>
          <p
            class="text-neutral-600 font-bold"
            @click="() => (openForm = true)"
          >
            Buat dahulu!
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { iWallets } from "~/types/wallets";

const props = defineProps({
  isPages: {
    type: Boolean,
    required: false,
    default: false,
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const walletStore = useWallets();
const openForm = shallowRef<boolean>(false);

const list = computed(() =>
  props.isPages ? walletStore.wallets : walletStore.wallets.slice(0, 3)
);

const selectedWallet = shallowRef<iWallets | null>(null);
const handleSelected = async (wallet: iWallets) => {
  selectedWallet.value = wallet;
  await navigateTo({ name: "wallet-detail", query: { id: wallet.id } });
};

const handleSubmit = async (value: { name: string; amount: number }) => {
  const payload = {
    name: value.name,
    amount: value.amount,
  };

  const response = shallowRef<any>(null);
  response.value = await walletStore.insert({ ...payload });
  
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

const router = useRouter();
const handleWallet = () => {
  router.push({ name: "wallets" });
};
</script>
