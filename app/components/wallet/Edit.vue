<template>
    <USlideover
        v-model:open="walletStore.isEditOpen"
        :dismissible="false"
        side="bottom"
    >
        <!-- Trigger -->
        <UButton
            :ui="{
                base: `
          flex items-center gap-2
          rounded-xl
          border-[1.5px] border-dark
          bg-white
          px-4 py-3
          text-dark
          shadow-[3px_3px_0px_#111111]
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
                <div>
                    <p
                        class="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue"
                    >
                        Wallet
                    </p>

                    <h2 class="text-xl font-black uppercase text-dark">
                        Ubah Kantong
                    </h2>

                    <p class="mt-1 text-xs text-secondary">
                        Perbarui informasi kantong Anda.
                    </p>
                </div>

                <UButton
                    icon="lucide:x"
                    variant="ghost"
                    color="neutral"
                    @click="closeEdit"
                />
            </div>
        </template>

        <!-- Body -->
        <template #body>
            <div
                class="relative overflow-hidden rounded-[2rem] border-[2px] border-dark bg-[#fffaf0] p-4 shadow-[4px_4px_0px_#111111]"
            >
                <!-- Decoration -->
                <div
                    class="absolute -right-10 -top-10 size-24 rounded-full bg-accent-yellow"
                />

                <div
                    class="absolute -left-10 bottom-0 size-20 rounded-tr-full bg-accent-blue"
                />

                <!-- Preview -->
                <div
                    class="relative z-1 mb-5 flex items-center gap-4 rounded-2xl border-[2px] border-dark bg-white p-4 shadow-[3px_3px_0px_#111111]"
                >
                    <div
                        class="flex size-14 items-center justify-center rounded-2xl bg-accent-yellow border-[2px] border-dark"
                    >
                        <UIcon
                            name="solar:wallet-money-linear"
                            class="text-2xl text-dark"
                        />
                    </div>

                    <div>
                        <p
                            class="text-[10px] font-black uppercase tracking-widest text-accent-blue"
                        >
                            Kantong Aktif
                        </p>

                        <h3 class="font-black text-dark">
                            {{ walletStore.detailWallet?.name }}
                        </h3>

                        <p class="text-xs text-secondary">
                            {{
                                useFormatPriceIntl(
                                    walletStore.detailWallet?.amount || 0,
                                )
                            }}
                        </p>
                    </div>
                </div>

                <!-- Form -->
                <div
                    class="relative z-1 rounded-2xl border-[2px] border-dark bg-white p-4"
                >
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
