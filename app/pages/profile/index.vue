<template>
  <div class="flex flex-1 flex-col gap-4 bg-gradient">
    <div class="text-white p-4 relative">
      <div class="absolute inset-0 z-0 custom-bg" />
      <div class="flex justify-end mb-4 mt-4">
        <div
          class="bg-neutral-100 text-primary ring-2 ring-white inset-shadow-sm inset-shadow-neutral-300 rounded-full shadow-xl p-2 px-6 font-medium"
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

    <div
      class="p-4 flex-1 bg-neutral-200 inset-shadow-sm inset-shadow-neutral-300 rounded-tl-4xl rounded-tr-4xl ring-2 ring-white"
    >
      <div
        class="my-6 flex flex-col p-4 items-start justify-center w-full rounded-3xl bg-neutral-200 inset-shadow-sm inset-shadow-neutral-300 ring-2 ring-white"
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
          class="text-sm px-6 py-6 ring-2 ring-white main-shadow rounded-full font-medium hover:bg-neutral-300 active:bg-neutral-300 hover:shadow-lg transition-all"
        >
          History Transactions
        </nuxt-link>
        <UButton
          size="xl"
          variant="outline"
          color="neutral"
          class="ring-2 ring-white main-shadow text-sm px-6 py-6 rounded-full hover:shadow-lg transition-all"
          @click="handleImprove"
        >
          Help us improve!
        </UButton>
        <UButton
          size="xl"
          class="ring-2 ring-white inset-shadow-sm inset-shadow-red-300/90 text-sm px-6 py-6 shadow-xl rounded-full hover:shadow-lg transition-all"
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

const handleImprove = async () => {
  await navigateTo({ name: "improve-page", replace: true });
};
</script>
