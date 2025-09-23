<template>
  <div
    class="bg-primary-900 flex px-8 flex-col flex-1 items-center justify-center text-white"
  >
    <div class="absolute inset-0 z-0 custom-bg" />
    <div class="relative overflow-hidden w-[72px] h-[72px] mb-8">
      <nuxt-img src="/images/Brand-fix.svg" alt="brand-icon" />
    </div>
    <div class="flex flex-col items-center justify-center z-1">
      <h1 class="text-xl font-bold uppercase tracking-widest">Kelola Uangmu</h1>
      <h2 class="text-md font-normal">Raih Mimpimu!</h2>
    </div>

    <UForm
      class="bg-white rounded-xl w-full max-w-sm mt-8 p-4 shadow-lg shadow-neutral-900 ring-2 ring-neutral-800 z-1"
      :schema="loginSchema"
      :state="state"
      @submit.prevent="onSubmit"
    >
      <UFormField label="Email" name="email" class="w-[100%] mb-4">
        <UInput
          v-model="state.email"
          variant="outline"
          placeholder="Masukkan email"
          size="xl"
          type="email"
          class="w-[100%]"
        />
      </UFormField>
      <UFormField label="Kata Sandi" name="password" class="w-[100%]">
        <UInput
          v-model="state.password"
          variant="outline"
          placeholder="Masukkan kata sandi ..."
          size="xl"
          type="password"
          class="w-[100%]"
        />
      </UFormField>

      <UButton
        block
        class="mt-8 h-[50px] text-sm uppercase tracking-wider"
        icon="solar:login-3-line-duotone"
        color="primary"
        type="submit"
      >
        Masuk
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";

definePageMeta({
  name: "login-page",
  title: "Kitacatat.com | Login",
  layout: "auth",
});

const loginSchema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email")),
  password: v.pipe(v.string(), v.minLength(4, "Must be at least 4 characters")),
});

type LoginSchema = v.InferOutput<typeof loginSchema>;

const state = reactive({
  email: "",
  password: "",
  rememberMe: false as boolean,
});

const supabase = useSupabaseClient();
const onSubmit = async (event: FormSubmitEvent<LoginSchema>) => {
  const { email, password } = event.data;
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    useToast().add({ title: "Login Error", description: error.message });
    return;
  }

  await navigateTo({ name: "homepage", replace: true });
};
</script>
