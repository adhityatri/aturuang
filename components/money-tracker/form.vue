<template>
  <UCard class="bg-white">
    <template #header> Form Catatan </template>
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4 w-[100%]"
      @submit="onSubmit"
    >
      <UFormField label="amount" name="amount" class="w-[100%]">
        <UInputNumber
          v-model="state.amount"
          variant="soft"
          :format-options="{
            style: 'currency',
            currency: 'IDR',
            currencyDisplay: 'code',
            currencySign: 'accounting',
          }"
          class="w-full"
        />
      </UFormField>

      <USeparator />

      <UFormField label="Kategori" name="category" class="w-[100%]">
        <URadioGroup
          size="xs"
          v-model="state.category"
          orientation="horizontal"
          indicator="start"
          variant="list"
          default-value="in"
          :items="itemsCategory"
        />
      </UFormField>
      <UFormField label="Notes" name="notes" class="w-[100%]">
        <UTextarea variant="soft" v-model="state.notes" class="w-full" />
      </UFormField>
    </UForm>
    <template #footer> <UButton type="submit"> Submit </UButton> </template>
  </UCard>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { RadioGroupItem, FormSubmitEvent } from "@nuxt/ui";

const itemsCategory = ref<RadioGroupItem[]>(["in", "out"]);

const schema = z.object({
  category: z.string(),
  amount: z.number(),
  notes: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({
  category: undefined,
  amount: 0,
  notes: undefined,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
}
</script>
