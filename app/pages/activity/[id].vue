<template>
    <div class="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-dark">
        <!-- Background -->

        <div class="relative z-1">
            <app-nav-title title="Rincian Transaksi" @close="$router.back()" />

            <main class="px-4 pb-8 pt-4">
                <!-- Amount Summary -->
                <section
                    class="relative flex flex-col items-center rounded-4xl bg-accent-green py-8 px-6"
                >
                    <!-- <div
                        class="absolute rounded-lg -top-4 right-10 px-3 py-2 text-[10px] bg-accent-green shadow-sm shadow-dark font-black uppercase"
                        :class="isExpense ? 'text-accent-red' : 'text-accent-blue'"
                    >
                        {{ isExpense ? "Uang Keluar" : "Uang Masuk" }}
                    </div> -->
                    <div class="relative z-1">
                        <div class="flex flex-col items-center justify-center">
                            <p class="uppercase text-sm font-bold tracking-wide text-dark">
                                Total Transaksi
                            </p>

                            <h1 class="text-4xl font-black leading-none text-dark">
                                {{ isExpense ? "-" : "+" }}
                                {{ useFormatPriceIntl(detail?.amount || 0) }}
                            </h1>

                            <div
                                class="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] bg-white-smooth/40 font-black uppercase"
                                :class="isExpense ? 'text-accent-red' : 'text-accent-blue'"
                            >
                                <UIcon :name="transactionIcon" class="text-lg" />
                                {{ detail?.category_name || "-" }}
                                <!-- {{ isExpense ? "Uang Keluar" : "Uang Masuk" }} -->
                            </div>

                            <!-- <div
                                class="flex size-16 shrink-0 items-center bg-dark justify-center rounded-[1.5rem]"
                                :class="isExpense ? 'text-accent-red' : 'text-accent-green'"
                            >
                                <UIcon :name="transactionIcon" class="text-3xl" />
                            </div> -->
                        </div>

                        <!-- <div class="rounded-[1.5rem] bg-white-smooth py-3 px-4">
                            <p class="text-xs font-bold uppercase tracking-wider text-dark">
                                Kategori
                            </p>

                            <div class="flex items-start justify-between gap-3">
                                <h2 class="truncate text-lg font-black capitalize text-dark">
                                    {{ detail?.category_name || "-" }}
                                </h2>
                            </div>
                        </div> -->
                    </div>
                </section>

                <!-- Detail Info -->
                <section class="relative overflow-hidden mt-5 rounded-4xl bg-white-smooth p-4">
                    <div class="py-4 mb-4">
                        <h2 class="text-md font-black uppercase text-dark">Detail Transaksi</h2>
                    </div>

                    <div class="flex flex-col divide-y divide-dashed divide-neutral-300">
                        <div class="flex items-start gap-3 py-4 first:pt-0">
                            <div
                                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-green text-dark"
                            >
                                <UIcon name="solar:hashtag-linear" class="text-xl" />
                            </div>

                            <div class="min-w-0 flex-1">
                                <p class="text-xs uppercase tracking-wider text-dark">
                                    ID Transaksi
                                </p>
                                <p class="mt-1 break-all text-sm font-black text-dark">
                                    {{ detail?.id || "-" }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start gap-3 py-4">
                            <div
                                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-green text-dark"
                            >
                                <UIcon name="solar:wallet-2-bold" class="text-xl" />
                            </div>

                            <div class="min-w-0 flex-1">
                                <p class="text-xs uppercase tracking-wider text-dark">Kantong</p>
                                <p class="mt-1 text-sm font-black text-dark">
                                    {{ detail?.wallet_name || "-" }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start gap-3 py-4">
                            <div
                                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-green text-dark"
                            >
                                <UIcon name="solar:calendar-linear" class="text-xl" />
                            </div>

                            <div class="min-w-0 flex-1">
                                <p class="text-xs uppercase tracking-wider text-dark">
                                    Tanggal Transaksi
                                </p>
                                <p class="mt-1 text-sm font-black text-dark">
                                    {{
                                        useDateFormat(detail?.created_at, "dddd, DD MMMM YYYY", {
                                            locales: "ID",
                                        })
                                    }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start gap-3 py-4 last:pb-0">
                            <div
                                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-green text-dark"
                            >
                                <UIcon name="solar:notes-linear" class="text-xl" />
                            </div>

                            <div class="min-w-0 flex-1">
                                <p class="text-xs uppercase tracking-wider text-dark">Keterangan</p>
                                <p class="mt-1 text-sm font-black leading-6 text-dark">
                                    {{ detail?.notes || "Tidak ada keterangan" }}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="mt-5">
                    <UButton
                        block
                        size="lg"
                        class="mt-5 rounded-2xl bg-accent-red/90 py-4 font-black uppercase text-white hover:bg-accent-red/90"
                        @click="isConfirmOpen = true"
                    >
                        Remove
                    </UButton>
                </section>

                <UModal v-model:open="isConfirmOpen">
                    <template #content>
                        <div class="bg-accent-green rounded-4xl p-6 flex flex-col gap-4">
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-red/80 text-white"
                                >
                                    <UIcon
                                        name="solar:trash-bin-minimalistic-bold"
                                        class="text-2xl"
                                    />
                                </div>
                                <div>
                                    <h3 class="text-lg font-black uppercase text-dark">
                                        Hapus Transaksi?
                                    </h3>
                                    <p class="text-sm text-dark">
                                        Data yang dihapus tidak bisa dikembalikan.
                                    </p>
                                </div>
                            </div>

                            <div class="flex gap-3 mt-4">
                                <UButton
                                    block
                                    size="lg"
                                    class="flex-1 rounded-xl bg-white py-3 font-black uppercase text-dark ring-1 ring-dark hover:bg-neutral-100"
                                    @click="isConfirmOpen = false"
                                >
                                    Batal
                                </UButton>
                                <UButton
                                    block
                                    size="lg"
                                    :loading="isDeleting"
                                    class="flex-1 rounded-xl bg-accent-red py-3 font-black uppercase text-white hover:bg-accent-red/90"
                                    @click="handleRemove()"
                                >
                                    Hapus
                                </UButton>
                            </div>
                        </div>
                    </template>
                </UModal>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ name: "transaction-detail", title: "Detail Transaksi" });

useHead({ bodyAttrs: { class: "" }, title: "Detail Transaksi" });

const route = useRoute();
const id = computed(() => route.params.id?.toString());

const transactionsStore = useTransactionsStore();

await callOnce(
    "transactions-detail",
    () => transactionsStore.getTransactionsWithCategoryById(id.value || ""),
    { mode: "navigation" },
);

const detail = computed(() => transactionsStore.transactionDetail);

const isExpense = computed(() => detail.value?.category_type === "expenses");

const transactionIcon = computed(() => {
    return isExpense.value ? "solar:arrow-left-down-linear" : "solar:arrow-right-up-linear";
});

const isConfirmOpen = ref(false);
const isDeleting = ref(false);

const handleRemove = async () => {
    isDeleting.value = true;
    const result = await transactionsStore.deleteTransaction(id.value || "");
    isDeleting.value = false;
    isConfirmOpen.value = false;
    if (result?.success) {
        useToast().add({
            title: "Success",
            description: "Data berhasil dihapus",
            color: "success",
        });
        navigateTo({ name: "transactions-page", replace: true });
    } else {
        useToast().add({ title: "Error", description: result?.message, color: "error" });
    }
};
</script>
