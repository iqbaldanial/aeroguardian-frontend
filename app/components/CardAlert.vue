<script setup>
const config = useRuntimeConfig();
const { data: alerts } = await useFetch(`${config.public.apiBase}/alerts`, {
  server: false,
  onResponseError({ response }) {
    console.error("Error fetching alerts:", response.status, response._data);
  },
});
</script>
<template>
  <div class="divide-y divide-gray-100 dark:divide-gray-800">
    <div
      v-for="alert in alerts || []"
      :key="alert.id"
      class="py-3 flex items-start gap-3"
    >
      <div class="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500">
        <UIcon name="i-lucide-alert-triangle" />
      </div>
      <div class="flex-1">
        <div class="flex justify-between items-center">
          <p class="text-sm font-semibold">{{ alert.zoneName }}</p>
          <span class="text-[10px] text-gray-400">{{
            new Date(alert.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          }}</span>
        </div>
        <p class="text-xs text-gray-500 truncate">
          {{ alert.stationName }} - {{ alert.aqiValue }} AQI
        </p>
      </div>
    </div>
  </div>
</template>
