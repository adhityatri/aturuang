<template>
    <div class="flex flex-col mb-4 overflow-hidden">
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
            <div v-if="!isPages" class="flex justify-between">
                <app-title-page dark>Kantong</app-title-page>
                <nuxt-link class="flex text-sm text-dark" @click="handleWallet()">
                    Lihat Semua
                </nuxt-link>
            </div>
            <div v-if="isPages">
                <USlideover v-model:open="openForm" :dismissible="true" side="bottom">
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
                        <div class="relative z-1">
                            <wallet-form
                                :name="selectedWallet?.name"
                                :amount="selectedWallet?.amount"
                                :type="selectedWallet ? 'update' : 'create'"
                                @submit="handleSubmit"
                            />
                        </div>
                    </template>
                </USlideover>

                <!-- Floating Button -->
                <UButton
                    class="fixed bottom-24 right-6 z-50 p-4 rounded-4xl corner-squircle shadow-xl bg-accent-green text-dark hover:scale-105 transition-transform"
                    icon="solar:add-square-linear"
                    aria-label="Tambah kantong"
                    @click="openForm = true"
                />
            </div>

            <!-- list -->
            <div
                v-if="list.length > 0"
                class="overflow-x-auto pb-4 px-1"
                :class="{ 'overflow-x-hidden': isPages }"
            >
                <div
                    class="gap-4 pb-12"
                    :class="{ 'grid grid-cols-2': isPages, 'flex min-w-max': !isPages }"
                >
                    <wallet-item :list="list" @selected="handleSelected" />
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

onMounted(() => {
    walletStore.initialize();
});

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
