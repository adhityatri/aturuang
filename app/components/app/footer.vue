<template>
  <UContainer
    as="footer"
    class="fixed bottom-0 bg-gray-200 h-[60px] flex items-center justify-evenly"
  >
    <nuxt-link
      v-for="item in navigation"
      :key="item.name"
      :to="item.href"
      class="flex flex-col flex-1 items-center justify-center mx-2 text-gray-700 cursor-pointer hover:text-orange-500"
    >
      <UIcon :name="item.icon" class="size-6" />
    </nuxt-link>
    <USlideover  v-model:open="open"  :dismissible="false" title="Transaksi Baru" side="bottom">
      <UButton class="w-[100px] flex items-center justify-center">
        <UIcon name="solar:add-square-broken" class="size-6 mr-2" />
        Baru
      </UButton>

      <template #body>
        <money-tracker-form @close-on-submit="onClose" />
      </template>
    </USlideover>
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
    href: "/Transactions",
    current: false,
  },
  // {
  //   name: "Budget",
  //   icon: "solar:money-bag-linear",
  //   href: "/budget",
  //   current: false,
  // },
  {
    name: "Profile",
    icon: "solar:user-linear",
    href: "/profile",
    current: false,
  },
];

const open = ref(false)
const onClose = () => {
  // Logic to close the slideover
  open.value = false;
};
</script>
