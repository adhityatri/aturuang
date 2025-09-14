<template>
  <div class="flex flex-1 flex-col gap-4 bg-primary">
    <div class="text-white p-4 relative">
      <div class="absolute inset-0 z-0 custom-bg" />
      <app-title-page>Profile</app-title-page>
      <div class="h-[200px] w-full flex flex-col gap-2 items-center justify-center">
        <app-avatar>
          <img src="https://avatars.githubusercontent.com/u/5179223?v=4&size=96" alt="">
        </app-avatar>
        <div class="flex flex-col text-center mt-4">
          <span class="font-bold text-sm uppercase tracking-widest">{{ getIdentities()?.full_name }}</span>
          <small class="font-normal text-xs color-neutral">{{ getIdentities()?.email }}</small>
        </div>
      </div>
    </div>

    <div class="p-4 flex-1 bg-white rounded-tl-2xl rounded-tr-2xl">
      <!-- <div class="grid grid-cols-2 gap-4">
        <div v-for="value in 2" :key="value"
          class="h-[50px] w-full rounded-lg bg-neutral-400 text-white flex items-center justify-center">Hello</div>
      </div> -->

      <div class="my-6 flex flex-col p-4 items-start justify-center w-full rounded-lg bg-neutral-300">
        <h4 class="font-medium text-lg">Invite Friends</h4>
        <p class="text-sm">Share your referral link with friends and earn rewards!</p>
      </div>

      <div class="flex flex-col gap-2">
        <UButton size="xl" class="text-sm" variant="outline" color="neutral">General Setting</UButton>
        <UButton size="xl" class="text-sm" variant="outline" color="neutral">History Transactions</UButton>
        <UButton size="xl" class="text-sm" variant="subtle" color="error" @click="handleLogout">Logout</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
// async function getLoggedInUserName() {
//   const { data: { user } } = await supabase.auth.getUser();
//   return user?.user_metadata?.full_name || "Guest";
// }

const user = useSupabaseUser();

// const handleUpdateUser = await supabase.auth.updateUser({
//   data:{
//     full_name: 'admin aturuang'
//   }
// })

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  await navigateTo({ name: 'login-page', replace: true });
}

</script>