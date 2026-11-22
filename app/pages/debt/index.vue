<template>
    <div class="flex flex-1 flex-col relative main-bg overflow-hidden">
        <app-nav-title
            title="Utang Piutang"
            icon="solar:alt-arrow-left-line-duotone"
            @close="$router.back()"
        />
        <!-- <div class="main-bg">
             <app-title-page dark>
                <p class="font-bold">Utang Piutang</p>
                <template #subtitle>
                    <span class="text-dark/40">
                        {{ filteredDebts.length === 0 ? "Tidak ada" : filteredDebts.length }}
                        Catatan
                    </span>
                </template>
            </app-title-page>
        </div> -->

        <!-- Floating Button -->
        <UButton
            class="fixed bottom-24 right-6 z-50 p-4 rounded-4xl corner-squircle shadow-xl bg-accent-green text-dark hover:scale-105 active:bg-accent-green/70 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all"
            icon="solar:add-square-bold"
            aria-label="Tambah catatan"
            @click="openCreate = true"
        />
        <debt-create v-model:open="openCreate" :is-saving="isSaving" @submit="handleCreate" />

        <div class="grid grid-cols-2 my-4 gap-4 px-6 py-4">
            <debt-summary-card
                variant="debt"
                :amount="debtStore.totalDebt"
                :count="debtStore.debtCount"
                :selected="activeFilter === 'debt'"
                @click="activeFilter = 'debt'"
            />
            <debt-summary-card
                variant="receivable"
                :amount="debtStore.totalReceivable"
                :count="debtStore.receivableCount"
                :selected="activeFilter === 'receivable'"
                @click="activeFilter = 'receivable'"
            />
        </div>

        <div class="w-full px-4 pb-2 mb-2">
            <UInput
                v-model="search"
                icon="i-lucide-search"
                class="w-full"
                size="xl"
                variant="outline"
                placeholder="Cari nama atau catatan"
                aria-label="Cari utang piutang"
                :ui="{ base: 'ps-12! pr-12!' }"
                @keydown.esc="search = ''"
            >
                <template v-if="search" #trailing>
                    <UButton
                        icon="i-lucide-x"
                        color="neutral"
                        variant="link"
                        size="xs"
                        aria-label="Hapus pencarian"
                        class="text-dark/50 hover:text-dark"
                        @click="search = ''"
                    />
                </template>
            </UInput>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto px-4 py-2">
            <button
                v-for="tab in filters"
                :key="tab.value"
                type="button"
                class="corner-based shadow-xl shadow-base-color ring-1 ring-dark/4 shrink-0 px-3 py-2 text-[10px] font-black uppercase transition-all active:scale-95"
                :class="activeFilter === tab.value ? 'bg-dark text-white' : 'bg-white text-dark/60'"
                @click="activeFilter = tab.value"
            >
                {{ tab.label }}
            </button>
        </div>

        <div class="flex flex-1 overflow-y-auto pb-22">
            <debt-list
                :debts="filteredDebts"
                :loading="debtStore.loading && debts.length === 0"
                :empty-icon="emptyIcon"
                :empty-title="emptyTitle"
                :empty-desc="emptyDesc"
                @pay="handlePay"
                @remove="askRemove"
            />
        </div>

        <debt-payment
            v-model:open="openPayment"
            :debt="selectedDebt"
            :is-saving="isPaying"
            @submit="submitPayment"
        />

        <UModal v-model:open="isConfirmOpen">
            <template #content>
                <div class="flex flex-col gap-4 rounded-4xl bg-accent-green p-6">
                    <div class="flex items-center gap-3">
                        <div
                            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-red/80 text-white"
                        >
                            <UIcon name="solar:trash-bin-minimalistic-bold" class="text-2xl" />
                        </div>
                        <div>
                            <h3 class="text-lg font-black uppercase text-dark">Hapus Catatan?</h3>
                            <p class="text-sm text-dark">
                                {{
                                    debtToRemove
                                        ? `Catatan ${debtTypeLabel[debtToRemove.type].toLowerCase()} ${debtToRemove.counterparty} akan dihapus permanen.`
                                        : "Data yang dihapus tidak bisa dikembalikan."
                                }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-2 flex gap-3">
                        <UButton
                            block
                            size="lg"
                            label="Batal"
                            class="flex-1 rounded-xl bg-white py-3 font-black uppercase text-dark ring-1 ring-dark hover:bg-neutral-100"
                            @click="isConfirmOpen = false"
                        />
                        <UButton
                            block
                            size="lg"
                            label="Hapus"
                            :loading="isDeleting"
                            class="flex-1 rounded-xl bg-accent-red py-3 font-black uppercase text-white hover:bg-accent-red/90"
                            @click="handleRemove"
                        />
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type { iDebt, iDebtCreate, iDebtPaymentCreate } from "~/types/debt";
import { debtTypeLabel } from "~/types/debt";

definePageMeta({ name: "debt-page" });
useHead({ title: "Utang Piutang" });

const debtStore = useDebts();

const filters = [
    { label: "Semua", value: "all" },
    { label: "Utang", value: "debt" },
    { label: "Piutang", value: "receivable" },
    { label: "Lunas", value: "paid" },
] as const;

type filterValue = (typeof filters)[number]["value"];

const activeFilter = ref<filterValue>("all");
const search = ref("");
const debouncedSearch = refDebounced(search, 300);

const openCreate = ref(false);
const isSaving = ref(false);

const openPayment = ref(false);
const selectedDebt = ref<iDebt | null>(null);
const isPaying = ref(false);

const isConfirmOpen = ref(false);
const debtToRemove = ref<iDebt | null>(null);
const isDeleting = ref(false);

const debts = computed(() => debtStore.debts);
const normalizedSearch = computed(() => debouncedSearch.value.trim().toLowerCase());
const isSearching = computed(() => normalizedSearch.value.length > 0);

const filteredDebts = computed(() => {
    let result = debts.value;

    if (activeFilter.value === "debt" || activeFilter.value === "receivable") {
        result = result.filter((debt) => debt.type === activeFilter.value);
    } else if (activeFilter.value === "paid") {
        result = result.filter((debt) => debt.status === "paid");
    }

    if (isSearching.value) {
        result = result.filter(
            (debt) =>
                debt.counterparty.toLowerCase().includes(normalizedSearch.value) ||
                (debt.note ?? "").toLowerCase().includes(normalizedSearch.value),
        );
    }

    return [...result].sort((a, b) => {
        const aPaid = a.status === "paid" ? 1 : 0;
        const bPaid = b.status === "paid" ? 1 : 0;
        if (aPaid !== bPaid) return aPaid - bPaid;

        const aDue = a.due_date ? new Date(`${a.due_date}T00:00:00`).getTime() : Infinity;
        const bDue = b.due_date ? new Date(`${b.due_date}T00:00:00`).getTime() : Infinity;
        if (aDue !== bDue) return aDue - bDue;

        return b.created_at.localeCompare(a.created_at);
    });
});

const emptyIcon = computed(() => {
    if (isSearching.value) return "solar:magnifer-bug-line-duotone";
    if (activeFilter.value === "paid") return "solar:check-circle-bold";
    if (activeFilter.value === "debt") return "solar:hand-money-broken";
    if (activeFilter.value === "receivable") return "solar:hand-money-broken";
    return "solar:inbox-archive-line-duotone";
});

const emptyTitle = computed(() => {
    if (isSearching.value) return "Catatan tidak ditemukan";
    if (activeFilter.value === "paid") return "Belum ada yang lunas";
    if (activeFilter.value === "debt") return "Belum ada utang";
    if (activeFilter.value === "receivable") return "Belum ada piutang";
    return "Belum ada catatan";
});

const emptyDesc = computed(() => {
    if (isSearching.value) {
        return `Tidak ada catatan yang cocok dengan "${debouncedSearch.value.trim()}".`;
    }
    if (activeFilter.value === "paid") return "Catatan yang sudah lunas akan muncul di sini";
    return "Tekan tombol tambah untuk mencatat utang atau piutang";
});

const errorMessage = (err: unknown) =>
    err instanceof Error ? err.message : "Terjadi kesalahan, coba lagi.";

const handleCreate = async (payload: iDebtCreate) => {
    if (isSaving.value) return;

    isSaving.value = true;
    try {
        await debtStore.insertDebt(payload);
        openCreate.value = false;
        useToast().add({
            title: "Tersimpan",
            description: `${payload.type === "debt" ? "Utang" : "Piutang"} ${payload.counterparty} berhasil dicatat`,
            color: "success",
        });
    } catch (err) {
        useToast().add({
            title: "Gagal menyimpan",
            description: errorMessage(err),
            color: "error",
        });
    } finally {
        isSaving.value = false;
    }
};

const handlePay = (debt: iDebt) => {
    selectedDebt.value = debt;
    openPayment.value = true;
};

const submitPayment = async (payload: iDebtPaymentCreate) => {
    if (!selectedDebt.value || isPaying.value) return;

    const debt = selectedDebt.value;
    isPaying.value = true;
    try {
        const result = await debtStore.addPayment(debt.id, payload);
        openPayment.value = false;
        useToast().add({
            title: result?.debt?.status === "paid" ? "Lunas" : "Tersimpan",
            description:
                result?.debt?.status === "paid"
                    ? `Catatan ${debt.counterparty} sudah lunas`
                    : `${useFormatPriceIntl(payload.amount)} tercatat untuk ${debt.counterparty}`,
            color: "success",
        });
    } catch (err) {
        useToast().add({
            title: "Gagal menyimpan",
            description: errorMessage(err),
            color: "error",
        });
    } finally {
        isPaying.value = false;
    }
};

const askRemove = (debt: iDebt) => {
    debtToRemove.value = debt;
    isConfirmOpen.value = true;
};

const handleRemove = async () => {
    if (!debtToRemove.value || isDeleting.value) return;

    isDeleting.value = true;
    try {
        await debtStore.removeDebt(debtToRemove.value.id);
        isConfirmOpen.value = false;
        debtToRemove.value = null;
        useToast().add({
            title: "Terhapus",
            description: "Catatan berhasil dihapus",
            color: "success",
        });
    } catch (err) {
        useToast().add({
            title: "Gagal menghapus",
            description: errorMessage(err),
            color: "error",
        });
    } finally {
        isDeleting.value = false;
    }
};

await useAsyncData("debts-data", () => debtStore.getDebts(), {
    lazy: true,
    dedupe: "defer",
    server: false,
});
</script>
