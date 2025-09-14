<script setup lang="ts">

const props = defineProps<{
  sources?: any
}>();

const chartOptions = {
  chart: {
    id: 'transactions-charts',
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  colors: ['#28a745', '#FFFFFF'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0,
      stops: [0, 90, 100],
      colorStops: [
        { offset: 0, color: '#28a745', opacity: 0.5 },
        { offset: 50, color: '#28a745', opacity: 0.1 },
        { offset: 100, color: '#28a745', opacity: 0 }
      ]
    },
  },
  grid: {
    borderColor: '#424242', // Darker border for grid
    strokeDashArray: 0,
    yaxis: {
      lines: {
        show: false, // This hides the horizontal lines
      },
    },
    padding: {
      left: 0,
      right: 0,
    }
  },
  markers: {
    size: [0, 0], // Hide markers by default
    colors: ['#28a745'], // Green marker
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: {
      size: 6, // Larger on hover
    },
    // Custom marker for the last point of the first series
    discrete: [{
      seriesIndex: 0,
      dataPointIndex: props.sources.length - 1, // Last point
      fillColor: '#28a745', // Green fill
      strokeColor: '#fff', // White border
      size: 6, // Visible size
      shape: 'circle'
    }]
  },
  stroke: {
    curve: 'smooth',
    width: 2,
    dashArray: [0, 4]
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    categories: [...props.sources.map((item: { month: string }) => item.month)],
    labels: {
      formatter: function (value: string) {
        const date = new Date(value)
        return date.toLocaleString('id-ID', { month: 'short' });
      },
      style: {
        colors: '#9E9E9E', // Light gray for x-axis labels
        fontSize: '11px',
      },
      offsetX: 0,
      offsetY: 0,
    },
    axisBorder: {
      show: false, // Hide x-axis line
    },
    axisTicks: {
      show: false, // Hide x-axis ticks
    },
    crosshairs: {
      show: true,
      width: 1,
      position: 'back',
      opacity: 0.5,
      stroke: {
        color: '#9E9E9E', // Light gray crosshair
        width: 1,
        dashArray: 0,
      },
    },
  },
  yaxis: {
    labels: {
      formatter: function (value: number) {
        return useFormatPriceIntl(value, 'compact', 'short');
      },
      style: {
        colors: '#9E9E9E', // Light gray for y-axis labels
        fontSize: '11px',
      },
      offsetX: -5, // Slightly offset from the right edge
    },
    opposite: true, // Place y-axis on the right
    axisBorder: {
      show: false, // Hide y-axis line
    },
    axisTicks: {
      show: false, // Hide y-axis ticks
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 200
        },
        xaxis: {
          labels: {
            fontSize: '10px'
          }
        },
      }
    }
  ]
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
    <apexchart :options="chartOptions" :series="series" width="100%" />
  </ClientOnly>
</template>