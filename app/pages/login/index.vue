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
      class="bg-white rounded-xl w-full max-w-sm mt-8 p-6 ring-2 ring-neutral-200 z-1 shadow-lg shadow-neutral-900"
      :schema="loginSchema"
      :state="state"
      @submit="onSubmit"
    >
      <UFormField label="Email" name="email" class="w-full mb-4">
        <UInput
          v-model="state.email"
          variant="outline"
          placeholder="Masukkan email"
          size="xl"
          type="email"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Kata Sandi" name="password" class="w-full">
        <UInput
          v-model="state.password"
          variant="outline"
          placeholder="Masukkan kata sandi ..."
          size="xl"
          type="password"
          class="w-full"
        />
      </UFormField>

      <UButton
        block
        class="mt-8 h-[60px] text-sm uppercase tracking-wider rounded-[2.2em]"
        icon="solar:login-3-line-duotone"
        color="primary"
        type="submit"
        :loading="isLoading"
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
  title: "Aturuang.com | Login",
  layout: "auth",
});

useHead({
  title: "Aturuang.com | Login",
})

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
const isLoading = shallowRef<boolean>(false);
const onSubmit = async (event: FormSubmitEvent<LoginSchema>) => {
  const { email, password } = event.data;
  try {
    isLoading.value = true;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      useToast().add({ title: "Login Error", description: error.message });
      return;
    }
    await navigateTo({ name: "homepage", replace: true });
  } catch (error) {
    useToast().add({
      title: "Login Error",
      description:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
