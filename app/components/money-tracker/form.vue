<template>
  <UForm
    class="w-full z-1"
    :schema="trackerSchema"
    :state="state"
    @submit="onSubmit"
  >
    <UFormField label="Kategori" name="category" class="w-[100%] mb-4">
      <USelect
        v-model="state.category"
        :items="categoryList"
        size="xl"
        class="w-[100%]"
      />
    </UFormField>
    <UFormField label="Jumlah" name="amount" class="w-[100%] mb-4">
      <UInput v-model="state.amount" size="xl" type="number" class="w-[100%]" />
    </UFormField>
    <UFormField label="Catatan" name="notes" class="w-[100%] mb-4">
      <UInput v-model="state.notes" size="xl" type="text" class="w-[100%]" />
    </UFormField>

    <UButton block class="mt-8" size="xl" color="primary" type="submit">
      Simpan
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as valibot from "valibot";

const emits = defineEmits<{
  (e: "close-on-submit"): void;
}>();

interface Category {
  id: number;
  name: string;
}

const category = useCategory();
const categoryList = computed(() =>
  Array.isArray(category.value)
    ? category.value.map((cat: Category) => ({
        label: useCapitalize(cat.name),
        value: cat.id,
      }))
    : []
);

const trackerSchema = valibot.required(
  valibot.object({
    category: valibot.pipe(valibot.number()),
    user: valibot.pipe(
      valibot.string(),
      valibot.minLength(4, "Must be at least 4 characters")
    ),
    amount: valibot.pipe(
      valibot.number(),
      valibot.minValue(100, "Amount must be positive")
    ),
    notes: valibot.optional(valibot.string()),
  })
);

type TrackerSchema = valibot.InferOutput<typeof trackerSchema>;

const state = reactive({
  category: 0,
  user: useSupabaseUser()?.value?.id || "",
  amount: 0,
  notes: "",
});

const supabase = useSupabaseClient();
const toast = useToast();

const onSubmit = async (event: FormSubmitEvent<TrackerSchema>) => {
  const { category, user, amount, notes } = event.data;

  const { error } = await supabase
    .from("transactions")
    .insert({ category_id: category, user_id: user, amount, notes });

  toast.add({
    title: error ? "Error" : "Success",
    description: error ? error.message : "Transaction saved successfully!",
    color: error ? "red" : "green",
  });

  if (!error) {
    emits("close-on-submit");
  }
};
</script>
