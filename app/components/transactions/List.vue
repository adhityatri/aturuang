<template>
    <section class="w-full">
        <!-- Header -->
        <div class="mb-4 flex items-center justify-between">
            <div>
                <div class="flex items-center gap-2">
                    <span class="size-3 bg-black" />
                    <h2
                        class="text-xl font-black uppercase tracking-tight text-dark"
                    >
                        {{ props.title }}
                    </h2>
                </div>

                <p
                    class="mt-1 text-xs font-bold uppercase tracking-wider text-secondary"
                >
                    {{ source.length }} transaksi tercatat
                </p>
            </div>

            <nuxt-link
                v-if="!isAll"
                to="/activity"
                class="flex size-12 items-center justify-center rounded-xl border-[1.5px] border-dark bg-accent-yellow text-dark shadow-[2px_2px_0px_#111111] transition hover:bg-yellow-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                aria-label="Lihat semua transaksi"
            >
                <UIcon
                    name="material-symbols-light:grid-view-rounded"
                    class="text-2xl"
                />
            </nuxt-link>
        </div>

        <!-- Card -->
        <UCard
            class="relative overflow-hidden rounded-2xl border-[1.5px] border-dark bg-white shadow-[3px_3px_0px_#111111]"
            :ui="{ body: 'p-4' }"
        >
            <!-- Bauhaus Decoration -->
            <div
                class="absolute -right-8 -top-8 size-24 rounded-full bg-accent-yellow"
            />
            <div
                class="absolute -left-10 bottom-0 size-20 rounded-tr-full bg-accent-blue"
            />

            <template v-if="isLoading">
                <div class="relative z-1 flex items-center justify-between">
                    <USkeleton class="h-5 w-40 rounded-xl bg-neutral-300" />
                    <USkeleton class="h-7 w-20 rounded-full bg-neutral-300" />
                </div>

                <div class="relative z-1 mt-5 flex flex-col gap-3">
                    <USkeleton
                        v-for="i in 5"
                        :key="i"
                        class="h-16 w-full rounded-2xl bg-neutral-300"
                    />
                </div>
            </template>

            <template v-else>
                <!-- Summary -->
                <div
                    v-if="isAll"
                    class="relative z-1 mb-4 flex items-center justify-between rounded-2xl border-[1.5px] border-dark bg-[#fffaf0] p-3 shadow-[2px_2px_0px_#111111]"
                >
                    <div>
                        <small
                            class="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue"
                        >
                            {{ groupTitle || "Terbaru" }}
                        </small>

                        <p class="mt-1 text-sm font-black text-dark">
                            Aktivitas Keuangan
                        </p>
                    </div>

                    <span
                        class="rounded-full border-[1.5px] border-dark bg-accent-blue px-3 py-1 text-xs font-black text-white"
                    >
                        {{ source.length }} item
                    </span>
                </div>

                <!-- Empty State -->
                <div
                    v-if="source.length === 0"
                    class="relative z-1 flex flex-col items-center justify-center rounded-2xl border-[1.5px] border-dashed border-dark bg-neutral-50 px-4 py-8 text-center"
                >
                    <div
                        class="mb-3 flex size-14 items-center justify-center rounded-full bg-accent-yellow text-dark"
                    >
                        <UIcon name="solar:receipt-linear" class="text-2xl" />
                    </div>

                    <h3 class="text-sm font-black uppercase text-dark">
                        Belum Ada Transaksi
                    </h3>

                    <p
                        class="mt-1 max-w-[220px] text-xs font-medium leading-5 text-secondary"
                    >
                        Tidak ada transaksi hari ini. Semua aktivitas baru akan
                        muncul di sini.
                    </p>
                </div>

                <!-- List -->
                <div v-else class="relative z-1 flex flex-col gap-2">
                    <transactions-item
                        v-for="value in source"
                        :key="value.id"
                        :transaction="value"
                        @click="navigateToTransactionDetail(value)"
                    />
                </div>
            </template>
        </UCard>
    </section>
</template>

<script setup lang="ts">
import type { iTransaction } from "~/types/transactions";

interface Props {
    title?: string;
    source?: iTransaction[];
    isAll?: boolean;
    groupTitle?: string;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: "Riwayat Transaksi",
    source: () => [] as iTransaction[],
    isAll: false,
    groupTitle: "",
    isLoading: false,
});

const { navigateToTransactionDetail } = useTransactionNavigation();
</script>
