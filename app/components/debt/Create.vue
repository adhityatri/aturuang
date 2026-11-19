<script setup lang="ts">
import type { debtType, iDebtCreate } from "~/types/debt";

interface Props {
    isSaving?: boolean;
}

const props = withDefaults(defineProps<Props>(), { isSaving: false });
const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{ submit: [payload: iDebtCreate] }>();

const type = ref<string>("debt");
const counterparty = ref("");
const amount = ref<number | null>(null);
const dueDate = ref("");
const note = ref("");

const typeOptions = [
    { label: "Utang", value: "debt" },
    { label: "Piutang", value: "receivable" },
];

const isValid = computed(() => counterparty.value.trim().length >= 2 && Number(amount.value) > 0);

const reset = () => {
    type.value = "debt";
    counterparty.value = "";
    amount.value = null;
    dueDate.value = "";
    note.value = "";
};

const submit = () => {
    if (!isValid.value || props.isSaving) return;

    emit("submit", {
        type: type.value as debtType,
        counterparty: counterparty.value.trim(),
        amount: Number(amount.value),
        due_date: dueDate.value || null,
        note: note.value.trim() || null,
    });
};

watch(open, (value) => {
    if (!value) reset();
});
</script>

<template>
    <USlideover
        v-model:open="open"
        :dismissible="!isSaving"
        :ui="{ content: 'rounded-t-2xl' }"
        side="bottom"
        title="Catat Utang / Piutang"
    >
        <template #body>
            <div class="flex flex-col gap-4 py-2">
                <UFormField label="Jenis">
                    <URadioGroup
                        v-model="type"
                        :items="typeOptions"
                        orientation="horizontal"
                        variant="card"
                        indicator="hidden"
                        :ui="{
                            item: 'corner-squircle rounded-2xl px-6 py-3 has-data-[state=checked]:border-accent-green has-data-[state=checked]:bg-accent-green/20',
                            label: 'text-xs font-black',
                        }"
                    />
                </UFormField>

                <UFormField label="Nama">
                    <UInput
                        v-model="counterparty"
                        placeholder="Contoh: Budi"
                        size="xl"
                        class="w-full"
                    />
                </UFormField>

                <UFormField label="Jumlah">
                    <UInputNumber
                        v-model="amount"
                        hide-button
                        orientation="vertical"
                        size="xl"
                        placeholder="0"
                        :format-options="{
                            style: 'currency',
                            currency: 'IDR',
                            currencyDisplay: 'narrowSymbol',
                            compactDisplay: 'short',
                            maximumFractionDigits: 0,
                            currencySign: 'standard',
                        }"
                        class="w-full"
                        :ui="{
                            base: 'rounded-2xl corner-squircle! focus-visible:ring-dark/30! outline-accent-green/25! ring-1! bg-white px-4 py-4 ',
                            increment: 'hidden',
                            decrement: 'hidden',
                        }"
                    />
                </UFormField>

                <UFormField label="Jatuh Tempo (opsional)">
                    <UInput
                        v-model="dueDate"
                        type="date"
                        size="xl"
                        class="w-full"
                        :ui="{ root: 'rounded-2xl! corner-squircle! bg-white ' }"
                    />
                </UFormField>

                <UFormField label="Catatan (opsional)">
                    <UTextarea
                        v-model="note"
                        :rows="3"
                        placeholder="Contoh: buat bayar sekolah anak"
                        class="w-full"
                    />
                </UFormField>

                <div class="mt-2 flex flex-col gap-2">
                    <UButton
                        block
                        size="xl"
                        :loading="isSaving"
                        :disabled="!isValid || isSaving"
                        label="Simpan"
                        class="corner-based bg-accent-green px-6 font-black text-dark hover:bg-accent-green/90 disabled:bg-neutral-300 disabled:text-neutral-500"
                        :ui="{ base: 'py-4' }"
                        @click="submit"
                    />
                    <p class="text-center text-[10px] text-neutral-400">
                        Catatan ini terpisah dari transaksi dan tidak mengubah saldo kantong.
                    </p>
                </div>
            </div>
        </template>
    </USlideover>
</template>
