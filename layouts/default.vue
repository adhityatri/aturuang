<template>
  <div class="flex flex-col flex-1">
    <app-topbar />
    <UContainer as="main" class="flex flex-col flex-1 bg-white">
      <slot />
    </UContainer>
    <app-footer />
  </div>
</template>
