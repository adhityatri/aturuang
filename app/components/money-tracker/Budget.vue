<template>
  <USkeleton
    v-if="isLoading"
    class="h-[150px] w-full bg-neutral-300 rounded-2xl"
  />
  <div
    v-else
    class="p-4 w-full bg-neutral-50 main-shadow ring-2 ring-white rounded-2xl"
  >
    <div class="flex justify-between items-start py-2">
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <UIcon name="solar:calendar-linear" />
          <h1 class="font-bold text-lg capitalize">anggaran bulanan</h1>
        </div>
      </div>

      <USlideover
        v-model:open="useBudgets().isBudgetOpen"
        :dismissible="false"
        side="bottom"
      >
        <UButton
          size="sm"
          trailing-icon="solar:settings-linear"
          variant="soft"
          :ui="{
            base: 'px-4 py-2 rounded-full bg-primary/10',
          }"
        >
          Sesuaikan
        </UButton>

        <template #header>
          <div class="flex flex-1 items-start justify-between">
            <div class="flex flex-col">
              <h1 class="font-bold text-lg">Sesuaikan Anggaran Bulanan</h1>
              <small class="text-neutral-500">{{
                `Anggaran saat ini: ${useFormatPriceIntl(props.budget)}`
              }}</small>
            </div>
            <UButton
              icon="lucide:x"
              color="neutral"
              variant="ghost"
              @click="handleClose"
            />
          </div>
        </template>

        <template #body>
          <UForm
            class="w-full z-1"
            :schema="budgetSchema"
            :state="state"
            @submit="onSubmit"
          >
            <UFormField label="Budget" name="amount" class="w-full my-4">
              <UInputNumber
                v-model="state.amount"
                orientation="vertical"
                placeholder="Masukkan budget bulanan kamu"
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
                  base: 'px-6 py-4 rounded-full bg-neutral-100',
                  increment: 'hidden',
                  decrement: 'hidden',
                }"
              />
            </UFormField>
            <UFormField
              label="Awal Bulan"
              name="reset_date"
              class="w-full my-4"
            >
              <USelect
                v-model="state.reset_date"
                :items="resetDateList"
                size="xl"
                class="w-full"
                placeholder="Pilih Tanggal Gajian"
              />
            </UFormField>

            <p
              class="p-4 ring-2 ring-white main-shadow shadow-xl rounded-lg text-neutral-500"
            >
              <b>Penting</b> : Kami akan mereset saldo dan anggaran Anda pada
              tanggal
              {{ state.reset_date }}
              setiap bulan.
              {{
                Number(state.reset_date) >= 27
                  ? `Untuk bulan yang tidak memiliki tanggal ${state.reset_date}, reset akan dilakukan pada hari terakhir bulan tersebut.`
                  : ""
              }}
            </p>

            <UButton
              block
              class="mt-8"
              size="xl"
              color="primary"
              :ui="{
                base: 'bg-primary disabled:bg-neutral-300 disabled:text-primary shadow-lg inset-shadow-md inset-shadow-neutral-400 ring-2 ring-white text-white px-6 py-4 rounded-full',
              }"
              type="submit"
            >
              Simpan
            </UButton>
          </UForm>
        </template>
      </USlideover>
    </div>

    <div class="flex flex-col mt-4 gap-2">
      <div class="flex items-end gap-2">
        <app-privacy
          v-if="usePrivacy().isPrivacyAccepted"
          size="lg"
          color="primary"
        />
        <h1 v-else class="font-bold text-red-700 text-[1.5rem]">
          {{ useFormatPriceIntl(props.expenses) }}
        </h1>
        <span class="font-bold text-neutral-400">/</span>
        <app-privacy
          v-if="usePrivacy().isPrivacyAccepted"
          size="md"
          color="primary"
        />
        <h2 v-else class="text-[0.875rem]">
          {{ useFormatPriceIntl(props.budget) }}
        </h2>
      </div>
      <UProgress
        v-model="calculateBudget.percent"
        size="lg"
        :status="false"
        :ui="{
          base: 'bg-neutral-300',
          indicator: 'bg-red-700',
        }"
      />
    </div>
    <p class="mt-2 text-md text-neutral-500">{{ calculateBudget.message }}</p>
  </div>
</template>

<script setup lang="ts">
import type { contextMenu } from "#build/ui";
import * as valibot from "valibot";

const props = withDefaults(
  defineProps<{
    isLoading?: boolean;
    budget?: number;
    expenses?: number;
    resetDate?: string;
    isOpen?: boolean;
  }>(),
  {
    isLoading: false,
    budget: 0,
    expenses: 0,
    resetDate: "1",
  }
);

const budgetSchema = valibot.required(
  valibot.object({
    reset_date: valibot.pipe(valibot.string()),
    amount: valibot.pipe(valibot.number()),
  })
);

const state = reactive({
  reset_date: props.resetDate || "",
  amount: props.budget || 0,
});

const resetDateList = computed(() => {
  return Array.from({ length: 31 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));
});

const calculateBudget = computed(() => {
  const percentage = (props.expenses / props.budget) * 100;
  const message = getBudgetMessage(percentage);
  return {
    percent: percentage <= 100 ? percentage : 100,
    message,
  };
});

const handleClose = () => {
  useBudgets().isBudgetOpen = false;
};

const emit = defineEmits(["submit", "close"]);

const onSubmit = async () => {
  const payload = {
    reset_date: state.reset_date,
    amount: state.amount,
  };

  emit("submit", payload);
};
</script>
