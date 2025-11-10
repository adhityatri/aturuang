<template>
  <main class="bg-primary flex flex-col flex-1">
    <app-nav-title title="Budget" @close="handleSignOut()" />

    <div class="flex flex-col justify-center p-4 flex-1 text-white gap-2">
      <h1 class="text-3xl">
        Ini Bukan Soal <br /><b>"Ngirit"</b> atau <b>"Nahan Diri"</b>
      </h1>
      <h2 class="font-light text-xl">
        Ini soal <b>kamu yang ngatur hidupmu, bukan uang yang ngatur kamu.</b>
      </h2>
    </div>

    <div class="px-4 flex flex-col h-[300px] justify-end items-end py-8">
      <div
        class="bg-neutral-200 inset-shadow-sm inset-shadow-neutral-300 ring-2 ring-white rounded-2xl p-4"
      >
        <p class="text-neutral-600 italic px-2 pb-6">
          “Tenang, ini nggak kaku, kamu bisa ubah angkanya kapanpun.”
        </p>
        <UInputNumber
          v-model="amount"
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
            base: 'px-6 py-4 rounded-full ring-2 ring-white bg-neutral-200 inset-shadow-sm inset-shadow-neutral-300 shadow-xl',
            increment: 'hidden',
            decrement: 'hidden',
          }"
        />
      </div>

      <UButton
        block
        class="mt-8"
        :disabled="!isReady"
        size="xl"
        color="primary"
        :ui="{
          base: 'bg-white disabled:bg-neutral-200 text-primary px-6 py-4 rounded-full',
        }"
        @click="handleSaveBudget()"
      >
        Simpan
      </UButton>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { iBudgetCreate } from "~/types/budget";

definePageMeta({
  name: "budget-page",
  layout: false,
});

const supabase = useSupabaseClient();

const handleSignOut = async () => {
  await supabase.auth.signOut();
  await navigateTo({ name: "login-page", replace: true });
};

const amount = ref(0);
const isReady = computed(() => amount.value > 0);

const budgetStore = useBudgets();
const handleSaveBudget = async () => {
  const payload: iBudgetCreate = {
    amount: amount.value,
    user_id: useSupabaseUser()?.value?.id || "",
    monthly_start: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toISOString(),
  };

  try {
    await budgetStore.insertBudget({ ...payload });
    await navigateTo({ name: "home-page", replace: true });
  } catch (error: any) {
    useToast().add({
      title: "Gagal menyimpan",
      description: error?.message || "Terjadi kesalahan saat menyimpan budget",
      color: "error",
    });
  }
};
</script>
