<template>
  <UForm
    class="w-full z-1 mt-0!"
    :schema="trackerSchema"
    :state="state"
    @submit="onSubmit"
  >
    <app-category-display />

    <UBanner
      v-if="!isReady"
      color="neutral"
      icon="i-lucide-info"
      title="Kamu belum punya kantong. Buat sekarang!"
      class="mb-4"
    />

    <money-tracker-form-image />
    <USeparator
      label="Input Manual"
      class="my-4"
      color="info"
      size="sm"
      :ui="{
        label: 'text-sm text-neutral-600',
        border: 'border-neutral-300',
      }"
    />
    <category-display
      :selected-category="selectedCategory"
      @select="selectCategory"
    />

    <div class="flex gap-4 mt-4">
      <UFormField label="Kantong" name="wallet_id" class="w-[120px]">
        <USelect
          v-model="state.wallet_id"
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
      <UFormField label="Jumlah" name="amount" class="mb-4 flex-1">
        <UInputNumber
          v-model="state.amount"
          orientation="vertical"
          hide-buttons
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
    </div>

    <UFormField label="Keterangan (Optional)" name="notes" class="w-full my-4">
      <UTextarea
        v-model="state.notes"
        placeholder="ex: Membeli makanan, dll."
        size="xl"
        type="text"
        class="w-full"
      />
    </UFormField>

    <UButton
      block
      :disabled="!isReady"
      size="xl"
      color="primary"
      type="submit"
      :ui="{
        base: 'px-6 py-4 rounded-full mt-4',
      }"
    >
      Simpan
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as valibot from "valibot";
import type { iCategory } from "~/types/category";
import type { iWallets } from "~/types/wallets";

const emits = defineEmits(["close-on-submit"]);

const walletStore = useWallets();
const isReady = computed(() => walletStore.wallets.length > 0);

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

const selectedCategory = ref<iCategory>();
const selectCategory = (category: iCategory) => {
  selectedCategory.value = category;
};

type TrackerSchema = valibot.InferOutput<typeof trackerSchema>;

const state = reactive({
  category: 0,
  user: useSupabaseUser()?.value?.id || "",
  amount: 0,
  notes: "",
  wallet_id: "",
});

const onSubmit = async (event: FormSubmitEvent<TrackerSchema>) => {
  const { amount, notes } = event.data;

  if (!selectedCategory.value) {
    useToast().add({
      title: "Please select a category",
      color: "error",
    });
    return;
  }

  const transactionStore = useTransactionsStore();

  const response = await transactionStore.addTransactions({
    wallet_id: state.wallet_id,
    category_id: selectedCategory?.value?.id as number,
    amount,
    notes,
  });

  if (response.success) {
    emits("close-on-submit");
  }
};
</script>
