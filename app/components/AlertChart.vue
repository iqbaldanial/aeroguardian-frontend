<script setup lang="ts">
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const config = useRuntimeConfig();

// Fetching from your specific endpoint
const { data: chartDataRaw } = await useFetch(
  `${config.public.apiBase}/alerts/count-by-station`,
  {
    server: false,
  },
);

// Transform API data for the Chart
const chartData = computed(() => ({
  labels:
    chartDataRaw.value?.map((d: any) => d.stationName.split(",")[0]) || [], // Just take the city name for clarity
  datasets: [
    {
      label: "Total Alerts",
      backgroundColor: "#3b82f6", // Primary Blue
      borderRadius: 6,
      data: chartDataRaw.value?.map((d: any) => d.total) || [],
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true, grid: { color: "#1e293b" } },
    x: { grid: { display: false } },
  },
};
</script>

<template>
  <div class="h-[300px] w-full">
    <Bar v-if="chartDataRaw" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-gray-500">
      <UIcon name="i-lucide-loader-2" class="animate-spin mr-2" />
      Loading Analytics...
    </div>
  </div>
</template>
