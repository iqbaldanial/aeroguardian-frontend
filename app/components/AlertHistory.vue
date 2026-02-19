<script setup>
const {
  data: alerts,
  pending,
  error,
} = useFetch("http://localhost:8081/api/v1/sensors/alerts", {
  server: false,
});
const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
</script>

<template>
  <div class="divide-y divide-gray-100 dark:divide-gray-800">
    <div v-if="pending" class="flex justify-center items-center h-full">
      <svg
        class="animate-spin h-8 w-8 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <span class="ml-2 text-gray-400">Loading...</span>
    </div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div
      v-else
      v-for="alert in alerts"
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
            formatTime(alert.timestamp)
          }}</span>
        </div>
        <p class="text-xs text-gray-500 truncate">
          {{ alert.stationName }} - {{ alert.aqiValue }} AQI
        </p>
      </div>
    </div>
  </div>
</template>
