<template>
  <USkeleton
    v-if="isLoading"
    class="h-[150px] w-full bg-neutral-300 rounded-xl border-[1.5px] border-[#111111] shadow-[2px_2px_0px_#111111]"
  />
  <div
    v-else
    class="p-4 w-full bg-white border-[1.5px] border-[#111111] shadow-[2px_2px_0px_#111111] rounded-xl"
  >
    <div class="flex justify-between items-start py-2">
      <div class="flex flex-col">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-[#064EAF] text-white rounded border border-[#111111]">
            <UIcon name="solar:calendar-linear" class="text-md block" />
          </div>
          <h1 class="font-black text-lg uppercase tracking-wider text-[#0A0A0A]">Anggaran Bulanan</h1>
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
            base: 'px-4 py-2 rounded-lg bg-[#FFD21E] text-[#0A0A0A] border-[1.5px] border-[#111111] font-bold uppercase tracking-wide',
          }"
        >
          Sesuaikan
        </UButton>

        <template #header>
          <div class="flex flex-1 items-start justify-between">
            <div class="flex flex-col">
              <h1 class="font-black text-lg uppercase tracking-wide text-[#0A0A0A]">Sesuaikan Anggaran</h1>
              <small class="text-[#6B7280] uppercase text-[10px] font-bold tracking-wider">{{
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
                  base: 'px-6 py-4 rounded-lg bg-white border-[1.5px] border-[#111111]',
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
                :ui="{
                  base: 'rounded-lg bg-white border-[1.5px] border-[#111111]',
                }"
              />
            </UFormField>

            <p
              class="p-4 bg-[#FFD21E] border-[1.5px] border-[#111111] shadow-[2px_2px_0px_#111111] rounded-lg text-[#0A0A0A] font-bold"
            >
              <span class="uppercase">Penting:</span> Kami akan mereset saldo dan anggaran Anda pada
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
                base: 'bg-[#064EAF] disabled:bg-neutral-300 disabled:text-primary border-[1.5px] border-[#111111] shadow-[2px_2px_0px_#111111] text-white px-6 py-4 rounded-lg font-bold uppercase tracking-wide',
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
        <h1 v-else class="font-black text-[#EF2B24] text-[1.5rem]">
          {{ useFormatPriceIntl(props.expenses) }}
        </h1>
        <span class="font-black text-[#0A0A0A]">/</span>
        <app-privacy
          v-if="usePrivacy().isPrivacyAccepted"
          size="md"
          color="primary"
        />
        <h2 v-else class="text-[#0A0A0A] font-bold">
          {{ useFormatPriceIntl(props.budget) }}
        </h2>
      </div>
      <UProgress
        v-model="calculateBudget.percent"
        size="lg"
        :status="false"
        :ui="{
          base: 'bg-[#F8F5ED] border-[1.5px] border-[#111111]',
          indicator: 'bg-[#EF2B24]',
        }"
      />
    </div>
    <p class="mt-2 text-md text-[#6B7280] font-bold uppercase">{{ calculateBudget.message }}</p>
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
