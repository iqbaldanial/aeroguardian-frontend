<script setup lang="ts">
import { h, resolveComponent } from "vue";
import { upperFirst } from "scule";
import type { TableColumn } from "@nuxt/ui";
import { useClipboard } from "@vueuse/core";

const UButton = resolveComponent("UButton");
const UCheckbox = resolveComponent("UCheckbox");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const toast = useToast();
const { copy } = useClipboard();
const config = useRuntimeConfig();
const { data: alerts, pending } = useFetch<Alert[]>(
  `${config.public.apiBase}/alerts`,
  {
    server: false,
    onResponseError({ response }) {
      console.error("Error fetching alerts:", response.status, response._data);
    },
  },
);

interface Alert {
  id: string;
  zoneName: string;
  stationName: string;
  aqiValue: number;
  timestamp: string;
}

const colors: Record<string, string> = {
  GOOD: "success",
  MODERATE: "warning",
  UNHEALTHY_SENSITIVE: "orange",
  UNHEALTHY: "error",
  VERY_UNHEALTHY: "neutral",
  HAZARDOUS: "dark",
};

const columns: TableColumn<Alert>[] = [
  //   {
  //     accessorKey: "id",
  //     header: "#",
  //     cell: ({ row }) => `#${row.getValue("id")}`,
  //   },
  {
    accessorKey: "zoneName",
    header: "Facility",
    cell: ({ row }) => row.getValue("zoneName"),
  },
  {
    accessorKey: "stationName",
    header: "Station",
    cell: ({ row }) => row.getValue("stationName"),
  },
  {
    accessorKey: "aqiValue",
    header: "AQI",
    cell: ({ row }) => row.getValue("aqiValue"),
  },
  {
    accessorKey: "aqiLevel",
    header: "Status",
    cell: ({ row }) => {
      const color = {
        GOOD: "success" as const,
        MODERATE: "warning" as const,
        UNHEALTHY_SENSITIVE: "orange" as const,
        UNHEALTHY: "error" as const,
        VERY_UNHEALTHY: "neutral" as const,
        HAZARDOUS: "dark" as const,
      }[row.getValue("aqiLevel") as string];

      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("aqiLevel"),
      );
    },
  },

  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) =>
      new Date(row.getValue("timestamp")).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
  },
];

const table = useTemplateRef("table");

function randomize() {
  if (Array.isArray(alerts.value)) {
    alerts.value = [...alerts.value].sort(() => Math.random() - 0.5);
  }
}
</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
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
    <div v-else>
      <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
        <UInput
          :model-value="
            table?.tableApi?.getColumn('zoneName')?.getFilterValue() as string
          "
          class="max-w-sm min-w-[12ch]"
          placeholder="Filter facility names..."
          @update:model-value="
            table?.tableApi?.getColumn('zoneName')?.setFilterValue($event)
          "
        />

        <UButton color="neutral" label="Randomize" @click="randomize" />

        <UDropdownMenu
          :items="
            table?.tableApi
              ?.getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => ({
                label: upperFirst(column.id),
                type: 'checkbox' as const,
                checked: column.getIsVisible(),
                onUpdateChecked(checked: boolean) {
                  table?.tableApi
                    ?.getColumn(column.id)
                    ?.toggleVisibility(!!checked);
                },
                onSelect(e: Event) {
                  e.preventDefault();
                },
              }))
          "
          :content="{ align: 'end' }"
        >
          <UButton
            label="Columns"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-chevron-down"
            class="ml-auto"
            aria-label="Columns select dropdown"
          />
        </UDropdownMenu>
      </div>

      <UTable
        ref="table"
        :data="alerts"
        :columns="columns"
        sticky
        class="h-150"
      >
        <template #expanded="{ row }">
          <pre>{{ row.original }}</pre>
        </template>
      </UTable>
      <div class="px-4 py-3.5 text-sm text-muted">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s)
        selected.
      </div>
    </div>
  </div>
</template>
