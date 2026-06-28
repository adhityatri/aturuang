<template>
    <div class="min-h-dvh bg-[#F4F0E8] px-4 py-5 text-[#111]">
        <!-- Bauhaus Shape Background -->
        <div class="pointer-events-none fixed inset-0 overflow-hidden">
            <div
                class="absolute -right-12 top-24 h-36 w-36 rounded-full bg-[#E6392E]"
            />
            <div class="absolute -left-10 top-80 h-32 w-32 bg-[#064EAF]" />
            <div
                class="absolute bottom-28 right-6 h-24 w-24 rounded-full bg-[#FFD21E]"
            />
        </div>

        <div class="relative z-10 mx-auto max-w-sm">
            <!-- Tabs -->
            <div
                class="grid grid-cols-2 border-2 border-black bg-white shadow-[4px_4px_0_#111]"
            >
                <button
                    v-for="tab in tabs"
                    :key="tab.value"
                    class="py-3 text-xs font-black uppercase tracking-wide transition"
                    :class="
                        activeTab === tab.value
                            ? 'bg-[#FFD21E] text-black'
                            : 'bg-white text-black hover:bg-neutral-100'
                    "
                    @click="selectTab(tab.value as categoryType)"
                >
                    {{ tab.label }}
                </button>
            </div>

            <!-- Amount -->
            <section
                class="mt-6 border-2 border-black bg-white px-5 py-8 text-center shadow-[6px_6px_0_#111]"
            >
                <UInputNumber
                    v-model="state.amount"
                    orientation="vertical"
                    hide-buttons
                    size="xl"
                    class="w-full"
                    :format-options="{
                        style: 'currency',
                        currency: 'IDR',
                        currencyDisplay: 'narrowSymbol',
                        compactDisplay: 'short',
                        maximumFractionDigits: 0,
                        currencySign: 'standard',
                    }"
                    :ui="{
                        base: 'text-center pe-0 px-0 py-0 font-black text-dark shadow-none h-auto text-[2.2rem]',
                        increment: 'hidden',
                        decrement: 'hidden',
                    }"
                />
            </section>

            <!-- Wallet -->
            <section class="my-6 flex flex-col gap-4">
                <category-list
                    :tab="activeTab"
                    :selected-category="selectedCategory"
                    @select="selectCategory"
                />
                <USelect
                    v-model="state.wallet_id"
                    :items="walletList"
                    size="xl"
                    placeholder="Pilih kantong"
                    class="w-full"
                    :ui="{
                        base: 'rounded-none border-2 border-black bg-white px-4 py-3 font-bold shadow-[2px_2px_0px_#111]',
                        content:
                            'rounded-none border-2 border-black bg-white shadow-[3px_3px_0px_#111]',
                    }"
                />
                <UTextarea
                    v-model="state.notes"
                    placeholder="Contoh: makan siang, beli kopi, gaji bulanan..."
                    size="xl"
                    :rows="4"
                    class="w-full"
                    :ui="{
                        base: 'border-[2px] border-dark bg-white px-4 py-4 text-md font-medium text-dark shadow-[2px_2px_0px_#111111]',
                    }"
                />
            </section>

            <!-- Done -->
            <UButton
                block
                size="lg"
                class="mt-5 rounded-none border-2 border-black bg-[#FFD21E] py-4 font-black uppercase text-black shadow-[5px_5px_0_#111] hover:bg-[#FFD21E]/90"
            >
                Done
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { iCategory, categoryType } from "~/types/category";
import type { iWallets } from "~/types/wallets";

const activeTab = ref<categoryType>("expenses");

const walletStore = useWallets();
const state = reactive({ wallet_id: "", category: 0, amount: 0, notes: "" });

const walletList = computed(() => {
    return Array.isArray(walletStore.wallets)
        ? walletStore.wallets.map((wallet: iWallets) => ({
              label: useCapitalize(wallet.name),
              value: wallet.id,
          }))
        : [];
});

const selectedCategory = ref<iCategory>();

const selectCategory = ref<{ category: iCategory }>((category: iCategory) => {
    selectedCategory.value = category;
    state.category = category.id;
});

const selectTab = (tab: categoryType) => {
    activeTab.value = tab;
};

const tabs = shallowRef<Array<{ label: string; value: categoryType }>>([
    { label: "Expense", value: "expenses" },
    { label: "Income", value: "income" },
    // { label: "Transfer", value: "transfer" },
]);
</script>

<!-- <template>
    <UForm
        class="w-full"
        :schema="trackerSchema"
        :state="state"
        @submit="onSubmit"
    >
        <UBanner
            v-if="!isReady"
            color="warning"
            icon="solar:wallet-money-linear"
            title="Belum ada kantong"
            description="Buat kantong terlebih dahulu untuk mencatat transaksi."
            class="mb-4"
        />

        <category-display
            :selected-category="selectedCategory"
            @select="selectCategory"
        />

        <div
            v-if="selectedCategory"
            class="mt-4 rounded-2xl border-[2px] border-dark bg-[#fffaf0] p-4 shadow-[3px_3px_0px_#111111]"
        >
            <p
                class="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue"
            >
                Preview Transaksi
            </p>

            <div class="mt-3 flex items-center gap-3">
                <div
                    class="flex size-12 items-center justify-center rounded-xl border-[2px] border-dark bg-accent-yellow text-dark"
                >
                    <UIcon :name="selectedCategory.icon" class="text-xl" />
                </div>

                <div class="min-w-0 flex-1">
                    <h3 class="truncate font-black text-dark">
                        {{ selectedCategory.name }}
                    </h3>

                    <p class="text-sm font-black text-accent-blue">
                        {{
                            state.amount > 0
                                ? useFormatPriceIntl(state.amount)
                                : "Belum ada nominal"
                        }}
                    </p>

                    <p class="mt-1 text-xs font-bold text-secondary">
                        {{ selectedWallet?.name || "Belum memilih kantong" }}
                    </p>
                </div>
            </div>
        </div>

        <UFormField label="Kantong" name="wallet_id" class="mt-5 w-full">
            <USelect
                v-model="state.wallet_id"
                :items="walletList"
                size="xl"
                placeholder="Pilih kantong"
                class="w-full"
                :ui="{
                    base: 'rounded-2xl border-[2px] border-dark bg-white px-4 py-4 font-bold text-dark shadow-[2px_2px_0px_#111111]',
                    content:
                        'rounded-2xl border-[2px] border-dark bg-white shadow-[3px_3px_0px_#111111]',
                }"
            />
        </UFormField>

        <UFormField label="Jumlah" name="amount" class="mt-4 w-full">
            <UInputNumber
                v-model="state.amount"
                orientation="vertical"
                hide-buttons
                size="xl"
                class="w-full"
                :format-options="{
                    style: 'currency',
                    currency: 'IDR',
                    currencyDisplay: 'narrowSymbol',
                    compactDisplay: 'short',
                    maximumFractionDigits: 0,
                    currencySign: 'standard',
                }"
                :ui="{
                    base: 'rounded-2xl border-[2px] border-dark bg-white px-4 py-4 font-black text-dark shadow-[2px_2px_0px_#111111]',
                    increment: 'hidden',
                    decrement: 'hidden',
                }"
            />
        </UFormField>

        <UFormField label="Keterangan" name="notes" class="mt-4 w-full">
            <UTextarea
                v-model="state.notes"
                placeholder="Contoh: makan siang, beli kopi, gaji bulanan..."
                size="xl"
                :rows="4"
                class="w-full"
                :ui="{
                    base: 'rounded-2xl border-[2px] border-dark bg-white px-4 py-4 text-md font-medium text-dark shadow-[2px_2px_0px_#111111]',
                }"
            />
        </UFormField>

        <div
            class="mt-5 rounded-2xl border-[1.5px] border-dark bg-accent-yellow p-3 text-xs font-bold leading-5 text-dark"
        >
            <span class="font-black uppercase">Tips:</span>
            Tambahkan catatan agar riwayat transaksi lebih mudah dicari nanti.
        </div>

        <UButton
            block
            :disabled="isSubmitDisabled"
            size="xl"
            color="primary"
            type="submit"
            :ui="{
                base: 'mt-6 rounded-2xl border-[2px] border-dark bg-accent-blue px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[3px_3px_0px_#111111] disabled:bg-neutral-300 disabled:text-secondary',
            }"
        >
            Simpan Transaksi
        </UButton>
    </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as valibot from "valibot";
import type { iCategory } from "~/types/category";
import type { iWallets } from "~/types/wallets";

const emits = defineEmits<{ "close-on-submit": [] }>();

const walletStore = useWallets();

const isReady = computed(() => walletStore.wallets.length > 0);

const walletList = computed(() => {
    return Array.isArray(walletStore.wallets)
        ? walletStore.wallets.map((wallet: iWallets) => ({
              label: useCapitalize(wallet.name),
              value: wallet.id,
          }))
        : [];
});

const selectedCategory = ref<iCategory>();

const selectCategory = (category: iCategory) => {
    selectedCategory.value = category;
    state.category = category.id;
};

const trackerSchema = valibot.required(
    valibot.object({
        category: valibot.pipe(
            valibot.number(),
            valibot.minValue(1, "Pilih kategori transaksi"),
        ),
        user: valibot.pipe(
            valibot.string(),
            valibot.minLength(4, "User tidak valid"),
        ),
        amount: valibot.pipe(
            valibot.number(),
            valibot.minValue(100, "Minimal transaksi Rp100"),
        ),
        notes: valibot.optional(valibot.string()),
        wallet_id: valibot.pipe(
            valibot.string(),
            valibot.minLength(1, "Pilih kantong"),
        ),
    }),
);

type TrackerSchema = valibot.InferOutput<typeof trackerSchema>;

const state = reactive({
    category: 0,
    user: useSupabaseUser()?.value?.id || "",
    amount: 0,
    notes: "",
    wallet_id: "",
});

const selectedWallet = computed(() => {
    return walletStore.wallets.find(
        (wallet: iWallets) => wallet.id === state.wallet_id,
    );
});

const isSubmitDisabled = computed(() => {
    return (
        !isReady.value ||
        !selectedCategory.value ||
        !state.wallet_id ||
        state.amount < 100
    );
});

const onSubmit = async (event: FormSubmitEvent<TrackerSchema>) => {
    if (isSubmitDisabled.value) return;

    const { amount, notes } = event.data;

    const transactionStore = useTransactionsStore();

    const response = await transactionStore.addTransactions({
        wallet_id: state.wallet_id,
        category_id: selectedCategory.value?.id as number,
        amount,
        notes,
    });

    if (response?.error) {
        useToast().add({
            title: "Transaksi",
            description: response.error.message,
            color: "error",
        });
        return;
    }

    useToast().add({
        title: "Transaksi",
        description: "Transaksi berhasil disimpan",
        color: "success",
    });

    state.category = 0;
    state.amount = 0;
    state.notes = "";
    state.wallet_id = "";
    selectedCategory.value = undefined;

    emits("close-on-submit");
};
</script> -->
