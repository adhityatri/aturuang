<template>
    <div class="w-full flex flex-col gap-4 mb-4 overflow-hidden">
        <template v-if="isLoading">
            <div class="flex justify-between items-center">
                <USkeleton class="h-4 w-[150px] bg-neutral-300 rounded-xl" />
                <USkeleton class="h-6 w-[150px] bg-neutral-300 rounded-xl" />
            </div>

            <div class="grid grid-cols-2 gap-4 mt-4">
                <USkeleton
                    v-for="i in 4"
                    :key="i"
                    class="h-[70px] bg-neutral-300 rounded-xl border-[1.5px] border-[#111111]"
                />
            </div>
        </template>
        <template v-else>
            <div
                class="flex justify-between items-center mb-4"
                :class="{ 'mb-0': isPages }"
            >
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-[#0A0A0A]" />
                    <h2
                        class="text-xl font-[800] uppercase tracking-tight text-[#0A0A0A]"
                    >
                        Kantong Saya
                    </h2>
                </div>
                <USlideover
                    v-model:open="openForm"
                    :dismissible="true"
                    :title="selectedWallet?.name || 'Kantong Baru'"
                    side="bottom"
                    :close="{ onClick: () => closeForm() }"
                >
                    <UButton
                        v-if="!isPages"
                        class="bg-[#FFD21E] text-[#0A0A0A] border-[1.5px] border-[#111111] shadow-[2px_2px_0px_#111111] py-3 px-6 rounded-lg font-bold uppercase tracking-wider hover:bg-[#ffe066] transition-colors"
                        icon="solar:add-square-linear"
                    />

                    <template #body>
                        <wallet-form
                            :name="selectedWallet?.name"
                            :amount="selectedWallet?.amount"
                            @close="closeForm"
                            @submit="handleSubmit"
                        />
                    </template>
                </USlideover>
            </div>
            <div
                v-if="list.length > 0"
                class="grid grid-cols-2 gap-4 max-h-[320px] pb-4 overflow-x-hidden overflow-y-auto"
                :class="{ 'max-h-screen': isPages }"
            >
                <wallet-item :list="list" @selected="handleSelected" />
                <UButton
                    v-if="!isPages"
                    class="bg-[#064EAF] text-white border-[1.5px] border-[#111111] shadow-[2px_2px_0px_#111111] px-4 py-3 rounded-lg flex flex-col items-center justify-center hover:bg-[#073B82] transition-colors"
                    @click="handleWallet()"
                >
                    <div class="uppercase tracking-widest font-black text-xs">
                        Lihat Semua →
                    </div>
                </UButton>
            </div>
            <div
                v-else
                class="bg-white border-[1.5px] border-[#111111] shadow-[4px_4px_0px_#111111] rounded-xl py-12"
            >
                <div
                    class="text-[#6B7280] tracking-widest text-[10px] font-black uppercase text-center flex flex-col gap-2"
                >
                    <p>Belum ada kantong</p>
                    <p
                        class="text-[#EF2B24] cursor-pointer"
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
