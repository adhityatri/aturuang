<template>
  <div class="bg-white p-4 h-[200px] shadow-lg rounded-lg">
    <v-chart autoresize :option="options" class="h-[200px]"></v-chart>
  </div>
</template>

<script setup lang="ts">
const options: ECOption = {
  grid: {
    top: '5%',
    left: '0%',
    right: '0%',
    bottom: '5%',
  },
  type: 'line',
  textStyle:'color: white',
  darkMode: true,
  animation: true,
  dataset: {
    source: [
      ['product', '2020', '2021', '2022'],
      ['Milk Tea', 56.5, 82.1, 88.7],
      ['Matcha Latte', 51.1, 51.4, 55.1],
      ['Cheese Cocoa', 40.1, 62.2, 69.5],
      ['Walnut Brownie', 25.2, 37.1, 41.2],
    ],
  },
  xAxis: {
    type: 'category',
    triggerEvent: true,
    tooltip: {show: true},
  },
  yAxis: {
    triggerEvent: true,
    tooltip: {show: true},
  },
  series: [
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row',
      emphasis: {focus: 'series'},
      lineStyle: { width: 3 }, // Perbesar garis
      symbolSize: 8, // Perbesar titik
    },
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row',
      emphasis: {focus: 'series'},
      lineStyle: { width: 3 }, // Perbesar garis
      symbolSize: 8, // Perbesar titik
    },
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row',
      emphasis: {focus: 'series'},
      lineStyle: { width: 3 }, // Perbesar garis
      symbolSize: 8, // Perbesar titik
    },
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row',
      emphasis: {focus: 'series'},
      lineStyle: { width: 3 }, // Perbesar garis
      symbolSize: 8, // Perbesar titik
    },
  ],
}
</script>