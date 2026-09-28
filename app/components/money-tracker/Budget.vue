<template>
    <USkeleton v-if="isLoading" class="h-52 w-full corner-based bg-neutral-300" />

    <div
        v-else
        class="relative h-full flex flex-col items-center justify-center flex-1 overflow-hidden corner-based bg-accent-green p-4"
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
                class="mt-2 px-4 py-1 flex justify-between text-white items-center corner-based w-full bg-dark"
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
</template>

<script setup lang="ts">
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

const state = reactive({ reset_date: props.resetDate || "", amount: props.budget || 0 });

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

    const filteredTransactions = transactionStore.transactions
        .filter((t) => {
            const d = new Date(t.created_at);
            return t.category_type === "expenses" && d >= start && d <= end;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    return filteredTransactions;
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
</script>
