<template>
    <div
        class="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-[#fffaf0]"
    >
        <!-- Background -->
        <div class="absolute inset-0 z-0 bg-accent-blue" />
        <div class="absolute inset-0 z-0 custom-bg opacity-30" />
        <div
            class="absolute -right-16 top-28 size-40 rounded-full bg-accent-yellow"
        />
        <div
            class="absolute -left-16 top-64 size-36 rounded-full bg-accent-red"
        />

        <div class="relative z-1">
            <app-nav-title title="Rincian Transaksi" @close="$router.back()" />

            <main class="px-4 pb-8 pt-4">
                <!-- Amount Summary -->
                <section
                    class="relative overflow-hidden rounded-[2rem] border-[2px] border-dark bg-white p-5 shadow-[5px_5px_0px_#111111]"
                >
                    <div
                        class="absolute -right-10 -top-10 size-28 rounded-full bg-accent-yellow"
                    />
                    <div
                        class="absolute -bottom-12 -left-10 size-28 rounded-tr-full bg-accent-blue"
                    />

                    <div class="relative z-1">
                        <div
                            class="mb-4 flex items-center justify-between gap-4"
                        >
                            <div>
                                <p
                                    class="text-[10px] font-black uppercase tracking-[0.24em] text-accent-blue"
                                >
                                    Total Transaksi
                                </p>

                                <h1
                                    class="mt-2 text-4xl font-black leading-none"
                                    :class="
                                        isExpense
                                            ? 'text-accent-red'
                                            : 'text-accent-blue'
                                    "
                                >
                                    {{ isExpense ? "-" : "+" }}
                                    {{
                                        useFormatPriceIntl(detail?.amount || 0)
                                    }}
                                </h1>
                            </div>

                            <div
                                class="flex size-16 shrink-0 items-center justify-center rounded-2xl border-[2px] border-dark text-white shadow-[3px_3px_0px_#111111]"
                                :class="
                                    isExpense
                                        ? 'bg-accent-red'
                                        : 'bg-accent-blue'
                                "
                            >
                                <UIcon
                                    :name="transactionIcon"
                                    class="text-3xl"
                                />
                            </div>
                        </div>

                        <div
                            class="rounded-2xl border-[1.5px] border-dark bg-[#fffaf0] p-3"
                        >
                            <p
                                class="text-xs font-bold uppercase tracking-wider text-secondary"
                            >
                                Kategori
                            </p>

                            <div
                                class="mt-2 flex items-center justify-between gap-3"
                            >
                                <h2
                                    class="truncate text-lg font-black capitalize text-dark"
                                >
                                    {{ detail?.category_name || "-" }}
                                </h2>

                                <span
                                    class="rounded-full border-[1.5px] border-dark px-3 py-1 text-[10px] font-black uppercase"
                                    :class="
                                        isExpense
                                            ? 'bg-red-50 text-accent-red'
                                            : 'bg-blue-50 text-accent-blue'
                                    "
                                >
                                    {{
                                        isExpense ? "Uang Keluar" : "Uang Masuk"
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Detail Info -->
                <section
                    class="mt-5 rounded-[2rem] border-[2px] border-dark bg-white p-4 shadow-[5px_5px_0px_#111111]"
                >
                    <div class="mb-4 flex items-center gap-2">
                        <span class="size-3 bg-dark" />
                        <h2 class="text-lg font-black uppercase text-dark">
                            Detail
                        </h2>
                    </div>

                    <div
                        class="flex flex-col divide-y divide-dashed divide-neutral-300"
                    >
                        <div class="flex items-start gap-3 py-4 first:pt-0">
                            <div
                                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-yellow text-dark"
                            >
                                <UIcon
                                    name="solar:hashtag-linear"
                                    class="text-xl"
                                />
                            </div>

                            <div class="min-w-0 flex-1">
                                <p
                                    class="text-xs font-bold uppercase tracking-wider text-secondary"
                                >
                                    ID Transaksi
                                </p>
                                <p
                                    class="mt-1 break-all text-sm font-black text-dark"
                                >
                                    {{ detail?.id || "-" }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start gap-3 py-4">
                            <div
                                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-blue text-white"
                            >
                                <UIcon
                                    name="solar:wallet-2-bold"
                                    class="text-xl"
                                />
                            </div>

                            <div class="min-w-0 flex-1">
                                <p
                                    class="text-xs font-bold uppercase tracking-wider text-secondary"
                                >
                                    Kantong
                                </p>
                                <p class="mt-1 text-sm font-black text-dark">
                                    {{ detail?.wallet_name || "-" }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start gap-3 py-4">
                            <div
                                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-yellow text-dark"
                            >
                                <UIcon
                                    name="solar:calendar-linear"
                                    class="text-xl"
                                />
                            </div>

                            <div class="min-w-0 flex-1">
                                <p
                                    class="text-xs font-bold uppercase tracking-wider text-secondary"
                                >
                                    Tanggal Transaksi
                                </p>
                                <p class="mt-1 text-sm font-black text-dark">
                                    {{
                                        useDateFormat(
                                            detail?.created_at,
                                            "dddd, DD MMMM YYYY",
                                            { locales: "ID" },
                                        )
                                    }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start gap-3 py-4 last:pb-0">
                            <div
                                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-red text-white"
                            >
                                <UIcon
                                    name="solar:notes-linear"
                                    class="text-xl"
                                />
                            </div>

                            <div class="min-w-0 flex-1">
                                <p
                                    class="text-xs font-bold uppercase tracking-wider text-secondary"
                                >
                                    Keterangan
                                </p>
                                <p
                                    class="mt-1 text-sm font-black leading-6 text-dark"
                                >
                                    {{
                                        detail?.notes || "Tidak ada keterangan"
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ name: "transaction-detail", title: "Detail Transaksi" });

useHead({ bodyAttrs: { class: "" }, title: "Detail Transaksi" });

const route = useRoute();
const id = computed(() => route.query.id?.toString());

const transactionsStore = useTransactionsStore();

await callOnce(
    "transactions-detail",
    () => transactionsStore.getTransactionsWithCategoryById(id.value || ""),
    { mode: "navigation" },
);

const detail = computed(() => transactionsStore.transactionDetail);

const isExpense = computed(() => detail.value?.category_type === "expenses");

const transactionIcon = computed(() => {
    return isExpense.value
        ? "solar:arrow-left-down-linear"
        : "solar:arrow-right-up-linear";
});
</script>
