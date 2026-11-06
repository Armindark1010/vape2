<script setup lang="ts">
import { inject } from 'vue';

interface Props {
  collapsible?: boolean;
  resizable?: boolean;
}

withDefaults(defineProps<Props>(), {
  collapsible: true,
  resizable: false,
});

const group = inject<{
  sidebarCollapsed: { value: boolean };
  mobileSidebarOpen: { value: boolean };
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}>('dashboardGroup');

const isCollapsed = computed(() => group?.sidebarCollapsed.value ?? false);
const isMobileOpen = computed(() => group?.mobileSidebarOpen.value ?? false);

const closeMobile = () => {
  group?.closeMobileSidebar();
};
</script>

<template>
  <div>
    <!-- ─────────────── Desktop Persistent Sidebar ─────────────── -->
    <aside
      class="hidden lg:flex flex-col border-l border-zinc-800 bg-[#121214] sticky top-0 h-screen z-30 transition-all duration-200 select-none shrink-0"
      :class="isCollapsed ? 'w-20' : 'w-72'"
    >
      <!-- Sidebar Header Slot -->
      <div class="h-16 border-b border-zinc-800 flex items-center px-4 shrink-0">
        <slot name="header" :collapsed="isCollapsed" />
      </div>

      <!-- Sidebar Navigation Slot -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
        <slot :collapsed="isCollapsed" />
      </div>

      <!-- Sidebar Footer Slot -->
      <div class="border-t border-zinc-800 p-3 shrink-0 bg-[#0c0c0e]/80">
        <slot name="footer" :collapsed="isCollapsed" />
      </div>
    </aside>

    <!-- ─────────────── Mobile Drawer Sidebar ─────────────── -->
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden transition-opacity"
      @click="closeMobile"
    >
      <div
        class="fixed right-0 top-0 bottom-0 w-76 bg-[#121214] border-l border-zinc-800 flex flex-col z-50 shadow-2xl animate-in slide-in-from-right duration-200"
        @click.stop
      >
        <!-- Mobile Header with Close Button -->
        <div class="h-16 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
          <div class="flex-1 min-w-0">
            <slot name="header" :collapsed="false" />
          </div>
          <button
            @click="closeMobile"
            class="w-8 h-8 rounded-xl bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0 mr-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-1">
          <slot :collapsed="false" />
        </div>

        <!-- Mobile Footer -->
        <div class="border-t border-zinc-800 p-4 shrink-0 bg-[#0c0c0e]/90">
          <slot name="footer" :collapsed="false" />
        </div>
      </div>
    </div>
  </div>
</template>

