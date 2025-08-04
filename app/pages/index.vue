<template>
  <div class="flex flex-1 flex-col gap-4 py-4">
    <app-greeting />
    <summary-card class="mb-6" />
    <transactions-list title="Riwayat Transaksi"/>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'homepage'
});

const user = useSupabaseClient();

// const data = ref([
//   {
//     id: '4600',
//     date: '2024-03-11T15:30:00',
//     status: 'paid',
//     email: 'james.anderson@example.com',
//     amount: 594
//   }
// ]);
</script>
