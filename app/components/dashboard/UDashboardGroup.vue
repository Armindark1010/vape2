<script setup lang="ts">
import { ref, provide, readonly } from 'vue';

const sidebarCollapsed = ref(false);
const mobileSidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value;
};

const closeMobileSidebar = () => {
  mobileSidebarOpen.value = false;
};

provide('dashboardGroup', {
  sidebarCollapsed: readonly(sidebarCollapsed),
  mobileSidebarOpen: readonly(mobileSidebarOpen),
  toggleSidebar,
  toggleMobileSidebar,
  closeMobileSidebar,
});
</script>

<template>
  <div class="min-h-screen bg-[#0c0c0e] text-zinc-100 flex flex-col font-sans antialiased selection:bg-[#00DC82]/30 selection:text-white" dir="rtl">
    <div class="flex-1 flex overflow-hidden min-h-screen relative">
      <slot />
    </div>
  </div>
</template>

