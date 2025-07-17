<template>
  <div class="bg-gray-100 flex px-8 flex-col flex-1 items-center justify-center">
    <div class="relative overflow-hidden w-[72px] h-[72px] mb-8 rounded-2xl">
      <div class="bg-primary h-full z-0"> </div>
      <div class="bg-secondary h-full w-full z-2 top-0 left-0 absolute rounded-br-[120px] rounded-xl"> </div>
    </div>
    <div class="flex flex-col items-center justify-center z-1">
      <h1 class="text-2xl font-bold">Kelola Uangmu</h1>
      <h2 class="text-xl font-medium">Raih Mimpimu!</h2>
    </div>

    <UForm
      class="bg-white rounded-xl w-full max-w-sm mt-8 p-4 shadow-lg z-1"
      :schema="loginSchema"
      :state="state"
      @submit="onSubmit"
    >
      <UFormField label="Email" name="email" class="w-[100%] mb-4">
        <UInput v-model="state.email" size="xl" type="email"  class="w-[100%]" />
      </UFormField>
      <UFormField label="Kata Sandi" name="password" class="w-[100%]">
        <UInput v-model="state.password" size="xl" type="password" class="w-[100%]" />
      </UFormField>
      
      <UCheckbox
        v-model="state.rememberMe"
        class="mt-4"
        label="Ingat saya"
        size="xl"
      />

      <UButton block class="mt-8" size="xl" color="secondary" type="submit">
        Masuk
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import * as v from 'valibot';

definePageMeta({
  name: "login-page",
  title: "Kitacatat.com | Login",
  layout: false,
});


const loginSchema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(8, 'Must be at least 8 characters'))
})

type LoginSchema = v.InferOutput<typeof loginSchema>;

const state = reactive({
  email: '',
  password: '',
  rememberMe: false as boolean,
})

const onSubmit = async (event: FormSubmitEvent<LoginSchema>) => {
  await navigateTo({ name: 'homepage', replace: true })
  console.log(event.data)
};
</script>
