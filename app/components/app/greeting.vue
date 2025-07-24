<template>
    <UContainer as="div" class="flex flex-col px-0 pt-[2em] items-start justify-end">
        <h2 class="font-light text-sm">{{ formatted }}</h2>
        <h1 class="font-bold text-[1.2rem]">Halo Adhitya</h1>
    </UContainer>
</template>

<script setup lang="ts">
import {useNow} from '@vueuse/core';

const today = useNow();
const formatted = useDateFormat(today.value, 'dddd, DD MMMM YYYY', {
  locales: 'id-ID'
});
// const formattedDate = today.value.toLocaleDateString('id-ID', {
//   weekday: 'long',
//   year: 'numeric',
//   month: 'long',
//   day: 'numeric'
// });
</script>