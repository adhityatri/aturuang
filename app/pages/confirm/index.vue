<script setup lang="ts">
const user = useSupabaseUser();

definePageMeta({
  name: "confirm",
});

watch(
  user,
  (currentUser) => {
    console.log("currentUser : ", currentUser);
    if (currentUser) {
      // Redirect to protected page
      return navigateTo("/");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>Waiting for login...</div>
</template>
