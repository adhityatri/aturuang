<template>
    <div class="w-full flex flex-col gap-4 mb-4 overflow-hidden">
        <template v-if="isLoading">
            <div class="flex justify-between items-center">
                <USkeleton class="h-4 w-37.5 bg-neutral-300 corner-based" />
                <USkeleton class="h-6 w-37.5 bg-neutral-300 corner-based" />
            </div>

            <div class="grid grid-cols-2 gap-4 mt-4">
                <USkeleton v-for="i in 4" :key="i" class="h-17.5 bg-neutral-300 corner-based" />
            </div>
        </template>
        <template v-else>
            <app-title-page dark>Kantong</app-title-page>
            <div
                v-if="isPages"
                class="flex justify-between items-center mb-4"
                :class="{ 'mb-0': isPages }"
            >
                <USlideover v-model:open="openForm" :dismissible="true" side="bottom">
                    <UButton
                        v-if="isPages"
                        icon="solar:add-square-linear"
                        aria-label="Tambah kantong"
                        :ui="{
                            base: 'flex flex-1 size-14 items-center justify-center corner-based  bg-accent-green p-0 text-dark shadow-xl shadow-base-color transition hover:bg-yellow-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                        }"
                    >
                        <span>Tambah Kantong</span>
                    </UButton>

                    <template #header>
                        <div class="flex flex-1 items-start justify-between">
                            <div>
                                <h2 class="text-xl font-black text-dark">
                                    {{ selectedWallet?.name || "Kantong Baru" }}
                                </h2>

                                <p class="mt-1 text-sm font-medium text-dark/70">
                                    {{
                                        selectedWallet
                                            ? "Perbarui nama dan saldo kantong ini."
                                            : "Buat kantong baru untuk mengatur saldo."
                                    }}
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
                        <!-- <div
                            class="relative overflow-hidden corner-based bg-white p-4 shadow-xl shadow-base-color"
                        > -->
                        <div class="relative z-1">
                            <wallet-form
                                :name="selectedWallet?.name"
                                :amount="selectedWallet?.amount"
                                :type="selectedWallet ? 'update' : 'create'"
                                @submit="handleSubmit"
                            />
                        </div>
                        <!-- </div> -->
                    </template>
                </USlideover>
            </div>
            <div
                v-if="list.length > 0"
                class="overflow-x-auto pb-4 px-2"
                :class="{ 'overflow-x-hidden': isPages }"
            >
                <!-- class="grid grid-cols-4 gap-4 max-h-80 pb-4 overflow-x-hidden overflow-y-auto"
                :class="{ 'max-h-screen': isPages }" -->
                <div class="flex gap-4 min-w-max pb-4" :class="{ 'grid grid-cols-2': isPages }">
                    <wallet-item :list="list" @selected="handleSelected" />
                    <UButton
                        v-if="!isPages"
                        class="shadow-2xl shadow-base-color bg-accent-green text-dark text-sm px-4 py-3 corner-based flex flex-col items-center justify-center hover:bg-accent-green/90 transition-colors active:bg-accent-green/70"
                        leading-icon="i-icon-park-solid:more-app"
                        @click="handleWallet()"
                    >
                        Lihat Semua
                    </UButton>
                </div>
            </div>
            <div v-else class="bg-white rounded-xl corner-squircle py-12">
                <div
                    class="text-secondary tracking-widest text-[10px] font-black uppercase text-center flex flex-col gap-2"
                >
                    <p>Belum ada kantong</p>
                    <p class="text-accent-red cursor-pointer" @click="() => (openForm = true)">
                        [ BUAT SEKARANG ]
                    </p>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { iWallets } from "~/types/wallets";

const props = defineProps({
    isPages: { type: Boolean, required: false, default: false },
    isLoading: { type: Boolean, required: false, default: false },
});

const walletStore = useWallets();
const openForm = shallowRef<boolean>(false);

const list = computed(() =>
    props.isPages ? walletStore.wallets : walletStore.wallets.slice(0, 3),
);

const selectedWallet = shallowRef<iWallets | null>(null);
const handleSelected = async (wallet: iWallets) => {
    selectedWallet.value = wallet;
    await navigateTo({ name: "wallet-detail", query: { id: wallet.id } });
};

const handleSubmit = async (value: { name: string; amount: number }) => {
    const payload = { name: value.name, amount: value.amount };

    const response = shallowRef<any>(null);
    response.value = await walletStore.insert({ ...payload });

    const error = response.value?.error;

    if (error) {
        useToast().add({ title: "Update Kantong", description: error.message });
        return;
    }

    useToast().add({ title: "Update Kantong", description: "Kantong berhasil diupdate" });

    closeForm();
};

const closeForm = () => {
    selectedWallet.value = null;
    openForm.value = false;
};

const router = useRouter();
const handleWallet = () => {
    router.push({ name: "wallets" });
};
</script>
