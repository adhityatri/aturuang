<template>
  <UForm
    class="w-full z-1"
    :schema="trackerSchema"
    :state="state"
    @submit="onSubmit"
  >
    <UFormField label="Pilih Wallet" name="wallet_id" class="w-[100%] mb-4">
      <USelect
        v-model="state.wallet_id"
        :items="walletList"
        size="xl"
        class="w-[100%]"
      />
    </UFormField>
    <UFormField label="Keterangan" name="notes" class="w-[100%] mb-4">
      <UInput v-model="state.notes" size="xl" type="text" class="w-[100%]" />
    </UFormField>
    <UFormField label="Jumlah" name="amount" class="w-[100%] mb-4">
      <UInputNumber
        orientation="vertical"
        hide-buttons
        v-model="state.amount"
        size="xl"
        :format-options="{
          style: 'currency',
          currency: 'IDR',
          currencyDisplay: 'narrowSymbol',
          compactDisplay: 'short',
          maximumFractionDigits: 0,
          currencySign: 'standard',
        }"
        class="w-[100%]"
        :ui="{
          base: 'px-6 py-4 rounded-full',
          increment: 'hidden',
          decrement: 'hidden',
        }"
      />
    </UFormField>
    <UFormField label="Kategori" name="category" class="w-[100%] mb-4">
      <USelect
        v-model="state.category"
        :items="categoryList"
        size="xl"
        class="w-[100%]"
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
      Simpan
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as valibot from "valibot";
import type { iWallets } from "~/types/wallets";

const emits = defineEmits(["close-on-submit"]);

interface Category {
  id: number;
  name: string;
}

const category = useCategory();
const walletStore = useWallets();

const categoryList = computed(() =>
  Array.isArray(category.value)
    ? category.value.map((cat: Category) => ({
        label: useCapitalize(cat.name),
        value: cat.id,
      }))
    : []
);

const walletList = computed(() => {
  return Array.isArray(walletStore.wallets)
    ? walletStore.wallets.map((wallet: iWallets) => ({
        label: useCapitalize(wallet.name),
        value: wallet.id,
      }))
    : [];
});

const trackerSchema = valibot.required(
  valibot.object({
    category: valibot.pipe(valibot.number()),
    user: valibot.pipe(
      valibot.string(),
      valibot.minLength(4, "Must be at least 4 characters")
    ),
    amount: valibot.pipe(
      valibot.number(),
      valibot.minValue(100, "Amount must be positive")
    ),
    notes: valibot.optional(valibot.string()),
    wallet_id: valibot.pipe(valibot.string()),
  })
);

type TrackerSchema = valibot.InferOutput<typeof trackerSchema>;

const state = reactive({
  category: 0,
  user: useSupabaseUser()?.value?.id || "",
  amount: 0,
  notes: "",
  wallet_id: "",
});

const onSubmit = async (event: FormSubmitEvent<TrackerSchema>) => {
  const { category, user, amount, notes } = event.data;

  const transactionStore = useTransactionsStore();

  const response = await transactionStore.addTransactions({
    wallet_id: state.wallet_id,
    category_id: category,
    amount,
    notes,
  });

  if (response.success) {
    emits("close-on-submit");
  }
};
</script>
