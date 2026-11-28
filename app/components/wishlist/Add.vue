<template>
    <USlideover
        v-model:open="openAdd"
        :dismissible="false"
        :ui="{ content: 'rounded-t-2xl' }"
        side="bottom"
    >
        <template #header>
            <div class="flex flex-1 items-start justify-between">
                <div>
                    <h2 class="text-xl font-black text-dark">Impian Baru</h2>
                    <p class="mt-1 text-sm font-medium text-dark/70">
                        Simpan target & mimpi finansial Anda.
                    </p>
                </div>
                <UButton icon="lucide:x" color="neutral" variant="ghost" @click="openAdd = false" />
            </div>
        </template>

        <template #body>
            <UForm
                class="w-full flex flex-col gap-4"
                :schema="schema"
                :state="state"
                @submit="handleAdd(state)"
            >
                <UFormField label="Impian Kamu" name="name">
                    <UInput v-model="state.name" placeholder="Liburan ke Bali" class="w-full" />
                </UFormField>

                <UFormField label="Target Dana" name="target_amount">
                    <UInputNumber
                        v-model="state.target_amount"
                        size="xl"
                        :format-options="{
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0,
                        }"
                        class="w-full"
                        :ui="{
                            base: 'rounded-4xl corner-squircle px-4 py-4 font-bold text-dark border-1 border-dark/15',
                        }"
                    />
                </UFormField>

                <UFormField label="Kantong" name="wallet_id">
                    <USelect
                        v-model="state.wallet_id"
                        :items="walletList"
                        size="xl"
                        class="w-full"
                        placeholder="Belum dipilih"
                        :ui="{
                            base: 'corner-based capitalize  px-4 py-3',
                            content: 'corner-based bg-white capitalize',
                            itemWrapper: 'px-4',
                        }"
                    />
                </UFormField>

                <UFormField label="Catatan ( opsional )" name="notes">
                    <UTextarea
                        v-model="state.notes"
                        size="xl"
                        placeholder="Opsional"
                        class="w-full"
                    />
                </UFormField>

                <UButton
                    block
                    size="xl"
                    color="primary"
                    type="submit"
                    :loading="isSubmitting"
                    :ui="{
                        base: 'mt-6 rounded-2xl bg-dark px-6 py-4 text-sm font-black uppercase tracking-wide text-white',
                    }"
                >
                    Simpan
                </UButton>
            </UForm>
        </template>
    </USlideover>
</template>

<script setup lang="ts">
import * as valibot from "valibot";

const wishlistStore = useWishlist();
const walletStore = useWallets();
const openAdd = defineModel<boolean>("open", { default: false });
const isSubmitting = shallowRef(false);

const schema = valibot.required(
    valibot.object({
        name: valibot.pipe(valibot.string(), valibot.minLength(1, "Nama wajib diisi")),
        target_amount: valibot.pipe(valibot.number(), valibot.minValue(1000, "Minimal Rp1.000")),
        wallet_id: valibot.optional(valibot.string()),
        notes: valibot.optional(valibot.string()),
    }),
);

const state = reactive({ name: "", target_amount: 0, wallet_id: "", notes: "" });

const walletList = computed(() => {
    return walletStore.wallets.map((wallet) => ({
        label: useCapitalize(wallet.name),
        value: wallet.id,
    }));
});

const handleAdd = async (payload: {
    name: string;
    target_amount: number;
    wallet_id?: string;
    notes?: string;
}) => {
    isSubmitting.value = true;
    try {
        const res = await wishlistStore.addWishlist({
            ...payload,
            wallet_id: payload.wallet_id || undefined,
        });
        if (res.error) {
            useToast().add({ title: "Impian", description: res.error.message, color: "error" });
            return;
        }
        useToast().add({
            title: "Impian",
            description: "Impian berhasil ditambahkan",
            color: "success",
        });
        state.name = "";
        state.target_amount = 0;
        state.wallet_id = "";
        state.notes = "";
        openAdd.value = false;
    } finally {
        isSubmitting.value = false;
    }
};
</script>
