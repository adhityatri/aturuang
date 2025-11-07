<template>
  <div class="px-4 py-12 flex flex-col gap-4">
    <div
      class="place-self-center w-[250px] h-[150px] bg-primary-700 ring-4 rounded-xl shadow-neutral-400 shadow-lg text-white flex flex-col items-start justify-center p-4 leading-7"
    >
      <UIcon name="solar:wallet-2-bold" class="text-[2.5rem] mb-2" />
      <span class="text-[1.1rem] line-clamp-1 font-medium">
        {{ state?.name || "No Wallet" }}
      </span>
      <span class="text-[1rem] font-medium">
        {{ useFormatPriceIntl(state?.amount || 0) }}
      </span>
    </div>

    <UForm
      class="w-full z-1 mt-10"
      :schema="schema"
      :state="state"
      @submit="onSubmit"
    >
      <UFormField label="Nama Kantong" name="name" class="w-full mb-4">
        <UInput
          v-model="state.name"
          placeholder="Nama Kantong"
          size="xl"
          type="text"
          class="w-full"
        />
      </UFormField>
      <UFormField
        v-if="props.type === 'create'"
        label="Jumlah"
        name="amount"
        class="w-full mb-4"
      >
        <UInputNumber
          v-model="state.amount"
          hide-button
          orientation="vertical"
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
      <UFormField class="mt-12">
        <UButton type="submit" block class="rounded-full py-4">{{
          props.type === "update" ? "Update" : "Simpan"
        }}</UButton>
      </UFormField>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import * as valibot from "valibot";

const props = withDefaults(
  defineProps<{
    name?: string;
    amount?: number;
    type?: "create" | "update";
  }>(),
  {
    name: "",
    amount: 0,
    type: "create",
  }
);

const walletStore = useWallets();
const schema = valibot.required(
  valibot.object({
    name: valibot.pipe(
      valibot.string(),
      valibot.minLength(4, "Must be at least 4 characters")
    ),
    amount: valibot.pipe(
      valibot.number(),
      valibot.minValue(0, "Amount must be positive")
    ),
  })
);

const state = reactive({
  name: props.name || walletStore.detailWallet?.name || "",
  amount: props.amount || walletStore.detailWallet?.amount || 0,
});

const emit = defineEmits(["submit"]);

const onSubmit = () => {
  emit("submit", state);
};
</script>
