<template>
  <div class="flex flex-1 justify-center">
    <div
      v-if="isNotEmpty && status === 'pending'"
      class="flex flex-col items-center justify-center gap-4"
    >
      <USkeleton class="h-[100px] w-full mb-4 rounded-xl bg-neutral-300" />

      <div class="grid gap-2">
        <USkeleton class="h-4 w-[250px] bg-neutral-300" />
        <USkeleton class="h-4 w-[150px] bg-neutral-300" />
        <USkeleton class="h-4 w-[250px] bg-neutral-300" />
        <USkeleton class="h-4 w-[250px] bg-neutral-300" />
        <USkeleton class="h-4 w-[250px] bg-neutral-300" />
        <USkeleton class="h-4 w-[200px] bg-neutral-300" />
      </div>
    </div>
    <div v-else class="flex flex-col">
      <app-nav-title title="Insight" @close="$router.back()" />
      <div class="flex flex-col flex-1 gap-2 px-4">
        <template v-if="isNotEmpty || resultData">
          <div
            class="flex flex-col justify-between min-h-[130px] w-full rounded-xl bg-gradient text-white p-4 mt-6 mb-2"
          >
            <div>
              <h1 class="font-bold">Your Next-Level Financial Mentor</h1>
              <p class="text-sm">
                Bukan cuma nyatet. Pahami habit uangmu, temukan bad habit biar
                financial growth kamu gaspol.
              </p>
            </div>

            <small class="text-xs">Powered by Gemini 2.5</small>
          </div>
          <MDC :value="resultData || {}" />
        </template>
        <div
          v-else
          class="flex-1 my-10 flex flex-col justify-center items-center"
        >
          <UIcon name="solar:layers-minimalistic-line-duotone" size="72" />
          <p class="text-center font-medium text-neutral-500">
            Belum ada cukup data transaksi untuk dianalisis. Tambahkan transaksi
            baru untuk mendapatkan insight!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: "insight-page",
});

const transactionsStore = useTransactionsStore();
const isNotEmpty = computed(
  () => transactionsStore.monthlySummary?.filteredData?.length !== 0
);

const user = useSupabaseUser();

const CACHE_KEY = "yotro_analysis";
const CACHE_HASH_KEY = "yotro_hash";

const cachedHash = localStorage.getItem(CACHE_HASH_KEY);
const cachedAnalysis = localStorage.getItem(CACHE_KEY);

const resultData = ref<string | null>(cachedAnalysis);

const { status, execute } = await useAsyncData(
  "fetch-insight",
  () =>
    $fetch("/api/insight", {
      method: "POST",
      body: {
        userName: user.value?.user_metadata?.full_name,
        transactions: transactionsStore.monthlySummary.filteredData,
      },
    }),
  {
    lazy: true,
    dedupe: "defer",
    server: false,
    immediate: false,
    transform: (data) => {
      if (data) {
        localStorage.setItem(CACHE_KEY, data);
        localStorage.setItem(
          CACHE_HASH_KEY,
          useSignature(transactionsStore.monthlySummary.filteredData)
        );
        resultData.value = data;
      }
      return data;
    },
  }
);

if (
  !cachedAnalysis ||
  cachedHash !== useSignature(transactionsStore.monthlySummary.filteredData)
) {
  execute();
}
</script>
