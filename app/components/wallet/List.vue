<template>
    <div class="w-full flex flex-col gap-4 mb-4 overflow-hidden">
        <template v-if="isLoading">
            <div class="flex justify-between items-center">
                <USkeleton class="h-4 w-37.5 bg-neutral-300 rounded-xl" />
                <USkeleton class="h-6 w-37.5 bg-neutral-300 rounded-xl" />
            </div>

            <div class="grid grid-cols-2 gap-4 mt-4">
                <USkeleton
                    v-for="i in 4"
                    :key="i"
                    class="h-17.5 bg-neutral-300 rounded-xl border-[1.5px] border-dark"
                />
            </div>
        </template>
        <template v-else>
            <div
                class="flex justify-between items-center mb-4"
                :class="{ 'mb-0': isPages }"
            >
                <!-- <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-text-dark" />
                    <h2
                        class="text-lg font-extrabold uppercase tracking-tight text-dark"
                    >
                        Kantong Saya
                    </h2>
                </div> -->
                <USlideover
                    v-model:open="openForm"
                    :dismissible="true"
                    side="bottom"
                >
                    <UButton
                        v-if="isPages"
                        icon="solar:add-square-linear"
                        aria-label="Tambah kantong"
                        :ui="{
                            base: 'flex flex-1 size-14 items-center justify-center rounded-2xl border-[2px] border-dark bg-accent-yellow p-0 text-dark shadow-[3px_3px_0px_#111111] transition hover:bg-yellow-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                        }"
                    >
                        <span>Tambah Kantong</span>
                    </UButton>

                    <template #header>
                        <div class="flex flex-1 items-start justify-between">
                            <div>
                                <p
                                    class="text-[10px] font-black uppercase tracking-[0.22em] text-accent-blue"
                                >
                                    Wallet
                                </p>

                                <h2
                                    class="text-xl font-black uppercase text-dark"
                                >
                                    {{ selectedWallet?.name || "Kantong Baru" }}
                                </h2>

                                <p
                                    class="mt-1 text-xs font-medium text-secondary"
                                >
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
                                    :name="selectedWallet?.name"
                                    :amount="selectedWallet?.amount"
                                    :type="selectedWallet ? 'update' : 'create'"
                                    @submit="handleSubmit"
                                />
                            </div>
                        </div>
                    </template>
                </USlideover>
            </div>
            <div
                v-if="list.length > 0"
                class="grid grid-cols-2 gap-4 max-h-80 pb-4 overflow-x-hidden overflow-y-auto"
                :class="{ 'max-h-screen': isPages }"
            >
                <wallet-item :list="list" @selected="handleSelected" />
                <UButton
                    v-if="!isPages"
                    class="bg-accent-blue text-white border-[1.5px] border-dark shadow-[2px_2px_0px_border-dar] px-4 py-3 rounded-lg flex flex-col items-center justify-center hover:bg-primary transition-colors"
                    @click="handleWallet()"
                >
                    <div class="uppercase tracking-widest font-black text-xs">
                        Lihat Semua →
                    </div>
                </UButton>
            </div>
            <div
                v-else
                class="bg-white border-[1.5px] border-dark shadow-[4px_4px_0px_#111111] rounded-xl py-12"
            >
                <div
                    class="text-secondary tracking-widest text-[10px] font-black uppercase text-center flex flex-col gap-2"
                >
                    <p>Belum ada kantong</p>
                    <p
                        class="text-accent-red cursor-pointer"
                        @click="() => (openForm = true)"
                    >
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

    useToast().add({
        title: "Update Kantong",
        description: "Kantong berhasil diupdate",
    });

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
