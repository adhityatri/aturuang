<template>
  <div class="bg-neutral-50 flex flex-col flex-1 gap-4">
    <div class="p-4 flex justify-between">
      <nuxt-link class="text-primary ring-2 ring-white bg-neutral-100 rounded-full shadow-xl w-[56px] flex items-center justify-center">
        <UIcon name="solar:alt-arrow-left-line-duotone" size="1.5rem" /> 
      </nuxt-link>
      <div class="bg-white rounded-full shadow-xl p-4 px-6 font-medium">
        <h3>Rincian Transaksi</h3>
      </div>
    </div>

    <div class="flex flex-col gap-4 p-4">
      <div
        class="bg-white border-t-4 border-primary shadow-lg rounded-xl p-4 flex flex-col gap-4"
      >
        <h1 class="font-bold text-2xl py-4">
          {{
            `${
              transactionsStore.transactionDetail?.category_type === "expenses"
                ? "-"
                : ""
            } ${useFormatPriceIntl(
              transactionsStore.transactionDetail?.amount
            )}`
          }}
        </h1>
        <USeparator type="dotted" size="md" />
        <div class="flex flex-col">
          <label for="id_transaksi" class="text-sm font-medium text-neutral-500"
            >Id Transaksi</label
          >
          <div class="text-neutral-800">
            {{ transactionsStore.transactionDetail?.id }}
          </div>
        </div>
        <div class="flex flex-col">
          <label for="id_transaksi" class="text-sm font-medium text-neutral-500"
            >Dari</label
          >
          <div class="text-neutral-800">
            {{ transactionsStore.transactionDetail?.wallet_id }}
          </div>
        </div>
        <div class="flex flex-col">
          <label for="id_transaksi" class="text-sm font-medium text-neutral-500"
            >Tanggal Transaksi</label
          >
          <div class="text-neutral-800">
            {{
              useDateFormat(
                transactionsStore.transactionDetail?.created_at,
                "dddd, DD MMMM YYYY",
                {
                  locales: "ID",
                }
              )
            }}
          </div>
        </div>
        <div class="flex flex-col">
          <label for="id_transaksi" class="text-sm font-medium text-neutral-500"
            >Keterangan</label
          >
          <div class="text-neutral-800">
            {{ transactionsStore.transactionDetail?.notes }}
          </div>
        </div>
      </div>

      <div
        class="bg-neutral-100 ring-2 ring-white rounded-xl p-4 shadow-xl flex justify-between items-center"
      >
        <div class="capitalize font-bold text-[1.1rem]">
          {{ transactionsStore.transactionDetail?.category_name }}
        </div>
        <div class="flex gap-4 items-center">
          <UIcon
            :name="
              transactionsStore.transactionDetail?.category_type === 'expenses'
                ? 'solar:arrow-left-down-linear'
                : 'solar:arrow-right-up-linear'
            "
            class="text-[1.5rem] text-green-800"
            :class="{
              'text-red-800':
                transactionsStore.transactionDetail.category_type ===
                'expenses',
            }"
          />
          <div>
            {{
              transactionsStore.transactionDetail.category_type === "expenses"
                ? "Uang Keluar"
                : "Uang Masuk"
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: "transaction-detail",
  title: "Detail Transaksi",
});

useHead({
  bodyAttrs: {
    class: "",
  },
  title: "Detail Transaksi",
});

const route = useRoute();
const id = computed(() => route.query.id?.toString());

const transactionsStore = useTransactionsStore();

await callOnce(
  "transactions-detail",
  () => transactionsStore.getTransactionsWithCategoryById(id.value || ""),
  { mode: "navigation" }
);
</script>
