<template>
  <div class="flex flex-col items-center px-2 text-neutral-800">
    <UIcon name="i-lucide-camera" size="28" />
    <label class="upload-action" for="actual-btn">
      {{ props.title ?? "Camera" }}
    </label>
  </div>

  <input
    id="actual-btn"
    ref="filePhoto"
    type="file"
    accept="image/*"
    hidden
    @change="handleUpload"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();

const emits = defineEmits(["upload"]);

const handleUpload = (value: any) => {
  emits("upload", value);
};
</script>
