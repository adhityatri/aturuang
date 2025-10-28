<template>
  <USlideover
    v-model:open="isOpen"
    :dismissible="true"
    title="Kantong Baru"
    side="bottom"
    :close="{ onClick: () => closeForm() }"
  >
    <UButton
      variant="subtle"
      :ui="{
        base: 'bg-neutral-200 h-[56px] w-[56px] rounded-full ring-2 ring-white shadow-xl place-content-center',
      }"
      icon="solar:add-square-linear"
    >
    </UButton>
    <template #body>
      <wallet-form
        name="Kantong Baru"
        :amount="0"
        @close="closeForm"
        @submit="handleSubmit"
      />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
const isOpen = ref(false);

const closeForm = () => {
  isOpen.value = false;
};

const handleSubmit = (data: any) => {
  console.log(data);
};
</script>
