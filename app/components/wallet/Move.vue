<template>
  <USlideover
    v-model:open="isOpen"
    :dismissible="false"
    title="Pindahkan Uang"
    side="bottom"
    :close="{ onClick: () => handleClose() }"
  >
    <UButton
      class="rounded-md ring-2 ring-white bg-red-400 shadow-lg text-white inset-shadow-sm inset-shadow-red-900 active:bg-red-500"
      size="xl"
      @click="handleClick"
    >
      <UIcon class="text-sm" name="solar:move-to-folder-linear" />
      <span class="text-xs">Pindah</span>
    </UButton>
    <template #body>
      <div class="flex flex-col gap-4">
        <div
          class="place-self-center w-[250px] h-[120px] bg-neutral-30 ring-2 ring-white rounded-xl shadow-neutral-400 shadow-lg text-primary flex flex-col items-start justify-center p-2 inset-shadow-sm inset-shadow-neutral-300"
        >
          <UIcon name="solar:wallet-2-bold" class="text-[2.5rem] mb-2" />

          <span class="line-clamp-1 font-medium">
            {{ walletStore.detailWallet?.name }}
          </span>
          <span class="text-sm font-medium">
            {{ useFormatPriceIntl(walletStore.detailWallet?.amount || 0) }}
          </span>
        </div>

        <UForm
          class="w-full z-1 mt-10"
          :schema="schema"
          :state="state"
          @submit="onSubmit"
        >
          <UFormField
            label="Pilih Kantong Tujuan"
            name="wallet_id"
            class="w-full my-4"
          >
            <USelect
              v-model="state.wallet_id"
              :items="walletList"
              size="xl"
              class="w-full"
              placeholder="Pilih Kantong Tujuan"
            />
          </UFormField>

          <UFormField label="Jumlah" name="amount" class="w-full mb-4">
            <UInputNumber
              v-model="state.amount"
              orientation="vertical"
              hide-buttons
              size="xl"
              :format-options="{
                style: 'currency',
                currency: 'IDR',
                currencyDisplay: 'narrowSymbol',
                compactDisplay: 'short',
                maximumFractionDigits: 0,
                currencySign: 'standard',
              }"
              class="w-full"
              :ui="{
                base: 'px-6 py-4 rounded-full',
                increment: 'hidden',
                decrement: 'hidden',
              }"
            />
          </UFormField>

          <UButton
            block
            class="mt-8"
            size="xl"
            color="primary"
            type="submit"
            :ui="{
              base: 'px-6 py-4 rounded-full',
            }"
          >
            Pindahkan
          </UButton>
        </UForm>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import * as valibot from "valibot";
import type { iWallets } from "~/types/wallets";

const emit = defineEmits(["click", "refresh"]);

const isOpen = shallowRef<boolean>(false);
const walletStore = useWallets();

await walletStore.getWallets();

const exceptSourceWallet = computed(() =>
  walletStore.wallets.filter(
    (wallet: iWallets) => wallet.id !== walletStore.detailWallet?.id
  )
);

const walletList = computed(() => {
  return Array.isArray(exceptSourceWallet.value)
    ? exceptSourceWallet.value?.map((wallet: iWallets) => ({
        label: useCapitalize(wallet.name),
        value: wallet.id,
      }))
    : [];
});

const handleClick = () => {
  isOpen.value = true;
  emit("click");
};

const handleClose = () => {
  isOpen.value = false;
};

const schema = valibot.required(
  valibot.object({
    wallet_id: valibot.pipe(valibot.string()),
    amount: valibot.pipe(
      valibot.number(),
      valibot.minValue(100, "Amount must be positive")
    ),
  })
);

const state = reactive({
  wallet_id: "",
  amount: 0,
});

const transactionStore = useTransactionsStore();

const onSubmit = async () => {
  const toWallet = exceptSourceWallet.value.find(
    (wallet: iWallets) => wallet.id === state.wallet_id
  );

  const fromPayload = {
    wallet_id: walletStore.detailWallet!.id,
    category_id: 23,
    notes: "Pemindahan dana ke kantong " + toWallet?.name,
    amount: state.amount,
  };

  const toPayload = {
    wallet_id: state?.wallet_id,
    category_id: 24,
    notes: "Pemindahan dana dari kantong " + walletStore.detailWallet?.name,
    amount: state.amount,
  };

  const fromResponse = await transactionStore.addTransactions(fromPayload);
  if (fromResponse?.error) {
    return;
  }

  const toResponse = await transactionStore.addTransactions(toPayload);
  if (toResponse?.error) {
    return;
  }

  useToast().add({
    title: "Pindah Uang",
    description: "Pemindahan dana berhasil",
    color: "success",
  });

  emit("refresh");
  handleClose();
};
</script>
