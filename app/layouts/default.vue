<template>
  <div class="h-screen w-full flex flex-col bg-gray-950 text-slate-200">
    <Header />

    <main class="flex-1 flex overflow-hidden">
      <slot />
    </main>
  </div>
</template>
