<template>
    <div class="flex flex-col flex-1 items-center justify-center h-[100dvh]">
        <UCard class="flex gap-4">
            <UInput type="email" v-model="email" />
            <UButton @click="signInWithOtp">
                Sign in with OTP
            </UButton>
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