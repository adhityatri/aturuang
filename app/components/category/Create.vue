<template>
    <USlideover
        v-model:open="open"
        :dismissible="false"
        :ui="{ content: 'rounded-t-2xl' }"
        side="bottom"
        title="Kategori Baru"
    >
        <template #body>
            <category-form :key="formKey" @submit="handleSubmit" />
        </template>
    </USlideover>
</template>

<script setup lang="ts">
import CategoryForm from "./Form.vue";
import { useCategory } from "~/stores/useCategory";

const open = defineModel<boolean>("open", { default: false });
const formKey = ref(0);

const closeCreate = () => {
    open.value = false;
    formKey.value++;
};

const handleSubmit = async (payload: { name: string; type: string; icon: string }) => {
    const result = await useCategory().insert({
        name: payload.name,
        type: payload.type,
        icon: payload.icon,
    });

    if (result.error) {
        useToast().add({ title: "Gagal", description: result.error.message, color: "error" });
        return;
    }

    useToast().add({
        title: "Berhasil",
        description: `Kategori ${payload.name} berhasil dibuat`,
        color: "success",
    });

    closeCreate();
};
</script>
