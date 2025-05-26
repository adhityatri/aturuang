<template>
    <div class="flex flex-col flex-1 items-center justify-center h-[100dvh]">
        <UCard class="w-[300px]">
          <template #header>
            Login Form
          </template>
          <div class="flex flex-col gap-2">
            <UFormField label="Email" class="w-[100%]">
              <UInput size="xl" type="email" v-model="email" class="w-[100%]" />
            </UFormField>
            <UButton class="mt-4" size="xl" @click="signInWithOtp">
                Sign in with OTP
            </UButton>
          </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "auth",
    name: "login-page",
    title: "Kitacatat.com | Login"
})

const supabase = useSupabaseClient()
const email = ref('')

const signInWithOtp = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: 'http://localhost:3002/confirm',
    }
  })
  if (error) console.log(error)
}
</script>