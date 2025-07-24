<template>
  <UContainer
    as="footer"
    class="bg-gray-200 h-[60px] flex items-center justify-evenly"
  >
    <nuxt-link v-for="item in navigation" :key="item.name" :to="item.href" class="flex flex-col flex-1 items-center justify-center mx-2 text-gray-700 cursor-pointer hover:text-orange-500">
      <UIcon :name="item.icon" class="size-6" />
      <!-- <p class="text-sm">{{ item.name }}</p> -->
    </nuxt-link>
  </UContainer>
</template>

<script setup lang="ts">
const navigation = [
  {
    name: "Home",
    icon: 'solar:home-2-linear',
    href: "/",
    current: true,
  },
  {
    name: "Transactions",
    icon: 'solar:wallet-money-linear',
    href: "/Transactions",
    current: false,
  },
  {
    name: "Budget",
    icon: 'solar:money-bag-linear',
    href: "/budget",
    current: false,
  },
  {
    name: "Profile",
    icon:'solar:user-linear',
    href: "/profile",
    current: false,
  },
];
</script>
