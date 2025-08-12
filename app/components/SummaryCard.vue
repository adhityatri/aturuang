<template>
  <div class="flex flex-col gap-4">
    <div
      class="relative overflow-hidden h-[140px] rounded-xl shadow-xl bg-primary flex flex-col items-start justify-between"
    >
      <div class="absolute inset-0 z-0 custom-bg" />
      <div
        class="px-4 leading-[2rem] flex-1 flex flex-col justify-center text-white z-1"
      >
        <p>Saldo Saat Ini</p>
        <h1 class="text-[2rem] font-bold">
          {{ useFormatPriceIntl(props.currentBalance) }}
        </h1>
      </div>
      <div>
        <UIcon
          name="solar:wallet-money-bold"
          class="text-[10rem] opacity-20 text-white absolute right-0 bottom-[-20px]"
        />
      </div>
    </div>
    <div
      class="bg-white shadow-xl rounded-xl p-4 h-auto text-neutral-600 w-full flex justify-between z-1"
    >
      <div class="flex items-center gap-2">
        <UIcon
          name="solar:arrow-left-down-linear"
          class="text-[2rem] text-green-800"
        />
        <div class="flex flex-col items-start leading-[1.2rem]">
          <small>Pemasukan</small>
          <h2 class="text-[1rem]">{{ useFormatPriceIntl(props.income) }}</h2>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UIcon
          name="solar:arrow-right-up-linear"
          class="text-[2rem] text-red-800"
        />
        <div class="flex flex-col items-start leading-[1.2rem]">
          <small>Pengeluaran</small>
          <h2 class="text-[1.2m]">
            {{ useFormatPriceIntl(props.expenses) }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentBalance?: number;
  income?: number;
  expenses?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentBalance: 0,
  income: 0,
  expenses: 0,
});
</script>

<style scoped>
.custom-bg {
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 30px;
  -webkit-mask-image: radial-gradient(
    ellipse 70% 60% at 50% 0%,
    #000 60%,
    transparent 100%
  );
  mask-image: radial-gradient(
    ellipse 70% 60% at 50% 0%,
    #000 60%,
    transparent 100%
  );
}

/* <div className="min-h-screen w-full bg-[#f8fafc] relative">
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
      backgroundSize: "20px 30px",
      WebkitMaskImage:
        "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
      maskImage:
        "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
    }}
  />
</div> */
</style>
