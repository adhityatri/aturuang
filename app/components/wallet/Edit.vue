<template>
    <USlideover
        v-model:open="walletStore.isEditOpen"
        :dismissible="false"
        side="bottom"
        :ui="{ content: 'rounded-t-4xl corner-squircle main-bg', header: 'border-0' }"
    >
        <!-- Trigger -->
        <UButton
            :ui="{
                base: `h-20 w-25 place-content-center bg-transparent text-dark ring-1 ring-dark/40 rounded-[3rem] corner-squircle flex flex-col active:translate-x-[2px]
                active:translate-y-[2px]
                active:shadow-none active:bg-dark/5`,
            }"
            @click="emit('click')"
        >
            <UIcon name="solar:pen-new-square-linear" class="text-2xl text-dark/80" />
            <span class="font-black text-md"> Edit </span>
        </UButton>

        <!-- Header -->
        <template #header>
            <div class="flex flex-1 items-start justify-between my-2">
                <div class="text-dark">
                    <h2 class="text-xl font-bold">Ubah Kantong</h2>

                    <p class="text-lg text-dark/80">Perbarui informasi kantong Anda.</p>
                </div>

                <UButton icon="lucide:x" variant="ghost" color="neutral" @click="closeEdit" />
            </div>
        </template>

        <!-- Body -->
        <template #body>
            <div class="relative overflow-hidden">
                <!-- Form -->
                <wallet-form type="update" @submit="handleSubmit" />
            </div>
        </template>
    </USlideover>
</template>

<script setup lang="ts">
const emit = defineEmits(["click"]);

const id = computed(() => useRoute().query?.id as string);

const walletStore = useWallets();

const closeEdit = () => {
    walletStore.isEditOpen = false;
};

const handleSubmit = async (value: { name: string; amount: number }) => {
    const response = await walletStore.updateWallet({
        id: id.value,
        name: value.name,
        amount: value.amount,
    });

    if (response?.error) {
        useToast().add({
            title: "Update Kantong",
            description: response.error.message,
            color: "error",
        });

        return;
    }

    useToast().add({
        title: "Update Kantong",
        description: "Kantong berhasil diperbarui",
        color: "success",
    });

    closeEdit();
};
</script>
