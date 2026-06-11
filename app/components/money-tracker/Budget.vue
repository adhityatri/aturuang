<template>
    <USkeleton
        v-if="isLoading"
        class="h-52 w-full rounded-[1.4rem] border-[1.5px] border-dark bg-neutral-300 shadow-[3px_3px_0px_#111111]"
    />

    <div
        v-else
        class="relative w-full overflow-hidden rounded-[1.4rem] border-[1.5px] border-dark bg-white p-4 shadow-[3px_3px_0px_#111111]"
    >
        <!-- Bauhaus Decoration -->
        <div
            class="absolute -right-8 -top-8 size-28 rounded-full bg-accent-yellow"
        />
        <div
            class="absolute -left-10 bottom-0 size-24 rounded-tr-full bg-accent-blue"
        />
        <div
            class="absolute bottom-0 right-0 size-16 rounded-tl-full bg-accent-red"
        />

        <!-- Header -->
        <div class="relative z-1 flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
                <div
                    class="flex size-11 items-center justify-center rounded-xl border-[1.5px] border-dark bg-accent-blue text-white shadow-[2px_2px_0px_#111111]"
                >
                    <UIcon name="solar:calendar-linear" class="block text-xl" />
                </div>

                <div>
                    <p
                        class="text-[10px] font-black uppercase tracking-[0.22em] text-secondary"
                    >
                        Dashboard
                    </p>
                    <h1
                        class="text-md font-black uppercase leading-5 text-dark"
                    >
                        Anggaran Bulanan
                    </h1>
                </div>
            </div>

            <USlideover
                v-model:open="useBudgets().isBudgetOpen"
                :dismissible="false"
                side="bottom"
            >
                <UButton
                    size="sm"
                    trailing-icon="solar:settings-linear"
                    variant="soft"
                    :ui="{
                        base: 'relative z-1 size-10 rounded-full bg-accent-yellow text-dark border-[1.5px] border-dark shadow-[2px_2px_0px_#111111] font-bold flex items-center justify-center p-0',
                    }"
                />

                <template #header>
                    <div class="flex flex-1 items-start justify-between">
                        <div class="flex flex-col">
                            <h1
                                class="text-lg font-black uppercase tracking-wide text-dark"
                            >
                                Sesuaikan Anggaran
                            </h1>
                            <small
                                class="text-[10px] font-bold uppercase tracking-wider text-secondary"
                            >
                                {{
                                    `Anggaran saat ini: ${useFormatPriceIntl(props.budget)}`
                                }}
                            </small>
                        </div>

                        <UButton
                            icon="lucide:x"
                            color="neutral"
                            variant="ghost"
                            @click="handleClose"
                        />
                    </div>
                </template>

                <template #body>
                    <UForm
                        class="z-1 w-full"
                        :schema="budgetSchema"
                        :state="state"
                        @submit="onSubmit"
                    >
                        <UFormField
                            label="Budget"
                            name="amount"
                            class="my-4 w-full"
                        >
                            <UInputNumber
                                v-model="state.amount"
                                orientation="vertical"
                                placeholder="Masukkan budget bulanan kamu"
                                hide-buttons
                                size="xl"
                                :format-options="{
                                    style: 'currency',
                                    currency: 'IDR',
                                    currencyDisplay: 'narrowSymbol',
                                    compactDisplay: 'short',
                                    maximumFractionDigits: 0,
                                    currencySign: 'standard',
                                }"
                                class="w-full"
                                :ui="{
                                    base: 'px-6 py-4 rounded-lg bg-white border-[1.5px] border-dark',
                                    increment: 'hidden',
                                    decrement: 'hidden',
                                }"
                            />
                        </UFormField>

                        <UFormField
                            label="Awal Bulan"
                            name="reset_date"
                            class="my-4 w-full"
                        >
                            <USelect
                                v-model="state.reset_date"
                                :items="resetDateList"
                                size="xl"
                                class="w-full"
                                placeholder="Pilih Tanggal Gajian"
                                :ui="{
                                    base: 'rounded-lg bg-white border-[1.5px] border-dark',
                                }"
                            />
                        </UFormField>

                        <p
                            class="rounded-lg border-[1.5px] border-dark bg-accent-yellow p-4 font-bold text-dark shadow-[2px_2px_0px_#111111]"
                        >
                            <span class="uppercase">Penting:</span>
                            Kami akan mereset saldo dan anggaran Anda pada
                            tanggal
                            {{ state.reset_date }} setiap bulan.
                            {{
                                Number(state.reset_date) >= 27
                                    ? `Untuk bulan yang tidak memiliki tanggal ${state.reset_date}, reset akan dilakukan pada hari terakhir bulan tersebut.`
                                    : ""
                            }}
                        </p>

                        <UButton
                            block
                            class="mt-8"
                            size="xl"
                            color="primary"
                            :ui="{
                                base: 'bg-accent-blue disabled:bg-neutral-300 disabled:text-primary border-[1.5px] border-dark shadow-[2px_2px_0px_#111111] text-white px-6 py-4 rounded-lg font-bold uppercase tracking-wide',
                            }"
                            type="submit"
                        >
                            Simpan
                        </UButton>
                    </UForm>
                </template>
            </USlideover>
        </div>

        <!-- Amount Card -->
        <div
            class="relative z-1 mt-5 rounded-2xl border-[1.5px] border-dark bg-white/90 p-4 shadow-[2px_2px_0px_#111111]"
        >
            <div class="flex flex-wrap items-end gap-2">
                <app-privacy
                    v-if="usePrivacy().isPrivacyAccepted"
                    size="lg"
                    color="primary"
                />

                <template v-else>
                    <span
                        class="rounded-lg bg-accent-red px-2 py-1 text-sm font-black text-white"
                    >
                        Rp
                    </span>
                    <h1
                        class="text-[2rem] font-black leading-none text-accent-red"
                    >
                        {{
                            useFormatPriceIntl(props.expenses)
                                .replace("Rp", "")
                                .trim()
                        }}
                    </h1>
                </template>

                <span class="pb-1 font-black text-dark">/</span>

                <app-privacy
                    v-if="usePrivacy().isPrivacyAccepted"
                    size="md"
                    color="primary"
                />

                <h2 v-else class="pb-1 font-black text-dark">
                    {{ useFormatPriceIntl(props.budget) }}
                </h2>
            </div>

            <div class="mt-4 flex items-center gap-3">
                <UProgress
                    v-model="calculateBudget.percent"
                    size="lg"
                    :status="false"
                    class="flex-1"
                    :ui="{
                        base: 'bg-light border-[1.5px] border-dark',
                        indicator: 'bg-accent-red',
                    }"
                />

                <span
                    class="rounded-full border-[1.5px] border-dark bg-accent-blue px-3 py-1 text-xs font-black text-white"
                >
                    {{ Math.round(calculateBudget.percent) }}%
                </span>
            </div>
        </div>

        <!-- Status -->
        <!-- <div
            class="relative z-1 mt-4 flex items-center gap-3 rounded-2xl border-[1.5px] border-dark bg-blue-50 p-3"
        >
            <div
                class="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-yellow text-xl"
            >
                😎
            </div>

            <div class="h-10 w-[3px] rounded-full bg-accent-blue" />

            <p class="text-xs font-black uppercase leading-4 text-accent-blue">
                {{ calculateBudget.message }}
            </p>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import * as valibot from "valibot";

const props = withDefaults(
    defineProps<{
        isLoading?: boolean;
        budget?: number;
        expenses?: number;
        resetDate?: string;
        isOpen?: boolean;
    }>(),
    { isLoading: false, budget: 0, expenses: 0, resetDate: "1" },
);

const budgetSchema = valibot.required(
    valibot.object({
        reset_date: valibot.pipe(valibot.string()),
        amount: valibot.pipe(valibot.number()),
    }),
);

const state = reactive({
    reset_date: props.resetDate || "",
    amount: props.budget || 0,
});

const resetDateList = computed(() => {
    return Array.from({ length: 31 }, (_, i) => ({
        label: (i + 1).toString(),
        value: (i + 1).toString(),
    }));
});

// const calculateBudget = computed(() => {
//     const percentage = (props.expenses / props.budget) * 100;
//     const message = getBudgetMessage(percentage);
//     return { percent: percentage <= 100 ? percentage : 100, message };
// });
//
const calculateBudget = computed(() => {
    if (!props.budget) {
        return { percent: 0, message: getBudgetMessage(0) };
    }

    const percentage = (props.expenses / props.budget) * 100;
    const message = getBudgetMessage(percentage);

    return { percent: percentage <= 100 ? percentage : 100, message };
});

const handleClose = () => {
    useBudgets().isBudgetOpen = false;
};

const emit = defineEmits(["submit", "close"]);

const onSubmit = async () => {
    const payload = { reset_date: state.reset_date, amount: state.amount };

    emit("submit", payload);
};
</script>
