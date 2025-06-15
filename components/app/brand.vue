<template>
    <div class="text-lg cursor-pointer" @click="handleClick()">
        Kita<b class="text-primary">catat</b>
    </div>
</template>

<script setup>
const handleClick = async () => {
    await navigateTo('/', { replace: true })
}
</script>