<template>
  <UApp class="p-0">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  title: 'KitaCatat.com - Mudah Catat Keuangan Kamu!',
  bodyAttrs: {
    class: "flex flex-col h-[100dvh]",
  },
});

// const supabase = useSupabaseClient();
// const user = useSupabaseUser();
// const { data: { session }, error: sessionError } = await supabase.auth.getSession();
// if (sessionError) throw sessionError;

</script>
