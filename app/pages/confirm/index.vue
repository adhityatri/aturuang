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
    <img
      :src="`${
        useRuntimeConfig().public.supabaseUrl
      }/storage/v1/object/public/yothro/brand-light.svg`"
      class="h-fit w-[220px]"
      alt="confirm"
    />
  </div>
</template>
