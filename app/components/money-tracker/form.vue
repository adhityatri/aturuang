<template>
    <div class="bg-accent-green rounded-4xl px-4 py-6 text-dark">
        <div class="relative z-10 mx-auto max-w-sm">
            <UBanner
                v-if="!isReady"
                color="warning"
                icon="solar:wallet-money-linear"
                title="Belum ada kantong"
                description="Buat kantong terlebih dahulu untuk mencatat transaksi."
                class="mb-4"
                :ui="{
                    container: 'bg-accent-red/80',
                    root: 'rounded-2xl relative overflow-hidden',
                }"
            />
            <div class="grid grid-cols-2 rounded-2xl relative overflow-hidden bg-white-smooth">
                <button
                    v-for="tab in tabs"
                    :key="tab.value"
                    class="py-4 text-xs font-black uppercase tracking-wide transition"
                    :class="
                        activeTab === tab.value
                            ? 'bg-dark text-white-smooth'
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
                    class="rounded-2xl my-6 bg-white-smooth text-dark px-5 py-8 text-center"
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
                            base: 'text-center bg-white-smooth pe-0 px-0 py-0 font-black text-dark shadow-none h-auto text-[2.2rem]',
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
                            base: 'rounded-2xl capitalize  bg-white-smooth px-4 py-3',
                            content: 'rounded-2xl bg-white capitalize',
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
                            base: 'rounded-2xl ring-1 ring-dark bg-white-smooth px-4 py-3  ',
                            content: 'rounded-2xl bg-white-smooth ',
                        }"
                    />
                </UFormField>

                <div
                    class="mt-4 bg-accent-red/50 rounded-2xl p-3 text-xs font-bold leading-5 text-dark"
                >
                    <span class="font-black uppercase">Tips:</span>
                    Tambahkan catatan agar riwayat transaksi lebih mudah dicari nanti.
                </div>

                <UFormField name="notes" label="Keterangan">
                    <UTextarea
                        v-model="state.notes"
                        placeholder="Contoh: makan siang, beli kopi, gaji bulanan..."
                        size="xl"
                        :rows="4"
                        class="w-full"
                        :ui="{
                            base: 'ring-1 ring-dark bg-white-smooth px-4 py-4 text-md font-medium text-dark rounded-2xl',
                        }"
                    />
                </UFormField>

                <UButton
                    :disabled="isSubmitDisabled"
                    type="submit"
                    block
                    size="lg"
                    class="mt-5 rounded-xl bg-dark py-4 font-black uppercase text-white hover:bg-accent-green/90 disabled:text-white disabled:bg-dark/90!"
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
    { label: "Pengeluaran", value: "expenses" },
    { label: "Pemasukan", value: "income" },
]);

// form validation
const trackerSchema = valibot.required(
    valibot.object({
        category: valibot.pipe(
            valibot.number(),
            valibot.check((val) => val !== null, "Pilih kategori"),
        ),
        amount: valibot.pipe(valibot.number(), valibot.minValue(100, "Minimal transaksi Rp100")),
        notes: valibot.optional(valibot.string()),
        wallet_id: valibot.pipe(valibot.string(), valibot.minLength(1, "Pilih kantong")),
    }),
);

type TrackerSchema = valibot.InferOutput<typeof trackerSchema>;

// submit handler
const isSubmitDisabled = computed(() => {
    return !isReady.value || !state.category || !state.wallet_id || state.amount < 100;
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
        useToast().add({ title: "Transaksi", description: response.error.message, color: "error" });
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
