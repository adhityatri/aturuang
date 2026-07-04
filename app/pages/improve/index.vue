<template>
    <div class="relative flex min-h-dvh flex-1 flex-col overflow-hidden main-bg pb-18">
        <!-- Background -->
        <div class="relative z-1">
            <app-nav-title title="Help us improve!" @close="$router.back()" />

            <main class="px-4 pb-6 pt-4">
                <!-- Hero -->
                <section class="relative overflow-hidden rounded-4xl bg-accent-green p-4">
                    <div class="relative z-1 flex items-center gap-4">
                        <div
                            class="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-dark"
                        >
                            <UIcon
                                name="solar:chat-round-dots-bold"
                                class="text-4xl text-white-smooth"
                            />
                        </div>

                        <div class="min-w-0 flex-1">
                            <p class="text-[10px] font-black uppercase tracking-[0.24em]">
                                Feedback
                            </p>

                            <h1 class="text-2xl font-black uppercase leading-tight text-dark">
                                Kirim Saran
                            </h1>

                            <p class="text-xs font-medium leading-5">
                                Bantu kami membuat aplikasi ini lebih nyaman dan berguna.
                            </p>
                        </div>
                    </div>
                </section>

                <!-- Form -->
                <section class="mt-5 rounded-4xl bg-white-smooth p-4">
                    <div class="mb-4">
                        <h2 class="text-lg font-black uppercase text-dark">Saran dan Masukan</h2>
                    </div>

                    <UForm class="w-full" :schema="schema" :state="state" @submit="onSubmit">
                        <UFormField label="Jenis" name="type" class="mb-4 w-full">
                            <USelect
                                v-model="state.type"
                                :items="itemTypes"
                                size="xl"
                                class="w-full capitalize"
                                placeholder="Pilih jenis masukan"
                                :ui="{
                                    base: 'rounded-2xl ring-1 ring-dark bg-white-smooth px-4 py-4 font-bold text-dark ',
                                    content: 'rounded-2xl ring-1 ring-dark bg-white-smooth ',
                                }"
                            />
                        </UFormField>

                        <UFormField label="Saran dan Masukan" name="feedback" class="mb-4 w-full">
                            <UTextarea
                                v-model="state.feedback"
                                placeholder="Tulis saran, bug, atau kendala yang kamu alami..."
                                size="xl"
                                :rows="5"
                                :ui="{
                                    root: 'w-full',
                                    base: 'rounded-2xl ring-1 ring-dark bg-white-smooth px-4 py-4 text-md font-medium text-dark',
                                }"
                            />
                        </UFormField>

                        <div
                            class="rounded-2xl bg-accent-red/50 p-3 text-xs font-bold leading-5 text-dark"
                        >
                            <span class="font-black uppercase">Catatan:</span>
                            Masukan kamu akan membantu kami memperbaiki fitur, tampilan, dan
                            pengalaman penggunaan aplikasi.
                        </div>

                        <UButton
                            block
                            class="mt-6"
                            size="xl"
                            color="primary"
                            type="submit"
                            :disabled="!isReady"
                            :ui="{
                                base: 'rounded-2xl bg-accent-green px-6 py-4 text-sm font-black uppercase tracking-wide text-dark disabled:bg-neutral-300 disabled:bg-accent-green/40',
                            }"
                        >
                            Kirim
                        </UButton>
                    </UForm>
                </section>

                <!-- History -->
                <section class="mt-6">
                    <div class="mb-4 flex items-center justify-between">
                        <div>
                            <h2 class="text-lg font-black uppercase text-white">Riwayat</h2>

                            <p class="text-xs font-bold uppercase tracking-wider text-white/70">
                                {{ feedbackStore.list.length }} masukan terkirim
                            </p>
                        </div>

                        <UButton
                            icon="solar:refresh-linear"
                            color="neutral"
                            variant="ghost"
                            :ui="{
                                base: 'flex size-11 items-center justify-center rounded-2xl bg-accent-green p-0 text-dark',
                            }"
                            @click="refresh"
                        />
                    </div>

                    <div
                        v-if="feedbackStore.list.length === 0"
                        class="rounded-2xl border-1 border-dashed border-dark bg-white-smooth p-8 text-center"
                    >
                        <div
                            class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent-green text-dark"
                        >
                            <UIcon name="solar:chat-round-dots-linear" class="text-2xl" />
                        </div>

                        <h3 class="text-sm font-black uppercase text-dark">Belum Ada Masukan</h3>

                        <p class="text-xs font-medium leading-5 text-dark">
                            Masukan yang kamu kirim akan muncul di sini.
                        </p>
                    </div>

                    <div v-else class="flex flex-col gap-3">
                        <article
                            v-for="item in feedbackStore.list"
                            :key="item.id"
                            class="rounded-2xl border-[2px] border-dark bg-white p-4 shadow-[3px_3px_0px_#111111]"
                        >
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <span
                                        class="rounded-full border-[1.5px] border-dark bg-accent-yellow px-3 py-1 text-[10px] font-black uppercase text-dark"
                                    >
                                        {{ item.type }}
                                    </span>

                                    <p class="mt-3 text-xs font-bold text-secondary">
                                        {{
                                            useDateFormat(item.created_at, "dddd, DD MMMM YYYY", {
                                                locales: "ID",
                                            })
                                        }}
                                    </p>
                                </div>

                                <div
                                    class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-blue text-white"
                                >
                                    <UIcon name="solar:chat-round-line-linear" class="text-xl" />
                                </div>
                            </div>

                            <p class="mt-4 text-sm font-medium leading-6 text-dark">
                                {{ item.description }}
                            </p>
                        </article>
                    </div>
                </section>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as valibot from "valibot";

definePageMeta({ title: "Help us improve!", name: "improve-page" });

const itemTypes = ref(["feature", "bug", "error"]);

const schema = valibot.required(
    valibot.object({
        feedback: valibot.pipe(
            valibot.string(),
            valibot.minLength(4, "Masukan minimal 4 karakter"),
        ),
        type: valibot.string(),
    }),
);

const state = reactive({ feedback: "", type: "feature" });

const feedbackStore = useFeedbackStore();

const { refresh } = useAsyncData("feedback-page", async () => {
    await feedbackStore.getFeedback();
});

const isReady = computed(() => state.feedback.trim().length >= 4);

const onSubmit = async () => {
    if (!isReady.value) return;

    const { error } = await feedbackStore.addFeedback({
        feedback: state.feedback.trim(),
        type: state.type,
    });

    if (error) {
        useToast().add({ title: "Feedback", description: error.message, color: "error" });
        return;
    }

    useToast().add({
        title: "Feedback",
        description: "Masukan berhasil dikirim",
        color: "success",
    });

    refresh();

    state.feedback = "";
    state.type = "feature";
};
</script>
