<template>
  <USlideover
    v-model:open="isOpen"
    :dismissible="false"
    title="Transaksi Baru"
    side="bottom"
  >
    <UButton
      size="xl"
      :ui="{
        base: 'text-sm px-6 py-6 rounded-[2em] ring-2 ring-neutral-200',
      }"
      variant="outline"
      color="neutral"
    >
      General Setting
    </UButton>

    <template #body>
      <UForm
        class="w-full z-1"
        :schema="schema"
        :state="state"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email" class="w-[100%] mb-4">
          <UInput
            :value="getIdentities()?.email"
            size="xl"
            type="text"
            :disabled="true"
            class="w-[100%]"
          />
        </UFormField>
        <UFormField label="Nama Lengkap" name="full_name" class="w-[100%] mb-4">
          <UInput
            v-model="state.full_name"
            placeholder="Nama Lengkap"
            size="xl"
            type="text"
            class="w-[100%]"
          />
        </UFormField>

        <UButton
          block
          size="xl"
          :ui="{
            base: 'rounded-[2em] text-sm mt-4 py-4',
          }"
          type="submit"
        >
          Simpan
        </UButton>
      </UForm>
    </template>
  </USlideover>
</template>

<script lang="ts" setup>
import * as valibot from "valibot";

const schema = valibot.object({
  full_name: valibot.pipe(
    valibot.string(),
    valibot.minLength(4, "Must be at least 4 characters")
  ),
});

const state = reactive({
  full_name: getIdentities()?.full_name || "",
});

const isOpen = ref<boolean>(false);
const profileStore = useProfile();
const onSubmit = async () => {
  await profileStore.updateProfile(state.full_name);
  isOpen.value = false
};
</script>
