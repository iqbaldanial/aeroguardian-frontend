<script setup>
const config = useRuntimeConfig();
const {
  data: zones,
  status,
  error,
} = await useFetch(`${config.public.apiBase}/sync`, {
  onResponse({ response }) {
    console.log("Fetched zones:", response._data);
  },
});
</script>

<template>
  <!-- <h2>settings</h2> -->
  <div v-if="status.pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <li v-for="zone in zones.data" :key="zone.id">
      <ul>
        Aqi:
        {{
          zone.aqi
        }}
        Station:
        {{
          zone.station.name
        }}
      </ul>
    </li>
  </div>
</template>
