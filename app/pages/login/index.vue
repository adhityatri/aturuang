<template>
    <main
        class="main-bg relative flex min-h-dvh flex-1 items-center justify-center overflow-hidden px-5 py-8"
    >
        <!-- <div class="rounded-full bg-accent-green absolute -top-50 bottom-[70%] left-0 right-0" /> -->
        <section class="relative z-1 w-full max-w-sm">
            <!-- Brand -->
            <div class="mb-8 flex flex-col items-center text-center text-white">
                <div
                    class="mb-5 flex h-24 w-24 items-center justify-center bg-dark rounded-4xl p-4"
                >
                    <nuxt-img
                        :src="`${useRuntimeConfig().public.supabaseUrl}/storage/v1/object/public/yothro/brand-light.svg`"
                        alt="brand-icon"
                        class="h-full w-full object-contain svg:bg-dark"
                    />
                </div>

                <p class="text-[10px] font-black uppercase tracking-[0.25em] text-accent-green">
                    Welcome Back
                </p>

                <h1 class="mt-2 text-3xl font-black uppercase leading-none">Masuk Akun</h1>

                <p class="mt-3 max-w-[260px] text-sm leading-5 text-white/80">
                    Kelola kantong, budget, dan riwayat transaksi kamu dengan lebih rapi.
                </p>
            </div>

            <!-- Form Card -->
            <UForm
                class="relative overflow-hidden rounded-4xl bg-white-smooth p-5"
                :schema="loginSchema"
                :state="state"
                @submit="onSubmit"
            >
                <div class="relative z-1">
                    <UFormField label="Email" name="email" class="mb-4 w-full">
                        <UInput
                            v-model="state.email"
                            variant="outline"
                            placeholder="Masukkan email"
                            size="xl"
                            type="email"
                            class="w-full"
                            :ui="{
                                base: 'rounded-2xl ring-1 ring-dark bg-white-smooth px-4 py-4 font-bold text-dark',
                            }"
                        />
                    </UFormField>

                    <UFormField label="Kata Sandi" name="password" class="w-full">
                        <UInput
                            id="password"
                            v-model="state.password"
                            variant="outline"
                            placeholder="Masukkan kata sandi"
                            size="xl"
                            :type="viewPassword ? 'text' : 'password'"
                            class="w-full"
                            :ui="{
                                base: 'rounded-2xl bg-white-smooth ring-1 ring-dark px-4 py-4 pr-12 font-bold text-dark',
                            }"
                        >
                            <template #trailing>
                                <UButton
                                    color="neutral"
                                    variant="ghost"
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
                        class="mt-7"
                        icon="solar:login-3-line-duotone"
                        color="primary"
                        type="submit"
                        :loading="isLoading"
                        :ui="{
                            base: 'h-[58px] rounded-2xl bg-accent-green text-sm font-black uppercase tracking-wider text-dark transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                        }"
                    >
                        Masuk
                    </UButton>

                    <USeparator
                        orientation="horizontal"
                        class="my-5 *:font-bold *:text-dark/70"
                        :ui="{ border: 'border-dark/70' }"
                        label="Atau"
                    />

                    <UButton
                        block
                        icon="streamline-logos:google-logo-solid"
                        variant="soft"
                        :ui="{
                            base: 'h-[58px] rounded-2xl bg-white-smooth ring-1 ring-dark text-sm font-black uppercase tracking-wider text-dark transition hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                        }"
                        @click="onGoogleLogin"
                    >
                        Masuk dengan Google
                    </UButton>
                </div>
            </UForm>
        </section>
    </main>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";

definePageMeta({ name: "login-page", title: "yotro | Login", layout: "auth" });

useHead({ title: "yotro | Login" });

const viewPassword = ref<boolean>(false);

const loginSchema = v.object({
    email: v.pipe(v.string(), v.email("Invalid email")),
    password: v.pipe(v.string(), v.minLength(4, "Must be at least 4 characters")),
});

type LoginSchema = v.InferOutput<typeof loginSchema>;

const state = reactive({ email: "", password: "", rememberMe: false as boolean });

const supabase = useSupabaseClient();
const isLoading = shallowRef<boolean>(false);

const onSubmit = async (event: FormSubmitEvent<LoginSchema>) => {
    const { email, password } = event.data;

    try {
        isLoading.value = true;

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            useToast().add({ title: "Login Error", description: error.message });
            return;
        }

        await navigateTo({ name: "homepage", replace: true });
    } catch (error) {
        useToast().add({
            title: "Login Error",
            description: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    } finally {
        isLoading.value = false;
    }
};

const onGoogleLogin = async () => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin + "/confirm" },
        });

        if (error) throw error;
    } catch (error: any) {
        console.error("Google login error:", error?.message);
    }
};
</script>
