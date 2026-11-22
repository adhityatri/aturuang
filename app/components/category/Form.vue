<template>
    <UForm :schema="schema" :state="state" class="flex flex-col gap-4 py-2" @submit="handleSubmit">
        <UFormField label="Tipe Kategori" name="type">
            <URadioGroup
                v-model="state.type"
                :items="categoryTypes"
                orientation="horizontal"
                variant="card"
                indicator="hidden"
                :ui="{
                    item: 'corner-squircle rounded-2xl px-6 py-3 has-data-[state=checked]:border-accent-green has-data-[state=checked]:bg-accent-green/20',
                    label: 'text-xs font-black',
                }"
            />
        </UFormField>

        <UFormField label="Nama Kategori" name="name">
            <UInput v-model="state.name" placeholder="Contoh: Makan" size="xl" class="w-full" />
        </UFormField>

        <UFormField label="Ikon Kategori" name="icon">
            <div class="flex flex-col gap-4 rounded-3xl border border-dark/10 bg-neutral-50/50 p-4">
                <!-- Selected Icon Preview -->
                <div class="flex items-center gap-3 px-1">
                    <div
                        class="flex size-10 items-center justify-center rounded-xl bg-accent-green/20 text-dark ring-1 ring-accent-green/30"
                    >
                        <UIcon :name="state.icon || 'solar:tag-linear'" class="text-xl" />
                    </div>
                    <span class="text-sm font-bold text-dark/80">
                        {{ state.icon ? "Ikon terpilih" : "Pilih ikon untuk kategori" }}
                    </span>
                </div>

                <!-- Icon Grid -->
                <div class="grid grid-cols-6 gap-2">
                    <!-- Clear Button -->
                    <button
                        type="button"
                        class="flex aspect-square items-center justify-center rounded-xl bg-dark text-white transition-transform active:scale-90"
                        @click="state.icon = 'solar:tag-linear'"
                    >
                        <UIcon name="solar:close-circle-linear" class="text-2xl" />
                    </button>

                    <!-- Icons -->
                    <button
                        v-for="icon in availableIcons"
                        :key="icon"
                        type="button"
                        class="flex aspect-square items-center justify-center rounded-xl transition-all active:scale-90"
                        :class="
                            state.icon === icon
                                ? 'bg-accent-green text-dark shadow-sm ring-1 ring-dark/10'
                                : 'bg-white text-dark/90 hover:bg-white/80'
                        "
                        @click="state.icon = icon"
                    >
                        <UIcon :name="icon" class="text-2xl" />
                    </button>
                </div>
            </div>
        </UFormField>

        <div class="mt-2 flex flex-col gap-2">
            <UButton
                type="submit"
                block
                size="xl"
                :loading="isSaving"
                class="corner-based bg-accent-green px-6 font-black text-dark hover:bg-accent-green/90"
                :ui="{ base: 'py-4' }"
            >
                Simpan
            </UButton>
        </div>
    </UForm>
</template>

<script setup lang="ts">
import { object, string, minLength, picklist, parse } from "valibot";
import { useCategory } from "~/stores/useCategory";

const emit = defineEmits(["submit"]);

const categoryStore = useCategory();
const isSaving = ref(false);

const categoryTypes = [
    { label: "Pemasukan", value: "income" },
    { label: "Pengeluaran", value: "expenses" },
];

const availableIcons = [
    "solar:wallet-money-linear",
    "solar:wallet-2-bold",
    "solar:wallet-bold-duotone",
    "solar:tag-linear",
    "solar:tag-bold-duotone",
    "solar:add-square-bold",
    "solar:add-square-linear",
    "solar:check-circle-bold",
    "solar:hand-money-broken",
    "solar:inbox-archive-line-duotone",
    "solar:banknote-linear",
    "solar:bill-linear",
    "solar:money-bag-linear",
    "solar:gift-bold",
];

const schema = object({
    name: string([minLength(4, "Nama kategori minimal 4 karakter")]),
    type: picklist(["income", "expenses"], "Pilih tipe kategori"),
    icon: string(),
});

const state = reactive({ name: "", type: "expenses", icon: "solar:tag-linear" });

async function handleSubmit() {
    isSaving.value = true;
    try {
        const parsedData = parse(schema, state);
        const existingCategory = categoryStore.categories.find(
            (cat) => cat.name.toLowerCase() === parsedData.name.toLowerCase(),
        );

        if (existingCategory) {
            useToast().add({
                title: "Gagal",
                description: "Nama kategori sudah ada",
                color: "error",
            });
            return;
        }

        emit("submit", parsedData);
    } catch (error: any) {
        useToast().add({ title: "Validasi Gagal", description: error.message, color: "error" });
    } finally {
        isSaving.value = false;
    }
}
</script>
