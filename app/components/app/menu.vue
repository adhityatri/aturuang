<template>
  <UNavigationMenu :items="menuItems"> </UNavigationMenu>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const menuItems = ref<NavigationMenuItem[]>([
  {
    label: 'Overview',
    to: '/'
  },
  {
    label: 'Activity',
    to: '/activity'
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
