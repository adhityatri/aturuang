<template>
    <div class="relative flex min-h-dvh flex-1 flex-col overflow-hidden main-bg pb-14">
        <div class="relative z-1">
            <app-nav-title
                title="Detail Impian"
                icon="solar:alt-arrow-left-line-duotone"
                @close="$router.back()"
            />

            <section class="px-4 pb-6 pt-4 flex flex-col gap-4">
                <div class="flex flex-col">
                    <p class="truncate text-xl font-black leading-tight text-dark">
                        {{ wishlistStore.detailWishlist?.name || "Wishlist" }}
                    </p>
                    <p class="text-sm">
                        {{ useFormatPriceIntl(wishlistStore.detailWishlist?.target_amount) }}
                    </p>
                </div>
                <wishlist-progress-card
                    :current="wishlistStore.detailWishlist?.current_amount || 0"
                    :target="wishlistStore.detailWishlist?.target_amount || 0"
                    :progress="progress"
                />

                <button
                    type="button"
                    class="flex items-center justify-between rounded-2xl bg-white px-4 py-3 ring-1 ring-dark/10"
                    @click="openEdit = true"
                >
                    <div class="flex items-center gap-2 min-w-0">
                        <div class="rounded-full bg-accent-green size-8 place-content-center">
                            <UIcon
                                name="solar:wallet-money-linear"
                                class="text-md text-dark shrink-0"
                            />
                        </div>
                        <div class="min-w-0 text-left">
                            <p class="text-[10px] font-bold uppercase tracking-widest text-dark">
                                Kantong
                            </p>
                            <p class="text-sm font-black text-dark truncate">
                                {{ currentWalletName }}
                            </p>
                        </div>
                    </div>
                    <span class="text-xs font-bold text-dark shrink-0">
                        {{ wishlistStore.detailWishlist?.wallet_id ? "Ubah" : "Tambah" }}
                    </span>
                </button>
            </section>
        </div>

        <div class="px-4 mb-4">
            <UButton
                block
                size="xl"
                icon="solar:add-circle-linear"
                :ui="{
                    base: 'p-4! corner-based bg-accent-green flex items-center justify-center p-2 text-dark hover:bg-accent-green/90 active:bg-accent-green/80 active:translate-x-[2px] active:translate-y-[2px] shadow-xl shadow-base-color',
                }"
                @click="openAdd = true"
            >
                Tambah Dana Impianmu
            </UButton>
        </div>

        <main
            class="relative z-1 flex flex-1 flex-col border-t-2 border-dark/10 rounded-t-[2rem] bg-dark/4 p-4 pb-10"
        >
            <h2 class="mb-4 text-lg font-black text-dark">Riwayat Tabungan</h2>

            <div
                v-if="wishlistStore.contributions.length === 0"
                class="flex flex-1 flex-col items-center justify-center rounded-2xl bg-neutral-50 px-6 py-10 text-center shadow-xl shadow-base-color"
            >
                <p class="text-sm text-dark/70">Belum ada catatan tabungan.</p>
            </div>

            <div v-else class="flex flex-col gap-3">
                <div
                    v-for="c in wishlistStore.contributions"
                    :key="c.id"
                    class="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-dark/10"
                >
                    <div class="min-w-0 flex-1">
                        <p class="text-sm font-black text-dark">
                            +{{ useFormatPriceIntl(c.amount) }}
                        </p>
                        <p v-if="c.note" class="text-xs text-secondary truncate">{{ c.note }}</p>
                        <p class="text-[10px] font-bold text-dark/60 mt-1">
                            {{ new Date(c.created_at).toLocaleDateString("id-ID") }}
                        </p>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                        <UButton
                            icon="solar:pen-linear"
                            color="neutral"
                            variant="ghost"
                            size="sm"
                            aria-label="Ubah"
                            @click="openContributionEdit(c)"
                        />
                        <UButton
                            icon="solar:trash-bin-trash-linear"
                            color="error"
                            variant="ghost"
                            size="sm"
                            aria-label="Hapus"
                            @click="handleDeleteContribution(c)"
                        />
                    </div>
                </div>
            </div>
        </main>

        <USlideover
            v-model:open="openAdd"
            :dismissible="false"
            side="bottom"
            :ui="{ content: 'rounded-t-2xl' }"
        >
            <template #header>
                <div class="flex flex-1 items-start justify-between">
                    <div>
                        <h2 class="text-xl font-black text-dark">Tambah Dana Impian</h2>
                        <p class="mt-1 text-sm font-medium text-dark/70">
                            Catat tabungan untuk impian ini.
                        </p>
                    </div>
                    <UButton
                        icon="lucide:x"
                        color="neutral"
                        variant="ghost"
                        @click="openAdd = false"
                    />
                </div>
            </template>
            <template #body>
                <UForm
                    class="w-full flex flex-col gap-4"
                    :schema="schema"
                    :state="state"
                    @submit="handleAdd"
                >
                    <UFormField label="Jumlah" name="amount">
                        <UInputNumber
                            v-model="state.amount"
                            size="xl"
                            :format-options="{
                                style: 'currency',
                                currency: 'IDR',
                                maximumFractionDigits: 0,
                            }"
                            class="w-full"
                            :ui="{
                                base: 'rounded-4xl corner-squircle px-4 py-4 font-bold text-dark border-1 border-dark/15',
                            }"
                        />
                    </UFormField>
                    <UFormField label="Catatan" name="note">
                        <UInput
                            v-model="state.note"
                            size="xl"
                            placeholder="Opsional"
                            class="w-full"
                        />
                    </UFormField>
                    <UButton
                        block
                        size="xl"
                        color="primary"
                        type="submit"
                        :loading="isSubmitting"
                        class="corner-based bg-accent-green px-6 text-dark hover:bg-accent-green/90 disabled:bg-neutral-300 disabled:text-neutral-500"
                        :ui="{ base: 'py-4' }"
                    >
                        Simpan
                    </UButton>
                </UForm>
            </template>
        </USlideover>

        <USlideover
            v-model:open="openEdit"
            :dismissible="false"
            side="bottom"
            :ui="{ content: 'rounded-t-2xl' }"
        >
            <template #header>
                <div class="flex flex-1 items-start justify-between">
                    <div>
                        <h2 class="text-xl font-black text-dark">Kantong Impian</h2>
                        <p class="mt-1 text-sm font-medium text-dark/70">
                            Pilih kantong tempat dana impian disimpan.
                        </p>
                    </div>
                    <UButton
                        icon="lucide:x"
                        color="neutral"
                        variant="ghost"
                        @click="openEdit = false"
                    />
                </div>
            </template>
            <template #body>
                <div class="flex flex-col gap-4">
                    <UFormField label="Kantong" name="wallet_id">
                        <USelect
                            v-model="editState.wallet_id"
                            :items="[{ label: 'Belum dipilih', value: 'none' }, ...walletList]"
                            size="xl"
                            class="w-full"
                            :ui="{
                                base: 'corner-based capitalize  px-4 py-3',
                                content: 'corner-based bg-white capitalize',
                                itemWrapper: 'px-4',
                            }"
                        />
                    </UFormField>
                    <UButton
                        block
                        size="xl"
                        color="primary"
                        :loading="isUpdating"
                        class="corner-based bg-accent-green px-6 text-dark hover:bg-accent-green/90 disabled:bg-neutral-300 disabled:text-neutral-500"
                        :ui="{ base: 'py-4' }"
                        @click="handleUpdateWallet"
                    >
                        Simpan
                    </UButton>
                </div>
            </template>
        </USlideover>

        <USlideover
            v-model:open="openEditContribution"
            :dismissible="false"
            side="bottom"
            :ui="{ content: 'rounded-t-2xl' }"
        >
            <template #header>
                <div class="flex flex-1 items-start justify-between">
                    <div>
                        <h2 class="text-xl font-black text-dark">Ubah Dana</h2>
                        <p class="mt-1 text-sm font-medium text-dark/70">
                            Perbarui jumlah tabungan.
                        </p>
                    </div>
                    <UButton
                        icon="lucide:x"
                        color="neutral"
                        variant="ghost"
                        @click="openEditContribution = false"
                    />
                </div>
            </template>
            <template #body>
                <div class="flex flex-col gap-4">
                    <UFormField label="Jumlah" name="amount">
                        <UInputNumber
                            v-model="editContributionState.amount"
                            size="xl"
                            :min="1000"
                            :format-options="{
                                style: 'currency',
                                currency: 'IDR',
                                maximumFractionDigits: 0,
                            }"
                            class="w-full"
                            :ui="{
                                base: 'rounded-2xl bg-white px-4 py-4 font-bold text-dark ring-1 ring-dark',
                            }"
                        />
                    </UFormField>
                    <UButton
                        block
                        size="xl"
                        color="primary"
                        :loading="isUpdating"
                        class="corner-based bg-accent-green px-6 text-dark hover:bg-accent-green/90 disabled:bg-neutral-300 disabled:text-neutral-500"
                        :ui="{ base: 'py-4' }"
                        @click="handleUpdateContribution"
                    >
                        Simpan
                    </UButton>
                </div>
            </template>
        </USlideover>
    </div>
</template>

<script setup lang="ts">
import * as valibot from "valibot";

definePageMeta({ name: "wishlist-detail" });

const route = useRoute();
const id = computed(() => route.params.id as string);
const wishlistStore = useWishlist();
const walletStore = useWallets();

const openAdd = ref(false);
const openEdit = ref(false);
const openEditContribution = ref(false);
const isSubmitting = ref(false);
const isUpdating = ref(false);
const editingContribution = ref<{ id: string; amount: number } | null>(null);

const schema = valibot.required(
    valibot.object({
        amount: valibot.pipe(valibot.number(), valibot.minValue(1000, "Minimal Rp1.000")),
        note: valibot.optional(valibot.string()),
    }),
);

const state = reactive({ amount: 0, note: "" });
const editState = reactive({ wallet_id: "" });
const editContributionState = reactive({ amount: 0 });

const walletList = computed(() =>
    walletStore.wallets.map((w) => ({ label: useCapitalize(w.name), value: w.id })),
);

const currentWalletName = computed(() => {
    const wid = wishlistStore.detailWishlist?.wallet_id;
    if (!wid) return "Belum dipilih";
    return walletStore.wallets.find((w) => w.id === wid)?.name || "Kantong";
});

const progress = computed(() => {
    const w = wishlistStore.detailWishlist;
    if (!w?.target_amount) return 0;
    return Math.min(
        100,
        Math.round((Number(w.current_amount || 0) / Number(w.target_amount)) * 100),
    );
});

await useAsyncData(`wishlist-detail-${id.value}`, async () => {
    await Promise.all([
        wishlistStore.getWishlistById(id.value),
        wishlistStore.getContributions(id.value),
        walletStore.getWallets(),
    ]);
});

watch(openEdit, (val) => {
    if (val) editState.wallet_id = wishlistStore.detailWishlist?.wallet_id || "none";
});

const handleUpdateWallet = async () => {
    isUpdating.value = true;
    try {
        const res = await wishlistStore.updateWishlist(id.value, {
            wallet_id: editState.wallet_id === "none" ? null : editState.wallet_id,
        });
        if (res.error) {
            useToast().add({ title: "Impian", description: res.error.message, color: "error" });
            return;
        }
        useToast().add({
            title: "Impian",
            description: "Kantong berhasil diperbarui",
            color: "success",
        });
        openEdit.value = false;
    } finally {
        isUpdating.value = false;
    }
};

const handleAdd = async () => {
    isSubmitting.value = true;
    try {
        const res = await wishlistStore.addContribution(id.value, state.amount, state.note);
        if (res.error) {
            useToast().add({ title: "Wishlist", description: res.error.message, color: "error" });
            return;
        }
        useToast().add({
            title: "impian",
            description: "Dana berhasil ditambahkan",
            color: "success",
        });
        state.amount = 0;
        state.note = "";
        openAdd.value = false;
    } finally {
        isSubmitting.value = false;
    }
};

const openContributionEdit = (c: { id: string; amount: number }) => {
    editingContribution.value = { id: c.id, amount: c.amount };
    editContributionState.amount = Number(c.amount);
    openEditContribution.value = true;
};

const handleUpdateContribution = async () => {
    if (!editingContribution.value) return;
    if (Number(editContributionState.amount) < 1000) {
        useToast().add({ title: "Impian", description: "Minimal Rp1.000", color: "error" });
        return;
    }
    isUpdating.value = true;
    try {
        const res = await wishlistStore.updateContribution(
            editingContribution.value.id,
            id.value,
            editContributionState.amount,
        );
        if (res.error) {
            useToast().add({ title: "Impian", description: res.error.message, color: "error" });
            return;
        }
        useToast().add({
            title: "Impian",
            description: "Dana berhasil diperbarui",
            color: "success",
        });
        openEditContribution.value = false;
        editingContribution.value = null;
    } finally {
        isUpdating.value = false;
    }
};

const handleDeleteContribution = async (c: { id: string; amount: number }) => {
    if (!confirm("Hapus catatan tabungan ini?")) return;
    const res = await wishlistStore.deleteContribution(c.id, id.value, c.amount);
    if (res.error) {
        useToast().add({ title: "Impian", description: res.error.message, color: "error" });
        return;
    }
    useToast().add({ title: "Impian", description: "Dana berhasil dihapus", color: "success" });
};
</script>
