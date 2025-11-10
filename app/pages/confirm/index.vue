<script setup lang="ts">
const user = useSupabaseUser();

definePageMeta({
  name: "confirm",
  layout: false,
});

const route = useRoute();
const token = computed(() => route.query.code);

if (!token.value) {
  navigateTo({ name: "login-page" });
}

watch(
  user,
  (currentUser) => {
    if (currentUser) {
      return navigateTo("/");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
    v-if="token"
    class="bg-primary text-white flex flex-col flex-1 justify-center items-center"
  >
    <img src="/images/brand.png" class="w-[78px] h-[78px]" alt="confirm" />
    <p class="mt-4">Mohon tunggu sebentar ...</p>
  </div>
</template>
