<template>
  <UContainer
    as="footer"
    class="fixed bottom-0 bg-neutral-200 inset-shadow-sm inset-shadow-neutral-300 border-t-2 border-t-white h-[70px] flex items-center justify-evenly overflow-hidden"
  >
    <nuxt-link
      v-for="item in navigation"
      :key="item.name"
      :to="item.href"
      class="transition-alltext-sm font-medium flex flex-col flex-1 items-center justify-center mx-2 text-neutral-700 cursor-pointer hover:text-primary"
      :class="{ 'text-primary text-[1.1rem]': currentRouter === item.href }"
    >
      <span>
        {{ item.name }}
      </span>
      <UIcon
        name="solar:balloon-bold"
        class="transition-all size-3 opacity-0 rotate-180"
        :class="{ 'opacity-100': currentRouter === item.href }"
      />
    </nuxt-link>
  </UContainer>
  <!-- <USlideover
    v-if="canCreate"
    v-model:open="open"
    :dismissible="false"
    title="Transaksi Baru"
    side="bottom"
  >
    <UButton
      class="w-[120px] h-[50px] bottom-[5rem] right-4 fixed flex items-center justify-center rounded-full px-2"
      :ui="{
        base: 'bg-primary text-white ring-2 ring-white',
      }"
    >
      <UIcon name="solar:add-square-broken" class="size-6 mr-2" />
      Baru
    </UButton>

    <template #body>
      <money-tracker-form @close-on-submit="onClose" />
    </template>
  </USlideover> -->
</template>

<script setup lang="ts">
const navigation = [
  {
    name: "Home",
    icon: "solar:home-2-linear",
    href: "/",
    current: true,
  },
  {
    name: "Transactions",
    icon: "solar:wallet-money-linear",
    href: "/transactions",
    current: false,
  },
  {
    name: "Profile",
    icon: "solar:user-linear",
    href: "/profile",
    current: false,
  },
];

const router = useRouter();
const currentRouter = computed(() => {
  return router.currentRoute.value.path;
});

// const open = ref(false);
// const onClose = () => {
//   open.value = false;
// };

// const canCreate = computed(() => {
//   return currentRouter.value === "/";
// });
</script>
