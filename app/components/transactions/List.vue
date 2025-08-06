<template>
  <UCard class="bg-white shadow-lg ring-0 flex flex-col gap-2">
    <div class="flex items-center justify-between mb-2">
      <transactions-title>{{ props.title }}</transactions-title>
      <nuxt-link to="/transactions" class="text-sm text-neutral-400 hover:text-neutral-600">
        Lihat Semua
      </nuxt-link>
    </div>
    <div>
      <small class="uppercase text-neutral-400">Hari Ini</small>
      <transactions-item v-for="value in source" :key="value.id" :transaction="value" />
    </div>
  </UCard>
  <!-- {{ dataList }} -->
</template>

<script setup lang="ts">
import type { iTransaction } from '~/types/transactions';

interface Props {
  title?: string;
  source?: iTransaction[];
}

const props = withDefaults(defineProps<Props>(), {
  title: "Riwayat Transaksi",
  source: () => [] as iTransaction[]
});

// const dataList = ref(data);
</script>
