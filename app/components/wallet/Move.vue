<template>
    <USlideover v-model:open="isOpen" :dismissible="false" side="bottom">
        <!-- Trigger -->
        <UButton
            :ui="{
                base: `
          flex items-center gap-2
          rounded-xl
          border-[1.5px] border-dark
          bg-accent-red
          px-4 py-3
          text-white
          shadow-[3px_3px_0px_#111111]
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
                <div>
                    <p
                        class="text-[10px] font-black uppercase tracking-[0.2em] text-accent-red"
                    >
                        Transfer Kantong
                    </p>

                    <h2 class="text-xl font-black uppercase text-dark">
                        Pindahkan Uang
                    </h2>

                    <p class="mt-1 text-xs text-secondary">
                        Pindahkan saldo dari kantong ini ke kantong lainnya.
                    </p>
                </div>

                <UButton
                    icon="lucide:x"
                    variant="ghost"
                    color="neutral"
                    @click="handleClose"
                />
            </div>
        </template>

        <template #body>
            <div
                class="relative overflow-hidden rounded-[2rem] border-[2px] border-dark bg-[#fffaf0] p-4 shadow-[4px_4px_0px_#111111]"
            >
                <!-- Decoration -->
                <div
                    class="absolute -right-10 -top-10 size-24 rounded-full bg-accent-yellow"
                />
                <div
                    class="absolute -left-10 bottom-0 size-20 rounded-tr-full bg-accent-blue"
                />
                <div
                    class="absolute -bottom-10 right-10 size-20 rounded-full bg-accent-red"
                />

                <div class="relative z-1 flex flex-col gap-4">
                    <!-- Source Wallet -->
                    <div
                        class="rounded-2xl border-[2px] border-dark bg-white p-4 shadow-[3px_3px_0px_#111111]"
                    >
                        <p
                            class="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue"
                        >
                            Dari Kantong
                        </p>

                        <div class="mt-3 flex items-center gap-4">
                            <div
                                class="flex size-14 items-center justify-center rounded-2xl border-[2px] border-dark bg-accent-yellow text-dark"
                            >
                                <UIcon
                                    name="solar:wallet-2-bold"
                                    class="text-2xl"
                                />
                            </div>

                            <div class="min-w-0 flex-1">
                                <h3 class="truncate font-black text-dark">
                                    {{ walletStore.detailWallet?.name }}
                                </h3>
                                <p class="text-sm font-bold text-secondary">
                                    {{
                                        useFormatPriceIntl(
                                            walletStore.detailWallet?.amount ||
                                                0,
                                        )
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <UForm
                        class="w-full"
                        :schema="schema"
                        :state="state"
                        @submit="onSubmit"
                    >
                        <UFormField
                            label="Pilih Kantong Tujuan"
                            name="wallet_id"
                            class="mb-4 w-full"
                        >
                            <USelect
                                v-model="state.wallet_id"
                                :items="walletList"
                                size="xl"
                                class="w-full"
                                placeholder="Pilih Kantong Tujuan"
                                :ui="{
                                    base: 'rounded-2xl border-[2px] border-dark bg-white px-4 py-4 font-bold text-dark shadow-[2px_2px_0px_#111111]',
                                }"
                            />
                        </UFormField>

                        <!-- Destination Preview -->
                        <div
                            v-if="selectedWallet"
                            class="mb-4 rounded-2xl border-[2px] border-dark bg-white p-4 shadow-[3px_3px_0px_#111111]"
                        >
                            <p
                                class="text-[10px] font-black uppercase tracking-[0.2em] text-accent-red"
                            >
                                Ke Kantong
                            </p>

                            <div class="mt-3 flex items-center gap-4">
                                <div
                                    class="flex size-14 items-center justify-center rounded-2xl border-[2px] border-dark bg-accent-blue text-white"
                                >
                                    <UIcon
                                        name="solar:wallet-money-linear"
                                        class="text-2xl"
                                    />
                                </div>

                                <div class="min-w-0 flex-1">
                                    <h3 class="truncate font-black text-dark">
                                        {{ selectedWallet.name }}
                                    </h3>
                                    <p class="text-sm font-bold text-secondary">
                                        Saldo saat ini:
                                        {{
                                            useFormatPriceIntl(
                                                selectedWallet.amount || 0,
                                            )
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <UFormField
                            label="Jumlah"
                            name="amount"
                            class="mb-4 w-full"
                        >
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
                                    base: 'rounded-2xl border-[2px] border-dark bg-white px-4 py-4 font-bold text-dark shadow-[2px_2px_0px_#111111]',
                                    increment: 'hidden',
                                    decrement: 'hidden',
                                }"
                            />
                        </UFormField>

                        <!-- Helper -->
                        <div
                            class="mb-4 rounded-2xl border-[1.5px] border-dark bg-accent-yellow p-3 text-xs font-bold leading-5 text-dark"
                        >
                            <span class="font-black uppercase">Catatan:</span>
                            Dana akan dicatat sebagai pengeluaran di kantong
                            asal dan pemasukan di kantong tujuan.
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
                                base: 'mt-6 rounded-2xl border-[2px] border-dark bg-accent-blue px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[3px_3px_0px_#111111] disabled:bg-neutral-300 disabled:text-secondary',
                            }"
                        >
                            Pindahkan Uang
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
    walletStore.wallets.filter(
        (wallet: iWallets) => wallet.id !== walletStore.detailWallet?.id,
    ),
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
    return exceptSourceWallet.value.find(
        (wallet: iWallets) => wallet.id === state.wallet_id,
    );
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
        wallet_id: valibot.pipe(
            valibot.string(),
            valibot.minLength(1, "Pilih kantong tujuan"),
        ),
        amount: valibot.pipe(
            valibot.number(),
            valibot.minValue(100, "Minimal pemindahan Rp100"),
        ),
    }),
);

const state = reactive({ wallet_id: "", amount: 0 });

const isInsufficientBalance = computed(() => {
    return state.amount > Number(walletStore.detailWallet?.amount || 0);
});

const isSubmitDisabled = computed(() => {
    return (
        !state.wallet_id || state.amount < 100 || isInsufficientBalance.value
    );
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
