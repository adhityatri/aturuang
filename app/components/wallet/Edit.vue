<template>
    <USlideover
        v-model:open="walletStore.isEditOpen"
        :dismissible="false"
        side="bottom"
        :ui="{ content: 'rounded-t-4xl bg-white-smooth', header: 'border-0' }"
    >
        <!-- Trigger -->
        <UButton
            :ui="{
                base: `
          flex items-center gap-2
          rounded-xl
          bg-white-smooth
          px-4 py-3
          text-dark
          active:translate-x-[2px]
          active:translate-y-[2px]
          active:shadow-none
        `,
            }"
            @click="emit('click')"
        >
            <UIcon name="solar:pen-new-square-linear" class="text-lg" />
            <span class="font-black uppercase text-xs"> Edit </span>
        </UButton>

        <!-- Header -->
        <template #header>
            <div class="flex flex-1 items-start justify-between">
                <div class="text-dark">
                    <h2 class="text-xl font-black uppercase">Ubah Kantong</h2>

                    <p class="text-xs">Perbarui informasi kantong Anda.</p>
                </div>

                <UButton icon="lucide:x" variant="ghost" color="neutral" @click="closeEdit" />
            </div>
        </template>

        <!-- Body -->
        <template #body>
            <div class="relative overflow-hidden">
                <!-- Preview -->
                <!-- <div
                    class="relative z-1 mb-5 flex items-center gap-4 rounded-4xl bg-accent-green p-4"
                >
                    <div class="flex size-14 items-center justify-center rounded-3xl bg-dark">
                        <UIcon name="solar:wallet-money-linear" class="text-2xl text-white" />
                    </div>

                    <div class="text-dark">
                        <p class="text-[10px] font-black uppercase tracking-widest">
                            Kantong Aktif
                        </p>

                        <h3 class="font-black text-xl text-dark">
                            {{ walletStore.detailWallet?.name }}
                        </h3>

                        <p class="text-lg">
                            {{ useFormatPriceIntl(walletStore.detailWallet?.amount || 0) }}
                        </p>
                    </div>
                </div> -->

                <!-- Form -->
                <div class="relative z-1 rounded-4xl bg-accent-green p-4">
                    <wallet-form type="update" @submit="handleSubmit" />
                </div>
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
