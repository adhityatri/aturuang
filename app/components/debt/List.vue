<script setup lang="ts">
import type { iDebt } from "~/types/debt";
import { debtStatusLabel, debtTypeLabel } from "~/types/debt";

defineProps<{
    debts: iDebt[];
    loading: boolean;
    emptyIcon: string;
    emptyTitle: string;
    emptyDesc: string;
}>();

const emit = defineEmits<{ pay: [debt: iDebt]; remove: [debt: iDebt] }>();

const formatDate = (dateStr: string) => {
    return useDateFormat(dateStr, "DD MMM YYYY", { locales: "id-ID" });
};

const isOverdue = (debt: iDebt) => {
    if (debt.status === "paid" || !debt.due_date) return false;

    const due = new Date(`${debt.due_date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return due.getTime() < today.getTime();
};

const progress = (debt: iDebt) => {
    const amount = Number(debt.amount);
    if (!amount) return 0;

    return Math.min(100, Math.round((Number(debt.paid_amount) / amount) * 100));
};
</script>

<template>
    <div class="flex w-full flex-1 flex-col gap-2 overflow-auto bg-white p-4">
        <template v-if="loading">
            <div
                v-for="i in 3"
                :key="i"
                class="corner-based flex flex-col gap-3 bg-white p-4 ring-1 ring-dark/5"
            >
                <div class="flex items-center gap-3">
                    <USkeleton class="size-10 shrink-0 rounded-xl" />
                    <div class="flex-1 space-y-2">
                        <USkeleton class="h-4 w-2/3" />
                        <USkeleton class="h-3 w-1/2" />
                    </div>
                    <USkeleton class="h-4 w-20" />
                </div>
                <USkeleton class="h-1.5 w-full rounded-full" />
            </div>
        </template>

        <template v-else-if="debts.length > 0">
            <div
                v-for="debt in debts"
                :key="debt.id"
                class="corner-based flex flex-col gap-3 bg-white p-4 shadow-sm shadow-base-color ring-1 ring-dark/5"
                :class="debt.status === 'paid' ? 'opacity-60' : ''"
            >
                <div class="flex items-start gap-3">
                    <div class="min-w-0 flex-1">
                        <UBadge
                            size="sm"
                            variant="soft"
                            class="mb-1"
                            :ui="{ base: 'px-2 rounded-xl corner-squircle' }"
                            :color="debt.type === 'debt' ? 'error' : 'success'"
                        >
                            {{ debtTypeLabel[debt.type] }}
                        </UBadge>
                        <!-- <div class="flex items-center gap-2"> -->
                        <p class="truncate text-sm font-bold text-dark">
                            {{ debt.counterparty }}
                        </p>
                        <!-- <UBadge
                                size="sm"
                                variant="subtle"
                                :color="debt.type === 'debt' ? 'error' : 'success'"
                            >
                                {{ debtTypeLabel[debt.type] }}
                            </UBadge> -->
                        <!-- </div> -->
                        <p class="mt-0.5 text-[10px] font-medium text-neutral-400">
                            {{ debtStatusLabel[debt.status] }} •
                            {{ formatDate(debt.created_at) }}
                        </p>
                        <p v-if="debt.note" class="mt-1 truncate text-[11px] text-neutral-500">
                            {{ debt.note }}
                        </p>
                    </div>

                    <div class="shrink-0 text-right">
                        <p class="text-sm font-black text-dark">
                            {{ useFormatPriceIntl(debt.remaining_amount) }}
                        </p>
                        <p class="text-[10px] font-medium text-neutral-400">
                            dari {{ useFormatPriceIntl(debt.amount) }}
                        </p>
                    </div>
                </div>

                <div class="h-1.5 w-full overflow-hidden rounded-full bg-dark/6">
                    <div
                        class="h-full rounded-full transition-all"
                        :class="debt.type === 'debt' ? 'bg-accent-red' : 'bg-accent-green'"
                        :style="{ width: `${progress(debt)}%` }"
                    />
                </div>

                <div class="flex items-center justify-between gap-2">
                    <div
                        class="flex min-w-0 items-center gap-1 text-[10px] font-bold"
                        :class="isOverdue(debt) ? 'text-accent-red' : 'text-neutral-400'"
                    >
                        <template v-if="debt.due_date">
                            <UIcon name="solar:calendar-linear" class="shrink-0 text-sm" />
                            <span class="truncate">
                                {{ isOverdue(debt) ? "Terlambat • " : "Jatuh tempo " }}
                                {{ formatDate(debt.due_date) }}
                            </span>
                        </template>
                        <span v-else>Tanpa jatuh tempo</span>
                    </div>

                    <div class="flex shrink-0 items-center gap-1.5">
                        <UButton
                            v-if="debt.status !== 'paid'"
                            size="xs"
                            :label="debt.type === 'debt' ? 'Bayar' : 'Terima'"
                            icon="solar:wallet-2-bold"
                            class="corner-based px-2.5 text-[10px] font-black uppercase"
                            :ui="{ base: 'bg-dark text-white' }"
                            @click="$emit('pay', debt)"
                        />
                        <UBadge
                            v-else
                            size="sm"
                            variant="subtle"
                            color="success"
                            icon="solar:check-read-bold"
                        >
                            Lunas
                        </UBadge>

                        <UButton
                            size="xs"
                            icon="solar:trash-bin-minimalistic-bold"
                            color="error"
                            variant="soft"
                            class="corner-based px-2"
                            aria-label="Hapus catatan"
                            @click="$emit('remove', debt)"
                        />
                    </div>
                </div>
            </div>
        </template>

        <div v-else class="flex flex-1 flex-col items-center justify-center gap-4 py-12">
            <div
                class="flex size-16 items-center justify-center rounded-2xl border-dark bg-accent-green text-dark shadow-xl shadow-base-color"
            >
                <UIcon :name="emptyIcon" class="text-3xl" />
            </div>
            <div class="text-center">
                <p class="text-lg font-black text-dark">
                    {{ emptyTitle }}
                </p>
                <p class="mt-1 text-sm text-neutral-400">
                    {{ emptyDesc }}
                </p>
            </div>
        </div>
    </div>
</template>
