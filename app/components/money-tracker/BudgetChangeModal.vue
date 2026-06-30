<template>
  <UModal class="bg-white border-[1.5px] border-[#111111] shadow-[4px_4px_0px_#111111] rounded-xl" :open="isOpen">
    <template #header>
      <div class="flex justify-between py-2 w-full pt-4">
        <UButton
          class="all:unset text-white bg-[#EF2B24] border-[1.5px] border-[#111111] shadow-[2px_2px_0px_#111111] rounded-lg w-[40px] h-[40px] flex items-center justify-center hover:bg-[#d6231d] active:bg-[#b91d19] transition-colors"
          @click="emit('close')"
        >
          <UIcon name="material-symbols:close-rounded" size="1.5rem" />
        </UButton>
        <div
          class="flex items-center justify-center bg-[#064EAF] text-white border-[1.5px] border-[#111111] shadow-[2px_2px_0px_#111111] rounded-lg p-2 px-6 font-black uppercase tracking-wider"
        >
          <span>Sesuaikan Budget</span>
        </div>
      </div>
    </template>

    <template #body>
        <div class="ring-1 ring-black">

        </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  isOpen?: boolean;
}>();

const emit = defineEmits(["close"]);
</script>
