<template>
    <div class="bg-[#F4F0E8] px-4 py-5 text-[#111]">
        <div class="pointer-events-none fixed inset-0 overflow-hidden">
            <div
                class="fixed -right-12 top-24 h-36 w-36 rounded-full bg-accent-red"
            />
            <div
                class="fixed bottom-28 right-6 h-24 w-24 rounded-full bg-accent-yellow"
            />
        </div>

        <div class="relative z-10 mx-auto max-w-sm">
            <UBanner
                v-if="!isReady"
                color="warning"
                icon="solar:wallet-money-linear"
                title="Belum ada kantong"
                description="Buat kantong terlebih dahulu untuk mencatat transaksi."
                class="mb-4"
            />
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

            <UForm
                :schema="trackerSchema"
                :state="state"
                class="w-full flex flex-col gap-4"
                @submit="onSubmit"
            >
                <UFormField
                    name="amount"
                    class="my-6 border-2 border-black bg-white px-5 py-8 text-center shadow-[6px_6px_0_#111]"
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
                </UFormField>

                <!-- category selector -->
                <UFormField name="category" label="Kategori">
                    <!-- <pre>{{ categoryStore.categories }}</pre> -->
                    <USelectMenu
                        v-model="state.category"
                        :items="categoryStore.itemList"
                        :loading="categoryStore.isLoading"
                        value-key="id"
                        label-key="label"
                        filterable
                        size="xl"
                        placeholder="Pilih Kategori"
                        class="w-full"
                        :ui="{
                            base: 'rounded-none capitalize border-2 border-black bg-white px-4 py-3 shadow-[2px_2px_0px_#111]',
                            content:
                                'rounded-none border-2 border-black bg-white shadow-[3px_3px_0px_#111] capitalize',
                        }"
                        @update:open="onCategoryOpen"
                    />
                    <!-- @update:model-value="onCategoryChange" -->
                </UFormField>
                <!-- Wallet Selector -->
                <UFormField label="Kantong" name="wallet_id">
                    <USelect
                        v-model="state.wallet_id"
                        :items="walletList"
                        size="xl"
                        placeholder="Pilih kantong"
                        class="w-full"
                        :ui="{
                            base: 'rounded-none border-2 border-black bg-white px-4 py-3  shadow-[2px_2px_0px_#111]',
                            content:
                                'rounded-none border-2 border-black bg-white shadow-[3px_3px_0px_#111]',
                        }"
                    />
                </UFormField>

                <div
                    class="mt-4 border-[1.5px] border-dark bg-accent-yellow p-3 text-xs font-bold leading-5 text-dark"
                >
                    <span class="font-black uppercase">Tips:</span>
                    Tambahkan catatan agar riwayat transaksi lebih mudah dicari
                    nanti.
                </div>

                <UFormField name="notes" label="Keterangan">
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
                </UFormField>

                <UButton
                    :disabled="isSubmitDisabled"
                    type="submit"
                    block
                    size="lg"
                    class="mt-5 rounded-none border-2 border-black bg-[#FFD21E] py-4 font-black uppercase text-black shadow-[5px_5px_0_#111] hover:bg-[#FFD21E]/90 disabled:text-white disabled:bg-text-dark/90!"
                >
                    Simpan Transaksi
                </UButton>
            </UForm>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { categoryType } from "~/types/category";
import type { iWallets } from "~/types/wallets";
import type { FormSubmitEvent } from "@nuxt/ui";
import * as valibot from "valibot";

const emits = defineEmits<{ "close-on-submit": [] }>();

const activeTab = ref<categoryType>("expenses");

const isReady = computed(() => walletStore.wallets.length > 0);

const state = reactive({
    category: undefined as number | undefined,
    user: useSupabaseUser()?.value?.id || "",
    amount: 0,
    notes: "",
    wallet_id: "",
});

// Get wallet list from wallet store
const walletStore = useWallets();
const walletList = computed(() => {
    return Array.isArray(walletStore.wallets)
        ? walletStore.wallets.map((wallet: iWallets) => ({
              label: useCapitalize(wallet.name),
              value: wallet.id,
          }))
        : [];
});

// get category list from category store
const categoryStore = useCategory();
const { execute } = useAsyncData(
    "category-list",
    async () => await categoryStore.getCategoryByType(activeTab.value),
    { dedupe: "defer", lazy: true, immediate: true },
);

const onCategoryOpen = () => {
    if (!categoryStore.itemList.length) {
        execute();
    }
};

// Handle tab selection
const selectTab = async (tab: categoryType) => {
    activeTab.value = tab;
    await execute();
    state.category = undefined;
};

const tabs = shallowRef<Array<{ label: string; value: categoryType }>>([
    { label: "Expense", value: "expenses" },
    { label: "Income", value: "income" },
]);

// form validation
const trackerSchema = valibot.required(
    valibot.object({
        category: valibot.pipe(
            valibot.number(),
            valibot.check((val) => val !== null, "Pilih kategori"),
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

// submit handler
const isSubmitDisabled = computed(() => {
    return (
        !isReady.value ||
        !state.category ||
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
        category_id: Number(state?.category),
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
    state.category = undefined;
    state.amount = 0;
    state.notes = "";
    state.wallet_id = "";
    emits("close-on-submit");
};
</script>
