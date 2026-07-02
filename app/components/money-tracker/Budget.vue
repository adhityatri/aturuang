<template>
    <USkeleton v-if="isLoading" class="h-52 w-full rounded-[1.4rem] bg-neutral-300" />

    <div
        v-else
        class="relative h-full flex flex-col items-center justify-center flex-1 overflow-hidden rounded-4xl bg-accent-green p-4"
    >
        <!-- Header -->
        <div class="relative z-1">
            <p class="text-xs font-black uppercase tracking-[0.22em] text-dark mr-0!">
                Pengeluaran Saat Ini
            </p>
        </div>
        <div class="flex flex-col items-center justify-center min-w-[80%]">
            <app-privacy v-if="usePrivacy().isPrivacyAccepted" size="lg" color="primary" />
            <div v-else class="flex items-center gap-2">
                <!-- <span class="text-accent-red text-sm font-black">  </span> -->
                <h1 class="text-[2rem] font-black leading-none text-dark">
                    Rp {{ useFormatPriceIntl(props.expenses).replace("Rp", "").trim() }}
                </h1>
            </div>
            <USeparator
                label="Bulan lalu"
                class="mt-2 border-dark!"
                :ui="{ border: 'border-dark' }"
            />
            <div
                v-if="compareToLastMonth"
                class="mt-2 px-4 py-1 flex justify-between text-white items-center rounded-2xl w-full bg-dark"
            >
                <div class="text-sm">
                    {{ useFormatPriceIntl(lastMonthExpenses) }}
                </div>
                <div class="flex items-center justify-center">
                    <UIcon
                        :name="
                            compareToLastMonth.up ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'
                        "
                        class="text-sm"
                    />
                    <small class="text-xs text-white-smooth">
                        {{ compareToLastMonth.percent }}% / month
                    </small>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="flex items-center"> -->
    <!-- <div
                    class="flex size-11 items-center justify-center rounded-full bg-accent-blue text-white shadow-[2px_2px_0px_#111111]/10"
                > -->
    <!-- <UIcon name="solar:calendar-linear" class="block text-xl" /> -->
    <!-- <UIcon
                        :name="
                            compareToLastMonth.up ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'
                        "
                        class="text-sm"
                    />
                </div> -->

    <!-- <div>
                     <h1
                        class="text-md font-black uppercase leading-5 text-dark"
                    >
                        Anggaran Bulanan
                    </h1>
                 </div>  -->
    <!-- </div> -->

    <!-- <div class="flex bg-accent-blue px-2 rounded-full"> -->
    <!-- <div class="flex size-11 items-center justify-center pr-2 text-white"> -->
    <!-- <UIcon name="solar:calendar-linear" class="block text-xl" /> -->
    <!-- <UIcon
                        :name="
                            compareToLastMonth.up ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'
                        "
                        class="text-sm"
                    />
                    <small class="text-xs"> {{ compareToLastMonth.percent }}% </small>
                </div>
                <USeparator orientation="vertical" class="h-auto" />
                <USlideover
                    v-model:open="useBudgets().isBudgetOpen"
                    :dismissible="false"
                    side="bottom"
                >
                    <UButton
                        size="sm"
                        trailing-icon="solar:settings-linear"
                        variant="ghost"
                        :ui="{
                            base: 'relative z-1 text-white size-10 font-bold flex items-center justify-center p-0',
                        }"
                    />

                    <template #header>
                        <div class="flex flex-1 items-start justify-between">
                            <div class="flex flex-col">
                                <h1 class="text-lg font-black uppercase tracking-wide text-dark">
                                    Sesuaikan Anggaran
                                </h1>
                                <small
                                    class="text-[10px] font-bold uppercase tracking-wider text-secondary"
                                >
                                    {{ `Anggaran saat ini: ${useFormatPriceIntl(props.budget)}` }}
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
                            <UFormField label="Budget" name="amount" class="my-4 w-full">
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

                            <UFormField label="Awal Bulan" name="reset_date" class="my-4 w-full">
                                <USelect
                                    v-model="state.reset_date"
                                    :items="resetDateList"
                                    size="xl"
                                    class="w-full"
                                    placeholder="Pilih Tanggal Gajian"
                                    :ui="{ base: 'rounded-lg bg-white border-[1.5px] border-dark' }"
                                />
                            </UFormField>

                            <p
                                class="rounded-lg border-[1.5px] border-dark bg-accent-yellow p-4 font-bold text-dark shadow-[2px_2px_0px_#111111]"
                            >
                                <span class="uppercase">Penting:</span>
                                Kami akan mereset saldo dan anggaran Anda pada tanggal
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
                </USlideover> -->
    <!-- </div> -->

    <!-- Amount Card -->
    <!-- <div class=""> -->
    <!-- <div class="flex flex-col items-start justify-center">
                <app-privacy v-if="usePrivacy().isPrivacyAccepted" size="lg" color="primary" />
                <div v-else class="flex items-center gap-2">
                    <span class="text-accent-red text-sm font-black"> Rp </span>
                    <h1 class="text-[2rem] font-black leading-none text-accent-red">
                        {{ useFormatPriceIntl(props.expenses).replace("Rp", "").trim() }}
                    </h1>
                </div> -->

    <!-- Last month comparison -->
    <!-- <div
                    v-if="compareToLastMonth"
                    class="mt-2 px-4 py-1 flex flex-col text-white items-center rounded-full bg-linear-to-b/oklab from-accent-blue/85 to-accent-blue"
                >
                    <div class="text-sm">
                        {{ useFormatPriceIntl(lastMonthExpenses) }}
                    </div>
                    <div class="flex items-center justify-center">
                        <UIcon
                            :name="
                                compareToLastMonth.up
                                    ? 'solar:arrow-up-bold'
                                    : 'solar:arrow-down-bold'
                            "
                            class="text-sm"
                        />
                        <small class="text-xs font-black text-dark">
                            {{ compareToLastMonth.percent }}%
                        </small>
                    </div>
                </div> -->
    <!-- </div> -->

    <!-- <div class="mt-4 flex items-center gap-3">
                <UProgress
                    v-model="animatedPercent"
                    size="2xl"
                    :status="false"
                    class="flex-1"
                    :ui="{
                        base: 'bg-white shadow-[2px_2px_0px_#111111]/10 overflow-hidden',
                        indicator: 'bg-accent-red animate-progress-pulse',
                    }"
                />

                <span
                    class="rounded-full bg-accent-blue px-3 py-1 text-xs font-black text-white"
                >
                    {{ Math.round(calculateBudget.percent) }}%
                </span>
            </div> -->
    <!-- </div> -->
    <!-- </div> -->
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

const state = reactive({ reset_date: props.resetDate || "", amount: props.budget || 0 });

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

const calculateBudget = computed(() => {
    if (!props.budget) {
        return { percent: 0, message: getBudgetMessage(0) };
    }

    const percentage = (props.expenses / props.budget) * 100;
    const message = getBudgetMessage(percentage);

    return { percent: percentage <= 100 ? percentage : 100, message };
});

const animatedPercent = ref(0);

onMounted(() => {
    setTimeout(() => {
        animatedPercent.value = calculateBudget.value.percent;
    }, 100);
});

watch(
    () => calculateBudget.value.percent,
    (val) => {
        animatedPercent.value = val;
    },
);

const transactionStore = useTransactionsStore();

const lastMonthExpenses = computed(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    return transactionStore.transactions
        .filter((t) => {
            const d = new Date(t.created_at);
            return t.category_type === "expenses" && d >= start && d <= end;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const compareToLastMonth = computed(() => {
    if (!lastMonthExpenses.value) return null;
    const diff = (props.expenses || 0) - lastMonthExpenses.value;
    const percent = Math.abs((diff / lastMonthExpenses.value) * 100);
    return { diff, percent: Math.round(percent), up: diff > 0 };
});

const emit = defineEmits(["submit", "close"]);

const onSubmit = async () => {
    const payload = { reset_date: state.reset_date, amount: state.amount };

    emit("submit", payload);
};

const handleClose = () => {
    useBudgets().isBudgetOpen = false;
};
</script>
