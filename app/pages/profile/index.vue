<template>
  <UContainer class="flex flex-1 flex-col gap-4 py-4">
    <div>
      Hello
    </div>
    <UButton variant="outline" @click="handleLogout">Logout</UButton>
  </UContainer>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
// async function getLoggedInUserName() {
//   const { data: { user } } = await supabase.auth.getUser();
//   return user?.user_metadata?.full_name || "Guest";
// }

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
}

</script>