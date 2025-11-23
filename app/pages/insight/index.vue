<template>
  <div class="flex flex-1 justify-center">
    <div
      v-if="status === 'pending'"
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
    <div v-else>
      <app-nav-title title="Insight" @close="$router.back()" />
      <div class="flex flex-col gap-2 px-4">
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
        <MDC :value="data || {}" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: "insight-page",
});

const transactionsStore = useTransactionsStore();

const user = useSupabaseUser();
const { data, status } = useAsyncData(
  "fetch-insight",
  () =>
    $fetch("/api/insight", {
      method: "POST",
      body: {
        userName: user.value?.user_metadata?.user_name,
        transactions: transactionsStore.monthlySummary.filteredData,
      },
    }),
  {
    lazy: true,
    dedupe: "defer",
    server: false,
  }
);
</script>
