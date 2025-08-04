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
      <transactions-item />
    </div>
  </UCard>
  <!-- {{ dataList }} -->
</template>

<script setup lang="ts">
interface Props {
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Riwayat Transaksi",
});

// const dataList = ref(data);
</script>
