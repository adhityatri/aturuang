<template>
  <UCard
    class="bg-white shadow-lg flex flex-col gap-2"
    :class="{
      'ring-0': isAll,
    }"
  >
    <div v-if="!isAll" class="flex items-center justify-between mb-2">
      <transactions-title>{{ props.title }}</transactions-title>
      <nuxt-link
        to="/transactions"
        class="text-sm text-neutral-400 hover:text-neutral-600"
      >
        Lihat Semua
      </nuxt-link>
    </div>
    <div v-if="source.length === 0" class="text-center text-neutral-400 py-4">
      Tidak ada transaksi hari ini
    </div>
    <template v-else>
      <div v-for="value in props.source" :key="value.title">
        <small class="uppercase text-neutral-400">{{ value.title }}</small>

        <transactions-item
          v-for="transaction in value.value"
          :key="transaction.id"
          :transaction="transaction"
          @click="navigateToTransactionDetail(transaction)"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { iGroupedTransaction } from "~/types/transactions";

interface Props {
  title?: string;
  source?: iGroupedTransaction[];
  isAll?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Riwayat Transaksi",
  source: () => [] as iGroupedTransaction[],
  isAll: false,
});

const { navigateToTransactionDetail } = useTransactionNavigation();
</script>
