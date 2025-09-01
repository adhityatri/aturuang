<script setup lang="ts">

const props = defineProps<{
  sources?: any
}>();

const chartOptions = {
  chart: {
    id: 'transactions-charts',
    toolbar: {
      tools: {
        download: false,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [...props.sources.map((item: { month: string }) => item.month)],
    labels: {
      formatter: function (value: string) {
        const date = new Date(value)
        return date.toLocaleString('id-ID', { month: 'long' });
      }
    },
  },
  yaxis: {
    labels: {
      formatter: function (value: number) {
        return useFormatPriceIntl(value);
      },
    },
  },
};

const series = [
  {
    name: 'transactions',
    data: [...props.sources.map((item: { total_amount: number }) => item.total_amount)],
  },
];
</script>

<template>
  <ClientOnly>
    <apexchart type="bar" :options="chartOptions" :series="series" width="100%" />
  </ClientOnly>
</template>