<template>
  <UNavigationMenu :items="menuItems"> </UNavigationMenu>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const menuItems = ref<NavigationMenuItem[]>([
  {
    label: 'Dashboard',
    to: '/dashboard'
  },
  {
    label: 'Transactions',
    to: '/transactions'
  },
  {
    label: 'Budget',
    to: '/budget'
  },
  {
    label: 'Profile',
    to: '/profile'
  }
]);
</script>
