<template>
  <div class="flex flex-1 flex-col gap-4 bg-primary">
    <div class="text-white p-4 relative">
      <div class="absolute inset-0 z-0 custom-bg" />
      <div class="flex justify-end mb-4">
        <div
          class="bg-primary-900 ring-2 ring-primary-500 text-white rounded-full shadow-xl p-4 px-6 font-medium"
        >
          <h3>Profil Saya</h3>
        </div>
      </div>
      <div
        class="h-[200px] w-full flex flex-col gap-2 items-center justify-center"
      >
        <app-avatar>
          <img
            :src="`/images/profile_icon/${getIdentities()?.avatar}`"
            :alt="`${getIdentities()?.full_name}-${getIdentities()?.avatar}`"
          />
        </app-avatar>
        <div class="flex flex-col text-center mt-4">
          <span class="font-bold text-sm uppercase tracking-widest">{{
            getIdentities()?.full_name
          }}</span>
          <small class="font-normal text-xs color-neutral">{{
            getIdentities()?.email
          }}</small>
        </div>
      </div>
    </div>

    <div class="p-4 flex-1 bg-neutral-200 rounded-tl-[2rem] rounded-tr-[2rem] ring-2 ring-white">
      <div
        class="my-6 flex flex-col p-4 items-start justify-center w-full rounded-lg bg-neutral-300"
      >
        <h4 class="font-medium text-lg">Invite Friends</h4>
        <p class="text-sm">
          Share your referral link with friends and earn rewards!
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <profile-form />
        <nuxt-link
          :to="{ name: 'transactions-page' }"
          class="text-sm px-6 py-6 rounded-[2em] ring-2 ring-neutral-200 font-medium bg-white hover:bg-neutral-300 active:bg-neutral-300 transition-all"
        >
          History Transactions
        </nuxt-link>
        <UButton
          size="xl"
          class="text-sm px-6 py-6 rounded-[2em]"
          variant="subtle"
          color="error"
          @click="handleLogout"
        >
          Logout
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

const handleLogout = async () => {
  await supabase.auth.signOut();
  await navigateTo({ name: "login-page", replace: true });
};
</script>
