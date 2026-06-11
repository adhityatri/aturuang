<template>
    <USlideover v-model:open="isOpen" :dismissible="true" side="bottom">
        <UButton
            icon="solar:add-square-linear"
            aria-label="Tambah kantong baru"
            :ui="{
                base: 'flex size-14 items-center justify-center rounded-2xl border-[2px] border-dark bg-accent-yellow p-0 text-dark shadow-[3px_3px_0px_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
            }"
        />

        <template #header>
            <div class="flex flex-1 items-start justify-between">
                <div>
                    <p
                        class="text-[10px] font-black uppercase tracking-[0.22em] text-accent-blue"
                    >
                        Wallet
                    </p>

                    <h2 class="text-xl font-black uppercase text-dark">
                        Kantong Baru
                    </h2>

                    <p class="mt-1 text-xs font-medium text-secondary">
                        Buat kantong baru untuk memisahkan saldo dan tujuan
                        keuangan.
                    </p>
                </div>

                <UButton
                    icon="lucide:x"
                    color="neutral"
                    variant="ghost"
                    @click="closeForm"
                />
            </div>
        </template>

        <template #body>
            <div
                class="relative overflow-hidden rounded-[2rem] border-[2px] border-dark bg-white p-4 shadow-[4px_4px_0px_#111111]"
            >
                <div
                    class="absolute -right-10 -top-10 size-24 rounded-full bg-accent-yellow"
                />
                <div
                    class="absolute -left-10 bottom-0 size-24 rounded-tr-full bg-accent-blue"
                />

                <div class="relative z-1">
                    <wallet-form
                        name="Kantong Baru"
                        :amount="0"
                        type="create"
                        @submit="handleSubmit"
                    />
                </div>
            </div>
        </template>
    </USlideover>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const walletStore = useWallets();

const closeForm = () => {
    isOpen.value = false;
};

const handleSubmit = async (data: { name: string; amount: number }) => {
    const response = await walletStore.addWallet({
        name: data.name,
        amount: data.amount,
    });

    if (response?.error) {
        useToast().add({
            title: "Kantong Baru",
            description: response.error.message,
            color: "error",
        });
        return;
    }

    useToast().add({
        title: "Kantong Baru",
        description: "Kantong berhasil dibuat",
        color: "success",
    });

    closeForm();
};
</script>
