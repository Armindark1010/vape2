<template>
  <main class="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#0c0c0e] relative">
    <!-- Panel Header Slot -->
    <header v-if="$slots.header" class="sticky top-0 z-20 border-b border-zinc-800 bg-[#0c0c0e]/90 backdrop-blur-xl shrink-0">
      <slot name="header" />
    </header>

    <!-- Panel Body Slot -->
    <div class="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
      <slot />
      <slot name="body" />
    </div>

    <!-- Panel Footer Slot -->
    <footer v-if="$slots.footer" class="border-t border-zinc-800 bg-[#121214] p-4 shrink-0">
      <slot name="footer" />
    </footer>
  </main>
</template>

