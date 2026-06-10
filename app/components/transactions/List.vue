<template>
  <UCard
    class="bg-white border-[1.5px] border-[#111111] shadow-[2px_2px_0px_#111111] rounded-xl flex flex-col gap-2"
    :ui="{
      body: {
        padding: 'p-4',
      },
    }"
  >
    <template v-if="isLoading">
      <div class="flex justify-between items-center">
        <USkeleton class="h-4 w-[150px] bg-neutral-300 rounded-xl" />
        <USkeleton class="h-2 w-[70px] bg-neutral-300 rounded-xl" />
      </div>

      <div class="mt-6 gap-2 flex flex-col">
        <USkeleton v-for="i in 5" :key="i" class="h-[60px] w-full bg-neutral-300 rounded-xl" />
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-between mb-4">
        <transactions-title>{{ props.title }}</transactions-title>
        <nuxt-link
          v-if="!isAll"
          to="/transactions"
          class="text-sm font-bold uppercase tracking-wider text-[#0A0A0A] border-[1.5px] border-[#111111] px-3 py-1 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          Lihat Semua →
        </nuxt-link>
      </div>
      <div v-if="source.length === 0" class="text-center text-[#6B7280] py-4 text-xs font-bold uppercase tracking-wider">
        Tidak ada transaksi hari ini
      </div>
      <div v-else class="flex flex-col gap-2">
        <small class="uppercase text-[#6B7280] font-bold tracking-wider text-[10px] mb-1">{{ groupTitle }}</small>
        <transactions-item
          v-for="value in source"
          :key="value.id"
          :transaction="value"
          @click="navigateToTransactionDetail(value)"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { iTransaction } from "~/types/transactions";

interface Props {
  title?: string;
  source?: iTransaction[];
  isAll?: boolean;
  groupTitle?: string;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Riwayat Transaksi",
  source: () => [] as iTransaction[],
  isAll: false,
  groupTitle: "",
  isLoading: false,
});

const { navigateToTransactionDetail } = useTransactionNavigation();
</script>
