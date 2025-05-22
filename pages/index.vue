<template>
  <div class="flex gap-4">
    <money-tracker-form class="w-[300px]" />

    <UCard class="flex-1 ring-1 bg-white">
      <UTable :data="data" class="flex-1" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
const data = ref([
  {
    id: "4600",
    date: "2024-03-11T15:30:00",
    status: "paid",
    email: "james.anderson@example.com",
    amount: 594,
  },
]);
</script>
