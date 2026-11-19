<script setup lang="ts">
import type { iDebt, iDebtPaymentCreate } from "~/types/debt";

interface Props {
    debt: iDebt | null;
    isSaving?: boolean;
}

const props = withDefaults(defineProps<Props>(), { isSaving: false });
const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{ submit: [payload: iDebtPaymentCreate] }>();

const debtStore = useDebts();

const amount = ref<number | null>(null);
const paidAt = ref("");
const note = ref("");

const remaining = computed(() => Number(props.debt?.remaining_amount ?? 0));
const isDebt = computed(() => props.debt?.type === "debt");
const actionLabel = computed(() => (isDebt.value ? "Bayar" : "Terima"));

const payments = computed(() => debtStore.payments);
const paymentsLoading = computed(() => debtStore.paymentsLoading);
const remainingAfter = computed(() => Math.max(remaining.value - Number(amount.value || 0), 0));

const isValid = computed(() => {
    const value = Number(amount.value);
    return (
        Number.isFinite(value) && value > 0 && value <= remaining.value && paidAt.value.length > 0
    );
});

const todayISO = () => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
};

const formatDate = (dateStr: string) => {
    return useDateFormat(dateStr, "DD MMM YYYY", { locales: "id-ID" });
};

const fillRemaining = () => {
    amount.value = remaining.value;
};

const resetForm = () => {
    amount.value = null;
    paidAt.value = todayISO();
    note.value = "";
};

const submit = () => {
    if (!isValid.value || props.isSaving) return;

    emit("submit", {
        amount: Number(amount.value),
        paid_at: paidAt.value,
        note: note.value.trim() || null,
    });
};

watch(
    [open, () => props.debt?.id],
    async ([isOpen, debtId]) => {
        if (isOpen && debtId) {
            resetForm();
            try {
                await debtStore.getPayments(debtId);
            } catch {
                useToast().add({
                    title: "Gagal memuat riwayat",
                    description: "Riwayat pembayaran tidak bisa dimuat.",
                    color: "error",
                });
            }
        } else {
            amount.value = null;
        }
    },
    { immediate: true },
);
</script>

<template>
    <USlideover
        v-model:open="open"
        :dismissible="!isSaving"
        :ui="{ content: 'rounded-t-2xl' }"
        side="bottom"
        :title="`${actionLabel} ${isDebt ? 'Utang' : 'Piutang'}`"
    >
        <template #body>
            <div v-if="debt" class="flex flex-col gap-4 py-2">
                <div class="rounded-2xl bg-dark/5 p-4">
                    <p class="text-[10px] font-black uppercase tracking-wide text-dark/40">
                        {{ actionLabel }} untuk
                    </p>
                    <p class="truncate text-lg font-bold text-dark">
                        {{ debt.counterparty }}
                    </p>

                    <div class="mt-3 flex items-end justify-between">
                        <span class="text-xs font-medium text-dark/50">Sisa</span>
                        <span class="text-base font-black text-dark">
                            {{ useFormatPriceIntl(remaining) }}
                        </span>
                    </div>
                    <div class="mt-1 flex items-end justify-between">
                        <span class="text-xs font-medium text-dark/50">Total</span>
                        <span class="text-xs font-bold text-dark/60">
                            {{ useFormatPriceIntl(debt.amount) }}
                        </span>
                    </div>
                </div>

                <UFormField :label="isDebt ? 'Jumlah Dibayar' : 'Jumlah Diterima'">
                    <div class="flex w-full items-center gap-2">
                        <UInputNumber
                            v-model="amount"
                            hide-button
                            orientation="vertical"
                            size="xl"
                            placeholder="0"
                            :max="remaining"
                            :format-options="{
                                style: 'currency',
                                currency: 'IDR',
                                currencyDisplay: 'narrowSymbol',
                                compactDisplay: 'short',
                                maximumFractionDigits: 0,
                                currencySign: 'standard',
                            }"
                            class="flex-1"
                            :ui="{
                                base: 'rounded-2xl corner-squircle! focus-visible:ring-dark/30! outline-accent-green/25! ring-1!  bg-white px-4 py-4 font-bold text-dark',
                                increment: 'hidden',
                                decrement: 'hidden',
                            }"
                        />
                        <!-- <UButton
                            label="Lunaskan"
                            size="sm"
                            class="corner-based h-full px-3 text-[10px] font-black uppercase"
                            :ui="{ base: 'bg-accent-green text-dark' }"
                            @click="fillRemaining"
                        /> -->
                    </div>
                </UFormField>

                <div class="grid grid-cols-2 gap-3">
                    <UFormField label="Tanggal">
                        <UInput
                            v-model="paidAt"
                            type="date"
                            size="xl"
                            class="w-full"
                            :ui="{
                                root: 'rounded-2xl! corner-squircle! focus-visible:ring-dark/30! outline-accent-green/25! bg-white font-bold text-dark',
                            }"
                        />
                    </UFormField>
                    <UFormField label="Sisa Setelahnya">
                        <div
                            class="flex h-full items-center rounded-2xl bg-dark/5 px-4 py-4 text-sm font-black text-dark"
                        >
                            {{ useFormatPriceIntl(remainingAfter) }}
                        </div>
                    </UFormField>
                </div>

                <UFormField label="Catatan (opsional)">
                    <UTextarea
                        v-model="note"
                        :rows="2"
                        placeholder="Contoh: transfer BCA"
                        class="w-full"
                    />
                </UFormField>

                <UButton
                    block
                    size="xl"
                    :loading="isSaving"
                    :disabled="!isValid || isSaving"
                    :label="actionLabel"
                    class="corner-based bg-accent-green px-6 font-black text-dark hover:bg-accent-green/90 disabled:bg-neutral-300 disabled:text-neutral-500"
                    :ui="{ base: 'py-4' }"
                    @click="submit"
                />

                <div class="flex flex-col gap-2 border-t border-dark/10 pt-4">
                    <div class="flex items-center justify-between">
                        <p class="text-[10px] font-black uppercase tracking-wide text-dark/60">
                            Riwayat Pembayaran
                        </p>
                        <p class="text-[10px] font-bold text-dark/40">{{ payments.length }} kali</p>
                    </div>

                    <div v-if="paymentsLoading" class="flex flex-col gap-2">
                        <USkeleton v-for="i in 2" :key="i" class="h-12 w-full rounded-xl" />
                    </div>

                    <div
                        v-else-if="payments.length > 0"
                        class="flex max-h-56 flex-col gap-2 overflow-y-auto"
                    >
                        <div
                            v-for="payment in payments"
                            :key="payment.id"
                            class="flex items-start justify-between gap-3 rounded-xl bg-dark/5 px-3 py-2"
                        >
                            <div class="min-w-0">
                                <p class="text-xs font-bold text-dark">
                                    {{ formatDate(payment.paid_at) }}
                                </p>
                                <p
                                    v-if="payment.note"
                                    class="truncate text-[10px] text-neutral-500"
                                >
                                    {{ payment.note }}
                                </p>
                            </div>
                            <p class="shrink-0 text-xs font-black text-dark">
                                {{ useFormatPriceIntl(payment.amount) }}
                            </p>
                        </div>
                    </div>

                    <p
                        v-else
                        class="rounded-xl bg-dark/5 px-3 py-3 text-center text-[11px] font-medium text-neutral-400"
                    >
                        Belum ada cicilan tercatat
                    </p>
                </div>
            </div>
        </template>
    </USlideover>
</template>
