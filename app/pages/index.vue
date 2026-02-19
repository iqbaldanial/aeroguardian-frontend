<script setup lang="ts">
import { latLng } from "leaflet";
import { DropdownMenuLabel } from "reka-ui";
import MapClient from "~/components/Map.client.vue";
const config = useRuntimeConfig();
// interface Station {
//   lat: number;
//   lon: number;
//   stationName: string;
//   aqi: number;
// }
const { data: zones } = useFetch(`${config.public.apiBase}/zones`, {
  server: false,
});
const { data: stations } = useFetch(`${config.public.apiBase}/sync`, {
  server: false,
  onResponse({ response }) {
    console.log("Fetched stations:", response._data);
  },
});
</script>

<template>
  <div class="flex flex-col h-full w-full bg-slate-950">
    <section class="h-1/2 w-full border-b border-slate-800">
      <ClientOnly>
        <MapClient :zones="zones" :stations="stations" />
      </ClientOnly>
    </section>

    <div
      class="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-hidden"
    >
      <UCard class="lg:col-span-2 bg-slate-900/50 border-slate-800">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-bold text-white uppercase tracking-wider">
              Alerts by Station
            </h3>
            <UIcon name="i-lucide-bar-chart-3" class="text-primary-500" />
          </div>
        </template>
        <AlertChart />
      </UCard>

      <UCard
        class="bg-slate-900/50 border-slate-800 overflow-hidden flex flex-col"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-bold text-white uppercase tracking-wider">
              Recent Logs
            </h3>
            <UButton to="/history" variant="ghost" size="xs" label="View all" />
          </div>
        </template>
        <AlertHistory class="flex-1 overflow-y-auto" />
      </UCard>
    </div>
  </div>
</template>
