<script setup>
import { onMounted, watch, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { parse } from "wellknown";

const props = defineProps(["zones", "stations"]);
const map = ref();
const layers = ref([]); // To keep track of added layers

const aqiColors = {
  GOOD: "#22c55e", // green
  MODERATE: "#eab308", // yellow
  UNHEALTHY_SENSITIVE: "#f97316", // orange
  UNHEALTHY: "#ef4444", // red
  VERY_UNHEALTHY: "#a21caf", // purple
  HAZARDOUS: "#6b7280", // gray
};

function renderZones(zones) {
  if (!map.value || !zones) return;
  // Remove previous layers
  layers.value.forEach((layer) => map.value.removeLayer(layer));
  layers.value = [];
  zones.forEach((zone) => {
    const geojsonFeature = parse(zone.geometry);
    if (geojsonFeature) {
      const layer = L.geoJSON(geojsonFeature, {
        style: {
          color: zone.zoneType === "SCHOOL" ? "#3b82f6" : "#ef4444",
          fillOpacity: 1,
        },
      })
        .bindPopup(`<b>${zone.name}</b><br>${zone.zoneType}`)
        .addTo(map.value);
      layers.value.push(layer);
    }
  });
}
function renderStations(stationsArray) {
  if (!map.value || !stationsArray || !Array.isArray(stationsArray.data)) {
    console.error("Invalid stations data format", stationsArray);
    return;
  }
  stationsArray.data.forEach((s) => {
    const color = aqiColors[s.aqiLevel] || "#2563eb";
    const marker = L.marker([s.lat, s.lon], {
      icon: L.divIcon({
        className: "blinking-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
        html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:2px solid white;box-shadow:0 0 8px 2px ${color};animation:blink 1s infinite;opacity:0.8;"></div>`,
      }),
    })
      .bindPopup(
        `<b>${s.station.name.split(",")[0]}</b><br>AQI: ${s.aqi}<br><div style="background:${color};border-radius:2px;display:inline-block;margin-top:4px;border:2px solid red; padding:2px 4px;color:white;">${s.aqiLevel}</div>`,
      )
      .addTo(map.value);
    layers.value.push(marker);
  });
  console.log("Stations rendered on map.");
}

onMounted(() => {
  map.value = L.map("map").setView([3.139, 101.6869], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
    map.value,
  );
  // legend
  const legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    const div = L.DomUtil.create("div", "info legend");

    const categories = [
      { label: "School Zone", color: "#3b82f6", type: "poly" },
      { label: "Other Zone", color: "#ef4444", type: "poly" },
      { label: "Good", color: aqiColors.GOOD, type: "circle" },
      { label: "Moderate", color: aqiColors.MODERATE, type: "circle" },
      {
        label: "Unhealthy (Sensitive)",
        color: aqiColors.UNHEALTHY_SENSITIVE,
        type: "circle",
      },
      { label: "Unhealthy", color: aqiColors.UNHEALTHY, type: "circle" },
      {
        label: "Very Unhealthy",
        color: aqiColors.VERY_UNHEALTHY,
        type: "circle",
      },
      { label: "Hazardous", color: aqiColors.HAZARDOUS, type: "circle" },
    ];

    div.innerHTML +=
      "<div class='bg-white p-2 rounded text-black'><strong>Legend</strong><br></div>";
    categories.forEach((cat) => {
      const style =
        cat.type === "circle"
          ? `background:${cat.color}; border-radius:50%; width:12px; height:12px; display:inline-block; border:1px solid white;`
          : `background:${cat.color}; width:12px; height:12px; display:inline-block; opacity:0.7;`;

      div.innerHTML += `
        <div class="flex items-center gap-2  text-[10px] text-black bg-white px-2 py-1 rounded">
          <i style="${style}"></i>
          <span>${cat.label}</span>
        </div>
      `;
    });
    return div;
  };
  legend.addTo(map.value);
  renderZones(props.zones);
  renderStations(props.stations);
});

watch(
  () => props.zones,
  (newZones) => {
    renderZones(newZones);
  },
);

watch(
  () => props.stations,
  (newStations) => {
    renderStations(newStations);
    console.log("Stations prop changed:", newStations);
  },
);
</script>

<template>
  <div id="map" class="w-full h-full z-0"></div>
</template>

<style>
.blinking-marker {
  animation: blink 1s infinite;
}
@keyframes blink {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.2;
  }
}
</style>
