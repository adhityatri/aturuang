<script setup lang="ts">
// import type { todoType } from "~/types/todo";

interface Props {
    isAdding: boolean;
}

const props = withDefaults(defineProps<Props>(), { isAdding: false });
const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{
    submit: [title: string, description: string, type: string];
    close: [boolean];
}>();

const title = ref("");
const description = ref("");
// const types = ref<Array<todoType>>(["todo", "plan"]);
// const typeOptions = todoType;

const handleClose = () => {
    open.value = false;
};

const submit = () => {
    if (!title.value.trim() || props.isAdding) return;
    emit("submit", title.value, description.value, "todo");
    title.value = "";
    description.value = "";
    handleClose();
};
</script>

<template>
    <USlideover
        v-model:open="open"
        :dismissible="false"
        :ui="{ content: 'rounded-t-2xl ' }"
        side="bottom"
        title="Catatan Baru"
    >
        <template #body>
            <div class="flex flex-col gap-4 py-4">
                <UFormField label="Judul">
                    <UInput
                        v-model="title"
                        placeholder="Tulis Judul Catatan baru..."
                        size="xl"
                        class="w-full"
                        :ui="{ base: 'text-dark font-medium' }"
                        @keyup.enter="submit"
                    />
                </UFormField>
                <UFormField label="Deskripsi">
                    <UTextarea v-model="description" class="w-full" placeholder="Tulis Deskripsi" />
                </UFormField>
                <!-- <UFormField label="Jenis Catatan">
                    <URadioGroup
                        orientation="horizontal"
                        variant="card"
                        indicator="hidden"
                        :items="types"
                        :ui="{
                            label: 'capitalize',
                            item: 'corner-squircle rounded-4xl px-4 py-2 has-data-[state=checked]:border-accent-green has-data-[state=checked]:bg-accent-green/10',
                        }"
                    />
                </UFormField> -->

                <div class="flex gap-4 mt-4 justify-between">
                    <UButton
                        label="Simpan"
                        size="xl"
                        :loading="isAdding"
                        class="corner-based bg-accent-green px-6 font-black text-dark hover:bg-accent-green/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        @click="submit"
                    />
                </div>
            </div>
        </template>
    </USlideover>
</template>
