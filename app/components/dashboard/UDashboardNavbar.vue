<script setup lang="ts">
import { inject } from 'vue';
import { useDashboard } from '~/composables/useDashboard';

interface Props {
  title?: string;
  badge?: string;
}

defineProps<Props>();

const group = inject<{
  sidebarCollapsed: { value: boolean };
  mobileSidebarOpen: { value: boolean };
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}>('dashboardGroup');

const { toggleNotifications, unreadCount } = useDashboard();

const handleToggle = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    group?.toggleMobileSidebar();
  } else {
    group?.toggleSidebar();
  }
};
</script>

<template>
  <div class="h-16 px-4 md:px-6 flex items-center justify-between gap-4">
    <!-- Leading Area: Toggle & Title / Breadcrumbs -->
    <div class="flex items-center gap-3 min-w-0">
      <button
        type="button"
        @click="handleToggle"
        class="w-9 h-9 rounded-xl bg-[#13131F] border border-[#29293B] hover:border-[#8B5CF6]/50 hover:bg-[#1A1A29] flex items-center justify-center text-[#9696AD] hover:text-[#F4F4F8] transition shrink-0"
        title="تغییر وضعیت سایدبار"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div class="flex items-center gap-2 min-w-0">
        <slot name="leading">
          <h1 v-if="title" class="text-base md:text-lg font-bold text-white truncate">
            {{ title }}
          </h1>
          <span
            v-if="badge"
            class="hidden sm:inline-flex text-[11px] px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 font-medium shrink-0 font-mono"
          >
            {{ badge }}
          </span>
        </slot>
      </div>
    </div>

    <!-- Trailing Area: Actions, Search, Notifications -->
    <div class="flex items-center gap-2 md:gap-3 shrink-0">
      <slot name="right" />

      <!-- Notification bell button -->
      <button
        type="button"
        @click="toggleNotifications"
        class="relative w-9 h-9 rounded-xl bg-[#13131F] border border-[#29293B] hover:border-[#8B5CF6]/50 hover:bg-[#1A1A29] flex items-center justify-center text-[#9696AD] hover:text-[#F4F4F8] transition group cursor-pointer"
        title="اعلان‌ها و هشدارها (N)"
      >
        <DashboardIcon name="notifications" :size="18" class="text-[#9696AD] group-hover:text-[#F4F4F8] transition-colors" />
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#8B5CF6] text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-[#0D0D16]"
        >
          {{ unreadCount }}
        </span>
      </button>
    </div>
  </div>
</template>
