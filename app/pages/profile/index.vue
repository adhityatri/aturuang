<template>
  <div class="flex flex-1 flex-col gap-4 py-4">
    <app-title-page>Profile</app-title-page>
    <div class="h-[200px] w-full flex flex-col gap-2 items-center justify-center">
      <app-avatar>
        <img src="https://avatars.githubusercontent.com/u/5179223?v=4&size=96" alt="">
      </app-avatar>
      <div class="flex flex-col text-center mt-4">
        <span class="font-medium">{{ getIdentities()?.full_name }}</span>
        <small class="text-xs color-neutral">{{ getIdentities()?.email }}</small>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div v-for="value in 2" :key="value" class="h-[50px] w-full rounded-lg bg-neutral-400 text-white flex items-center justify-center">Hello</div>
    </div>

    <div class="my-6 flex flex-col px-4 items-start justify-center h-[100px] w-full rounded-lg bg-primary text-white">
      <h4 class="font-bold">Invite Friends</h4>
      <p class="text-sm">Share your referral link with friends and earn rewards!</p>
    </div>

      <!-- <UButton size="xl" class="text-sm" variant="outline" color="neutral" @click="handleUpdateUser()">Testing Auto Update</UButton> -->

      <UButton size="xl" class="text-sm" variant="outline" color="neutral">General Setting</UButton>
      <UButton size="xl" class="text-sm" variant="outline" color="neutral">History Transactions</UButton>
      <UButton size="xl" class="text-sm" variant="subtle" color="error" @click="handleLogout">Logout</UButton>
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
  await navigateTo({name : 'login-page', replace: true});
}

</script>