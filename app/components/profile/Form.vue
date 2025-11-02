<template>
  <USlideover
    v-model:open="isOpen"
    :dismissible="false"
    title="General Setting"
    side="bottom"
  >
    <UButton
      size="xl"
      :ui="{
        base: 'text-sm px-6 py-6 rounded-[2em] ring-0 shadow-sm hover:shadow-lg transition-all',
      }"
      variant="outline"
      color="neutral"
    >
      General Setting
    </UButton>

    <template #body>
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="icon in profileIcons"
          :key="icon"
          class="cursor-pointer p-2 ring-2 ring-neutral-200 shadow-xl shadow-neutral-300 rounded-xl"
          :class="{
            'ring-primary-500': state.profile_picture === icon,
            'ring-neutral-200': state.profile_picture !== icon,
            'transition-all duration-300': state.profile_picture === icon,
          }"
          @click="state.profile_picture = icon"
        >
          <img
            :src="`/images/profile_icon/${icon}`"
            :alt="icon"
            class="w-full h-auto object-cover"
          />
        </div>
      </div>
      <UForm
        class="w-full z-1 mt-6"
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

const profileIcons = [
  "girl-happy-curly-hair.png",
  "girl-happy-long-hair-without-masker.png",
  "girl-happy-long-hair.png",
  "girl-long-hair-happy-butterfly.png",
  "girl-sad-masker.png",
  "man-long-hair-happy.png",
  "man-short-hair.png",
  "man-tie-short-hair-happy.png",
];

const state = reactive({
  profile_picture: "",
  full_name: getIdentities()?.full_name || "",
});

const isOpen = ref<boolean>(false);
const profileStore = useProfile();
const onSubmit = async () => {
  await profileStore.updateProfile(state.full_name, state.profile_picture);
  isOpen.value = false;
};
</script>
