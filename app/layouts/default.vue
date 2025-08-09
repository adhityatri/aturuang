<template>
  <div class="flex flex-col flex-1">
    <UContainer as="main" class="flex flex-col flex-1 bg-neutral-50 pb-[80px]">
      <slot />
    </UContainer>
    <app-footer />
  </div>
</template>
