<template>
    <USlideover
        v-model:open="isOpen"
        :dismissible="false"
        side="bottom"
        :ui="{ content: 'rounded-t-4xl bg-white-smooth', header: 'border-0' }"
    >
        <!-- Trigger -->
        <UButton
            :ui="{
                base: `
          flex items-center gap-2
          rounded-xl
          bg-accent-red
          px-4 py-3
          text-white
          active:translate-x-[2px]
          active:translate-y-[2px]
          active:shadow-none
        `,
            }"
            @click="handleClick"
        >
            <UIcon name="solar:move-to-folder-linear" class="text-lg" />
            <span class="text-xs font-black uppercase">Pindah</span>
        </UButton>

        <!-- Header -->
        <template #header>
            <div class="flex flex-1 items-start justify-between">
                <div class="text-dark">
                    <h2 class="text-xl font-black uppercase text-dark">Pindahkan Uang</h2>

                    <p class="text-xs">Pindahkan saldo dari kantong ini ke kantong lainnya.</p>
                </div>

                <UButton icon="lucide:x" variant="ghost" color="neutral" @click="handleClose" />
            </div>
        </template>

        <template #body>
            <div class="relative overflow-hidden rounded-4xl bg-accent-green p-4">
                <div class="relative z-1 flex flex-col gap-4">
                    <!-- Source Wallet -->
                    <div class="rounded-2xl bg-white p-4">
                        <p class="text-[10px] font-black uppercase tracking-[0.2em]">
                            Dari Kantong
                        </p>

                        <div class="mt-3 flex items-center gap-4">
                            <div
                                class="flex size-14 items-center justify-center rounded-2xl bg-dark text-white"
                            >
                                <UIcon name="solar:wallet-2-bold" class="text-2xl" />
                            </div>

                            <div class="min-w-0 flex-1">
                                <h3 class="truncate font-black text-dark">
                                    {{ walletStore.detailWallet?.name }}
                                </h3>
                                <p class="text-sm font-bold">
                                    {{ useFormatPriceIntl(walletStore.detailWallet?.amount || 0) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <USeparator
                        orientation="horizontal"
                        label="Kantong Tujuan"
                        :ui="{ border: 'border-dark' }"
                    />

                    <UForm class="w-full" :schema="schema" :state="state" @submit="onSubmit">
                        <UFormField label="Pilih Kantong " name="wallet_id" class="mb-4 w-full">
                            <USelect
                                v-model="state.wallet_id"
                                :items="walletList"
                                size="xl"
                                class="w-full"
                                placeholder="Pilih Kantong"
                                :ui="{
                                    base: 'rounded-2xl ring-1 ring-dark px-4 py-4 font-bold text-dark ',
                                    content: 'rounded-2xl ring-1 ring-dark',
                                }"
                            />
                        </UFormField>

                        <!-- Destination Preview -->
                        <div
                            v-if="selectedWallet"
                            class="mb-4 rounded-2xl ring-1 ring-dark bg-white p-4 text-dark"
                        >
                            <p class="text-[10px] font-black uppercase tracking-[0.2em]">
                                Ke Kantong
                            </p>

                            <div class="mt-3 flex items-center gap-4">
                                <div
                                    class="flex size-14 items-center justify-center rounded-2xl bg-dark text-white"
                                >
                                    <UIcon name="solar:wallet-money-linear" class="text-2xl" />
                                </div>

                                <div class="min-w-0 flex-1">
                                    <h3 class="truncate font-black text-dark">
                                        {{ selectedWallet.name }}
                                    </h3>
                                    <p class="text-sm font-bold">
                                        Saldo saat ini:
                                        {{ useFormatPriceIntl(selectedWallet.amount || 0) }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <UFormField label="Jumlah" name="amount" class="mb-4 w-full">
                            <UInputNumber
                                v-model="state.amount"
                                orientation="vertical"
                                hide-buttons
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
                                    base: 'rounded-2xl bg-white px-4 py-4 font-bold text-dark ring-1 ring-dark',
                                    increment: 'hidden',
                                    decrement: 'hidden',
                                }"
                            />
                        </UFormField>

                        <!-- Helper -->
                        <div
                            class="mb-4 rounded-2xl bg-accent-red/70 p-3 text-xs font-bold leading-5 text-dark"
                        >
                            <span class="font-black uppercase">Catatan:</span>
                            Dana akan dicatat sebagai pengeluaran di kantong asal dan pemasukan di
                            kantong tujuan.
                        </div>

                        <p
                            v-if="isInsufficientBalance"
                            class="mb-4 rounded-xl border-[1.5px] border-accent-red bg-red-50 p-3 text-xs font-bold text-accent-red"
                        >
                            Saldo tidak cukup untuk melakukan pemindahan dana.
                        </p>

                        <UButton
                            block
                            size="xl"
                            color="primary"
                            type="submit"
                            :disabled="isSubmitDisabled"
                            :ui="{
                                base: 'mt-6 rounded-2xl bg-dark px-6 py-4 text-sm font-black uppercase tracking-wide text-white disabled:bg-neutral-300 disabled:text-dark/80',
                            }"
                        >
                            Pindahkan
                        </UButton>
                    </UForm>
                </div>
            </div>
        </template>
    </USlideover>
</template>

<script setup lang="ts">
import * as valibot from "valibot";
import type { iWallets } from "~/types/wallets";

const emit = defineEmits<{ click: []; refresh: [] }>();

const isOpen = shallowRef<boolean>(false);
const walletStore = useWallets();

await walletStore.getWallets();

const exceptSourceWallet = computed(() =>
    walletStore.wallets.filter((wallet: iWallets) => wallet.id !== walletStore.detailWallet?.id),
);

const walletList = computed(() => {
    return Array.isArray(exceptSourceWallet.value)
        ? exceptSourceWallet.value.map((wallet: iWallets) => ({
              label: useCapitalize(wallet.name),
              value: wallet.id,
          }))
        : [];
});

const selectedWallet = computed(() => {
    return exceptSourceWallet.value.find((wallet: iWallets) => wallet.id === state.wallet_id);
});

const handleClick = () => {
    isOpen.value = true;
    emit("click");
};

const handleClose = () => {
    isOpen.value = false;
};

const schema = valibot.required(
    valibot.object({
        wallet_id: valibot.pipe(valibot.string(), valibot.minLength(1, "Pilih kantong tujuan")),
        amount: valibot.pipe(valibot.number(), valibot.minValue(100, "Minimal pemindahan Rp100")),
    }),
);

const state = reactive({ wallet_id: "", amount: 0 });

const isInsufficientBalance = computed(() => {
    return state.amount > Number(walletStore.detailWallet?.amount || 0);
});

const isSubmitDisabled = computed(() => {
    return !state.wallet_id || state.amount < 100 || isInsufficientBalance.value;
});

const transactionStore = useTransactionsStore();

const onSubmit = async () => {
    if (isSubmitDisabled.value) return;

    const toWallet = exceptSourceWallet.value.find(
        (wallet: iWallets) => wallet.id === state.wallet_id,
    );

    const fromPayload = {
        wallet_id: walletStore.detailWallet!.id,
        category_id: 23,
        notes: "Pemindahan dana ke kantong " + toWallet?.name,
        amount: state.amount,
    };

    const toPayload = {
        wallet_id: state.wallet_id,
        category_id: 24,
        notes: "Pemindahan dana dari kantong " + walletStore.detailWallet?.name,
        amount: state.amount,
    };

    const fromResponse = await transactionStore.addTransactions(fromPayload);

    if (fromResponse?.error) {
        useToast().add({
            title: "Pindah Uang",
            description: fromResponse.error.message,
            color: "error",
        });
        return;
    }

    const toResponse = await transactionStore.addTransactions(toPayload);

    if (toResponse?.error) {
        useToast().add({
            title: "Pindah Uang",
            description: toResponse.error.message,
            color: "error",
        });
        return;
    }

    useToast().add({
        title: "Pindah Uang",
        description: "Pemindahan dana berhasil",
        color: "success",
    });

    state.wallet_id = "";
    state.amount = 0;

    emit("refresh");
    handleClose();
};
</script>
