<template>
  <div class="bg-neutral-100">
    <app-nav-title title="Help us improve!" @close="$router.back()" />

    <!-- <div class="p-4">
      <div
        class="bg-primary text-white p-4 rounded-xl shadow-lg ring-2 ring-white"
      >
        <UIcon name="solar:tea-cup-bold-duotone" class="text-5xl" />
        <h4 class="font-medium text-lg">Bahan Bakar Kreativitas</h4>
        <p class="text-sm mt-2">
          Setiap secangkir kopi yang Anda traktir adalah satu jam ekstra waktu
          yang kami dedikasikan untuk membuat <b>YOTRO</b> ini lebih baik.
          <br />
          Mari kita wujudkan ide-ide besar bersama! Scan QRIS di bawah ini.
        </p>

        <img
          src="https://storage.googleapis.com/narasi-production.appspot.com/production/large/1741949801001/cara-membuat-qris-gopay-untuk-pemilik-usaha-bikin-transaksi-lebih-cepat-dan-efisien-large.jpg"
          alt="Cara Membuat QRIS GoPay Untuk Pemilik Usaha Bikin Transaksi Lebih Cepat Dan Efisien"
          class="w-full h-auto object-cover rounded-xl mt-4"
        />
      </div>
    </div> -->
    <div class="p-4">
      <!-- <div
        class="bg-neutral-200 main-shadow text-white p-4 rounded-xl shadow-lg ring-2 ring-white"
      > -->
      <img
        :src="
          useRuntimeConfig().public.supabaseUrl +
          '/storage/v1/object/public/yothro/feedback.webp'
        "
        alt="feedback image"
        class="shadow-lg rounded-lg overflow-hidden"
      />
      <!-- </div> -->
    </div>

    <div class="p-4 pt-0">
      <h4 class="font-medium text-lg">Kirim Saran dan Masukan</h4>
      <p class="text-sm mt-2">
        Kami sangat menghargai saran dan masukan Anda. Silakan kirimkan di bawah
        ini.
      </p>

      <UForm
        class="w-full z-1 mt-6"
        :schema="schema"
        :state="state"
        @submit="onSubmit"
      >
        <UFormField label="Jenis" name="name" class="w-full mb-4">
          <USelect
            v-model="state.type"
            :items="itemTypes"
            size="xl"
            class="w-full capitalize"
            placeholder="Pilih Kantong"
          />
        </UFormField>

        <UFormField
          label="Saran dan Masukan"
          name="feedback"
          class="w-full mb-4"
        >
          <UTextarea
            v-model="state.feedback"
            placeholder="Ketik saran dan masukan Anda di sini"
            size="xl"
            :ui="{
              root: 'w-full',
              base: 'text-md',
            }"
          />
        </UFormField>

        <UButton
          block
          class="mt-8"
          size="xl"
          color="primary"
          type="submit"
          :disabled="!isReady"
          :ui="{
            base: 'px-6 py-4 rounded-full disabled:bg-neutral-500',
          }"
        >
          Kirimkan
        </UButton>
      </UForm>
    </div>

    <USeparator class="py-4" type="dotted" size="xl" />

    <div class="p-4 pt-0 flex flex-col gap-4">
      <h1 class="font-medium text-lg">Riwayat Masukan</h1>
      <div
        v-if="feedbackStore.list.length === 0"
        class="p-4 main-shadow shadow-lg rounded-xl ring-2 ring-white"
      >
        <p class="text-center text-neutral-500">Belum ada masukan.</p>
      </div>
      <div
        v-for="item in feedbackStore.list"
        :key="item.id"
        class="bg-neutral-200 main-shadow p-4 rounded-xl shadow-lg ring-2 ring-white"
      >
        <div class="flex flex-col">
          <span class="font-medium text-md capitalize">{{ item.type }}</span>
          <span class="text-sm text-neutral-500">{{
            useDateFormat(item.created_at, "dddd, DD MMMM YYYY", {
              locales: "ID",
            })
          }}</span>
        </div>
        <p class="mt-2">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as valibot from "valibot";

definePageMeta({
  title: "Help us improve!",
  name: "improve-page",
});

const itemTypes = ref(["feature", "bug", "error"]);

const schema = valibot.required(
  valibot.object({
    feedback: valibot.string(),
    type: valibot.string(),
  })
);

const state = reactive({
  feedback: "",
  type: "feature",
});

const feedbackStore = useFeedbackStore();

const { refresh } = useAsyncData("feedback-page", async () => {
  await feedbackStore.getFeedback();
});

const isReady = computed(() => state.feedback.length > 0);

const onSubmit = async () => {
  const { error } = await feedbackStore.addFeedback({
    feedback: state.feedback,
    type: state.type,
  });

  if (error) {
    return;
  }

  refresh();

  state.feedback = "";
  state.type = "feature";
};
</script>
