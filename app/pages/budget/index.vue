<template>
  <main
    class="bg-linear-to-b from-primary-600 via-primary-900 to-primary-950 flex flex-col flex-1"
  >
    <!-- <div class="top-0 left-0 w-[80%] h-[80%] z-0 absolute bg-linear-to-r from-primary-800 via-purple-500 to-pink-500 rounded-tr-full rounded-br-full" /> -->

    <!-- <div class="bottom-[35%] right-0 w-[60%] absolute h-[150px] bg-primary-900/20 ring-20 ring-primary-200/30 rounded-tl-full rounded-bl-full" /> -->

    <app-nav-title
      title="Atur Budget Bulanan"
      class="z-1"
      @close="handleSignOut()"
    />
    <div class="flex flex-col justify-center p-4 flex-1 text-white gap-2 z-2">
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
            base: 'px-6 py-4 rounded-full ring-2 ring-primary bg-neutral-200 inset-shadow-sm inset-shadow-neutral-300 shadow-xl',
            increment: 'hidden',
            decrement: 'hidden',
          }"
        />

        <UButton
          block
          class="mt-8"
          :disabled="!isReady"
          size="xl"
          color="primary"
          :ui="{
            base: 'bg-primary disabled:bg-neutral-300 disabled:text-primary shadow-lg inset-shadow-md inset-shadow-neutral-400 ring-2 ring-white text-white px-6 py-4 rounded-full',
          }"
          @click="handleSaveBudget()"
        >
          Simpan
        </UButton>
      </div>
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

const amount = ref(null);
const isReady = computed(() => amount.value && amount.value > 0);

const budgetStore = useBudgets();
const handleSaveBudget = async () => {
  const payload: iBudgetCreate = {
    amount: amount.value || 0,
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
