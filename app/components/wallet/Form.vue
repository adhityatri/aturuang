<template>
    <div class="flex flex-col gap-5">
        <!-- Wallet Preview -->
        <div class="relative overflow-hidden rounded-4xl bg-white-smooth p-4">
            <div class="relative z-1 flex items-center gap-4 text-dark">
                <div
                    class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-dark text-white"
                >
                    <UIcon name="solar:wallet-2-bold" class="text-[2rem]" />
                </div>

                <div class="min-w-0 flex-1 text-dark">
                    <p class="text-[10px] font-black uppercase tracking-[0.22em]">
                        Preview Kantong
                    </p>

                    <h2 class="mt-1 truncate text-xl font-black">
                        {{ state.name || "No Wallet" }}
                    </h2>

                    <p class="mt-1 text-sm font-black">
                        {{ useFormatPriceIntl(state.amount || 0) }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Form -->
        <UForm class="w-full" :schema="schema" :state="state" @submit="onSubmit">
            <UFormField label="Nama Kantong" name="name" class="mb-4 w-full">
                <UInput
                    v-model="state.name"
                    placeholder="Contoh: Kantong Utama"
                    size="xl"
                    type="text"
                    class="w-full"
                    :ui="{
                        base: 'rounded-2xl ring-1 ring-dark bg-white px-4 py-4 font-bold text-dark ',
                    }"
                />
            </UFormField>

            <UFormField label="Jumlah" name="amount" class="mb-4 w-full">
                <UInputNumber
                    v-model="state.amount"
                    hide-button
                    orientation="vertical"
                    size="xl"
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
                        base: 'rounded-2xl ring-1 ring-dark bg-white px-4 py-4 font-bold text-dark ',
                        increment: 'hidden',
                        decrement: 'hidden',
                    }"
                />
            </UFormField>

            <div
                class="mt-5 rounded-2xl bg-accent-red/80 p-3 text-xs font-bold leading-5 text-dark"
            >
                <span class="font-black uppercase">Tips:</span>
                Gunakan nama kantong yang jelas seperti “Kantong Utama”, “Tabungan”, atau “Dana
                Darurat”.
            </div>

            <UButton
                type="submit"
                block
                class="mt-6"
                :disabled="isSubmitDisabled"
                :ui="{
                    base: 'rounded-2xl bg-dark px-6 py-4 text-sm  uppercase tracking-wide text-white disabled:bg-neutral-300 disabled:text-secondary',
                }"
            >
                {{ props.type === "update" ? "Perbarui Kantong" : "Simpan Kantong" }}
            </UButton>
        </UForm>
    </div>
</template>

<script setup lang="ts">
import * as valibot from "valibot";

const props = withDefaults(
    defineProps<{ name?: string; amount?: number; type?: "create" | "update" }>(),
    { name: "", amount: 0, type: "create" },
);

const walletStore = useWallets();

const schema = valibot.required(
    valibot.object({
        name: valibot.pipe(
            valibot.string(),
            valibot.minLength(4, "Nama kantong minimal 4 karakter"),
        ),
        amount: valibot.pipe(valibot.number(), valibot.minValue(0, "Jumlah tidak boleh negatif")),
    }),
);

const state = reactive({
    name: props.name || walletStore.detailWallet?.name || "",
    amount: props.amount || walletStore.detailWallet?.amount || 0,
});

const isSubmitDisabled = computed(() => {
    return state.name.trim().length < 4 || state.amount < 0;
});

const emit = defineEmits<{ submit: [value: { name: string; amount: number }] }>();

const onSubmit = () => {
    if (isSubmitDisabled.value) return;

    emit("submit", { name: state.name.trim(), amount: state.amount });
};
</script>
