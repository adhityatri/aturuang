<template>
  <UCard class="bg-white shadow-lg ring-0 flex flex-col gap-2">
    <template v-if="isLoading">
      <div class="flex justify-between items-center">
        <USkeleton class="h-4 w-[150px] bg-neutral-500 rounded-2xl" />
        <USkeleton class="h-2 w-[70px] bg-neutral-500 rounded-2xl" />
      </div>

      <div class="mt-6 gap-2 flex flex-col">
        <USkeleton class="h-[60px] w-full bg-neutral-500 rounded-2xl" />
        <USkeleton class="h-[60px] w-full bg-neutral-500 rounded-2xl" />
        <USkeleton class="h-[60px] w-full bg-neutral-500 rounded-2xl" />
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-between mb-2">
        <transactions-title>{{ props.title }}</transactions-title>
        <nuxt-link
          v-if="!isAll"
          to="/transactions"
          class="text-sm text-neutral-400 hover:text-neutral-600"
        >
          Lihat Semua
        </nuxt-link>
      </div>
      <div v-if="source.length === 0" class="text-center text-neutral-400 py-4">
        Tidak ada transaksi hari ini
      </div>
      <div v-else>
        <small class="uppercase text-neutral-400">{{ groupTitle }}</small>
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
