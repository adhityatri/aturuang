<template>
  <UCard class="bg-white shadow-lg ring-0 flex flex-col gap-2">
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
        @click="handleClick(value)"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { iTransaction } from "~/types/transactions";

interface Props {
  title?: string;
  source?: iTransaction[];
  isAll?: boolean;
  groupTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Riwayat Transaksi",
  source: () => [] as iTransaction[],
  isAll: false,
  groupTitle: "",
});

const router = useRouter();
const handleClick = (transaction: iTransaction) => {
  router.push({
    name: "transaction-detail",
    query: {
      id: transaction.id,
    },
  });
};
</script>
