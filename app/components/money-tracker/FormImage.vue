<template>
  <div
    class="flex bg-neutral-300 p-[8px] shadow-lg shadow-black/10 rounded-4xl overflow-hidden"
  >
    <div
      class="flex flex-col gap-2 text-white py-6 px-8 shadow-2xl shadow-black/50 z-2 rounded-4xl bg-linear-to-b from-primary to-primary-900"
    >
      <h1 class="text-md font-bold">Mager input data? Kami yang urus!</h1>
      <p class="text-sm text-white/70">
        Kita akan bantu kamu untuk catat data dengan lebih mudah dan cepat
      </p>
    </div>
    <div class="bg-neutral-300 flex items-center justify-center z-1">
      <app-upload title="Camera" @upload="handleUpload" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { aiReceiptResponse } from "~/types/transactions";

const transaction = useTransactionsStore();
const categoryStore = useCategory();

const handleUpload = async (data: any) => {
  try {
    transaction.aiLoading = true;
    categoryStore.getCategoryByType("all");
    const base64 = await useBase64Image().convertToBase64(data.target.files[0]);

    if (!base64) {
      throw new Error("Failed to convert image to base64");
    }

    transaction.isCreateOpen = false;
    navigateTo({ name: "new-transaction-page" });
    const response: aiReceiptResponse = await $fetch("/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        image: base64.split(",")[1],
        categoryList: categoryStore.categories,
      },
    });

    transaction.aiResponse = JSON.parse(JSON.stringify(response));
    return response;
  } catch (error) {
    console.log("ini error : ", error);
    return error;
  } finally {
    transaction.aiLoading = false;
  }
};
</script>
