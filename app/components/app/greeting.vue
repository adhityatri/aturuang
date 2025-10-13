<template>
    <UContainer as="div" class="flex flex-col px-0 items-start justify-end">
        <h2 class="font-light text-sm">{{ formatted }}</h2>
        <h1 class="font-bold text-[1.2rem] capitalize">Halo {{ getFirstWord(getIdentities()?.full_name ||'User') }}</h1>
    </UContainer>
</template>

<script setup lang="ts">
import {useNow} from '@vueuse/core';

const today = useNow();
const formatted = useDateFormat(today.value, 'dddd, DD MMMM YYYY', {
  locales: 'id-ID'
});
</script>