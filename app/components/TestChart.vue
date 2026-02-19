<script setup lang="ts">
import type { ChartConfig } from "@/components/ui/chart";
import { VisAxis, VisGroupedBar, VisXYContainer } from "@unovis/vue";
import {
  ChartContainer,
  ChartCrosshair,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from "@/components/ui/chart";

const config = useRuntimeConfig();
const alertData = ref<any[]>([]);
const {
  data: alerts,
  pending,
  error,
} = useFetch(`${config.public.apiBase}/alerts/count-by-station`, {
  server: false,
  onResponseError({ response }) {
    console.error(
      "Error fetching zone stats:",
      response.status,
      response._data,
    );
  },
});

// const alertData = [
//   { stationName: "Cheras,Kuala Lumpur, Wilayah Persekutuan, Malaysia", total: 186 },
//   { stationName: "Batu Muda,Kuala Lumpur, Wilayah Persekutuan, Malaysia", total: 186},
// ];

watch(
  alerts,
  (newAlerts) => {
    console.log("API DATA:", newAlerts);
    if (newAlerts && Array.isArray(newAlerts)) {
      alertData.value = newAlerts.map((a) => ({
        station: a.stationName.split(",")[0], // Shorten name for display
        total: a.total,
      }));
    }
    console.log("APALertI DATA:", alertData.value);
  },
  { immediate: true },
);
interface Data {
  station: string;
  total: number;
}
const chartConfig = {
  total: {
    label: "AQI Total",
    color: "#2563eb",
  },
} satisfies ChartConfig;
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <ClientOnly>
    <ChartContainer :config="chartConfig" class="min-h-[200px] w-full">
      <VisXYContainer
        :data="alertData"
        :x-scale="{ type: 'band' }"
        :y-scale="{ type: 'linear' }"
        :padding="{ top: 10, bottom: 30, left: 40, right: 10 }"
      >
        <VisGroupedBar
          :x="(d: Data) => d.station"
          :y="(d: Data) => d.total"
          :color="[chartConfig.total.color]"
          :rounded-corners="4"
          bar-padding="0.1"
          group-padding="0"
        />
        <VisAxis
          type="x"
          :x="(d: Data) => d.station"
          :tick-line="false"
          :domain-line="false"
          :grid-line="false"
          :tick-format="(d: Data) => d"
          :tick-values="alertData.map((d: Data) => d.station)"
        />
        <VisAxis
          type="y"
          :tick-format="(d: Data) => d"
          :tick-line="false"
          :domain-line="false"
          :grid-line="true"
        />
        <ChartTooltip />
      </VisXYContainer>
      <ChartLegendContent />
    </ChartContainer>
  </ClientOnly>
</template>
