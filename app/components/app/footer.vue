<template>
  <UContainer
    as="footer"
    class="fixed bottom-0 main-shadow border-t-2 border-t-white h-[70px] flex items-center justify-evenly overflow-hidden"
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
    name: "Insight",
    icon: "solar:command-bold-duotone",
    href: "/insight",
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
