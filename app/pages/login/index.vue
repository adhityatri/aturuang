<template>
  <div
    class="bg-primary-900 flex px-8 flex-col flex-1 items-center justify-center text-white"
  >
    <div class="absolute inset-0 z-0 custom-bg" />
    <div class="relative overflow-hidden h-fit w-[220px] mb-8">
      <nuxt-img :src="`${useRuntimeConfig().public.supabaseUrl}/storage/v1/object/public/yothro/brand-light.svg`" alt="brand-icon" />
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
          :type="viewPassword ? 'text' : 'password'"
          class="w-full"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="viewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="viewPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="viewPassword"
              aria-controls="password"
              @click="viewPassword = !viewPassword"
            />
          </template>
        </UInput>
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

      <USeparator
        orientation="horizontal"
        class="my-4 border-neutral-300 *:text-primary"
        label="Atau"
      />
      <UButton
        block
        class="h-[60px] text-sm uppercase tracking-wider rounded-[2.2em]"
        icon="streamline-logos:google-logo-solid"
        variant="soft"
        @click="onGoogleLogin"
      >
        Masuk dengan google
      </UButton>
    </UForm>

    <!-- <div class="text-sm text-white pt-4 z-1">
      Belum punya akun?
      <nuxt-link to="/register" class="text-primary-500">
        Daftar disini
      </nuxt-link>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";

definePageMeta({
  name: "login-page",
  title: "yothro | Login",
  layout: "auth",
});

useHead({
  title: "yothro | Login",
});



const viewPassword = ref<boolean>(false);

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

const onGoogleLogin = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/confirm",
      },
    });

    if (error) throw error;
  } catch (error: any) {
    console.error("Google login error:", error?.message);
  }
};
</script>
