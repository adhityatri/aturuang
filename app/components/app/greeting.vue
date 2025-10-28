<template>
  <UContainer as="div" class="flex flex-col px-0 items-start justify-end">
    <template v-if="props.isLoading">
      <USkeleton class="bg-neutral-300 h-4 w-[250px] mb-2" />
      <USkeleton class="bg-neutral-300 h-6 w-[200px]" />
    </template>
    <template v-else>
      <h2 class="font-light text-sm">{{ formatted }}</h2>
      <h1 class="font-bold text-[1.2rem] capitalize">
        Halo {{ getFirstWord(getIdentities()?.full_name || "User") }}
      </h1>
    </template>
  </UContainer>
</template>

<script setup lang="ts">
import { useNow } from "@vueuse/core";

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const today = useNow();
const formatted = useDateFormat(today.value, "dddd, DD MMMM YYYY", {
  locales: "id-ID",
});
</script>
