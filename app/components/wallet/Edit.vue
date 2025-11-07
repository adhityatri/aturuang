<template>
  <USlideover
    v-model:open="walletStore.isEditOpen"
    :dismissible="false"
    title="Ubah Kantong"
    side="bottom"
    :close="{ onClick: () => closeEdit() }"
  >
    <UButton
      class="rounded-md text-sm ring-2 ring-white bg-neutral-200 shadow-lg text-primary inset-shadow-sm inset-shadow-neutral-300 active:bg-neutral-300"
      size="xl"
      @click="emit('click')"
    >
      <UIcon name="solar:pen-new-square-linear" />
    </UButton>
    <template #body>
      <wallet-form type="update" @submit="handleSubmit" />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
const emit = defineEmits(["click"]);
const id = computed(() => useRoute().query?.id as string);
const walletStore = useWallets();

const closeEdit = () => {
  walletStore.isEditOpen = false;
};

const handleSubmit = async (value: { name: string }) => {
  const payload = {
    id: id.value || "",
    name: value.name,
  };

  const response = shallowRef<any>(null);
  response.value = await walletStore.updateWallet({ ...payload });

  const error = response.value?.error;
  if (error) {
    useToast().add({
      title: "Update Kantong",
      description: error.message,
    });
    return;
  }
  useToast().add({
    title: "Update Kantong",
    description: "Kantong berhasil diupdate",
  });

  closeEdit();
};
</script>
