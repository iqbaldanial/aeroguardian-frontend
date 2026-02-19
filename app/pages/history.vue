<script setup lang="ts">
import CardAlert from "~/components/CardAlert.vue";
</script>

<template>
  <div class="w-full h-full mx-5">
    <div class="mb-4">
      <h1 class="text-xl font-bold text-white uppercase tracking-wider mt-5">
        Alerts History
      </h1>
    </div>
    <div class="mt-4 w-full">
      <!-- <CardAlert /> -->
      <AlertTable />
    </div>
  </div>
</template>
