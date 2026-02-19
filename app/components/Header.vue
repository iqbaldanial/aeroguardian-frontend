<!-- <script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Dashboard",
    to: "/",
    active: route.path.startsWith("/"),
  },
  {
    label: "History",
    to: "/history",
    active: route.path.startsWith("/history"),
  },
  {
    label: "Settings",
    to: "/settings",
    active: route.path.startsWith("/settings"),
  },
]);
</script>

<template>
  <UHeader>
    <template #left>
      <div class="flex items-center gap-3">
        <UAvatar src="/logo.png" alt="AG" size="sm" />
        <NuxtLink to="/">
          <span class="font-bold text-lg">AeroGuardian</span>
        </NuxtLink>
      </div>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>
  </UHeader>
</template> -->
<template>
  <header
    class="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md z-50"
  >
    <div class="flex items-center gap-3">
      <span class="font-bold tracking-tight text-white">AeroGuardian</span>
    </div>

    <div class="flex items-center gap-1">
      <UButton to="/" variant="ghost" color="neutral" label="Dashboard" />
      <UButton to="/history" variant="ghost" color="neutral" label="History" />
      <UButton
        to="/settings"
        variant="ghost"
        color="neutral"
        label="Settings"
      />
    </div>
    <div class="flex items-center gap-4">
      <UColorModeButton />
    </div>
  </header>
</template>
