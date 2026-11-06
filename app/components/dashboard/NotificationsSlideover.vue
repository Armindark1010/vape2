<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboard, type DashboardNotification } from '~/composables/useDashboard';

const router = useRouter();
const {
  isNotificationsSlideoverOpen,
  notifications,
  unreadCount,
  closeNotifications,
  markAllRead,
  markAsRead,
} = useDashboard();

const activeTab = ref<'all' | 'unread'>('all');

const filteredNotifications = computed(() => {
  if (activeTab.value === 'unread') {
    return notifications.value.filter(n => n.unread);
  }
  return notifications.value;
});

const handleItemClick = (item: DashboardNotification) => {
  markAsRead(item.id);
  if (item.link) {
    closeNotifications();
    router.push(item.link);
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isNotificationsSlideoverOpen.value) {
    closeNotifications();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const getCategoryStyles = (cat: string) => {
  switch (cat) {
    case 'order':
      return {
        badge: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30',
        iconBg: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/25',
        label: 'سفارش و فروش',
      };
    case 'settlement':
      return {
        badge: 'bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30',
        iconBg: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/25',
        label: 'امور مالی و تسویه',
      };
    case 'inventory':
      return {
        badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
        label: 'موجودی انبار',
      };
    case 'system':
    default:
      return {
        badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
        iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
        label: 'امنیت و سیستم',
      };
  }
};
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <!-- Root Modal Wrap with High Z-Index -->
      <div
        v-if="isNotificationsSlideoverOpen"
        class="fixed inset-0 z-[99999] overflow-hidden"
        dir="rtl"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop -->
        <Transition
          enter-active-class="transition-opacity duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          appear
        >
          <div
            class="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            @click="closeNotifications"
          />
        </Transition>

        <!-- Slideover Drawer Panel (Sliding out from Left in RTL layout) -->
        <div class="fixed inset-y-0 left-0 max-w-full flex pointer-events-none">
          <Transition
            enter-active-class="transform transition ease-out duration-300"
            enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transform transition ease-in duration-200"
            leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full"
            appear
          >
            <div
              class="pointer-events-auto w-screen max-w-md bg-[#0D0D16] border-r border-[#29293B] shadow-2xl flex flex-col h-full text-[#F4F4F8]"
            >
              <!-- Drawer Header -->
              <div class="h-18 px-5 border-b border-[#29293B] flex items-center justify-between shrink-0 bg-[#09090F]/90 backdrop-blur-md">
                <div class="flex items-center gap-3">
                  <div class="relative w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] shadow-sm shadow-[#8B5CF6]/10">
                    <DashboardIcon name="notifications" :size="20" />
                    <span
                      v-if="unreadCount > 0"
                      class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#8B5CF6] ring-2 ring-[#0D0D16] animate-pulse"
                    />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="text-sm font-bold text-[#F4F4F8]">مرکز اعلان‌ها و رویدادها</h3>
                      <span
                        v-if="unreadCount > 0"
                        class="text-[10px] px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/35 font-bold font-mono"
                      >
                        {{ unreadCount }} جدید
                      </span>
                    </div>
                    <p class="text-[11px] text-[#9696AD]">هشدارهای بلادرنگ سیستم و رویدادهای بازار</p>
                  </div>
                </div>

                <!-- Header Actions -->
                <div class="flex items-center gap-2">
                  <button
                    v-if="unreadCount > 0"
                    type="button"
                    @click="markAllRead"
                    class="text-[11.5px] text-[#8B5CF6] hover:text-[#A78BFA] hover:underline font-medium transition px-2 py-1 rounded-lg cursor-pointer"
                    title="علامت‌گذاری تمامی اعلان‌ها به عنوان خوانده‌شده"
                  >
                    خواندن همه
                  </button>
                  <button
                    type="button"
                    @click="closeNotifications"
                    class="w-8 h-8 rounded-xl bg-[#13131F] border border-[#29293B] flex items-center justify-center text-[#9696AD] hover:text-[#F4F4F8] hover:bg-[#1A1A29] hover:border-[#8B5CF6]/40 transition cursor-pointer"
                    title="بستن (ESC)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Filter Tabs (Nuxt Dashboard Segmented Control) -->
              <div class="px-5 py-2.5 border-b border-[#29293B] bg-[#09090F]/50 flex items-center justify-between gap-2 shrink-0">
                <div class="flex items-center gap-1.5 p-1 bg-[#13131F] rounded-xl border border-[#29293B]">
                  <button
                    type="button"
                    @click="activeTab = 'all'"
                    class="px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer"
                    :class="activeTab === 'all' ? 'bg-[#8B5CF6] text-white font-bold shadow-sm shadow-[#8B5CF6]/20' : 'text-[#9696AD] hover:text-[#F4F4F8]'"
                  >
                    همه ({{ notifications.length }})
                  </button>
                  <button
                    type="button"
                    @click="activeTab = 'unread'"
                    class="px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                    :class="activeTab === 'unread' ? 'bg-[#8B5CF6] text-white font-bold shadow-sm shadow-[#8B5CF6]/20' : 'text-[#9696AD] hover:text-[#F4F4F8]'"
                  >
                    <span>خوانده‌نشده</span>
                    <span
                      class="text-[10px] px-1.5 py-0.2 rounded-full font-mono"
                      :class="activeTab === 'unread' ? 'bg-white/20 text-white font-bold' : 'bg-[#8B5CF6]/20 text-[#8B5CF6]'"
                    >
                      {{ unreadCount }}
                    </span>
                  </button>
                </div>

                <div class="flex items-center gap-1.5 text-[11px] text-[#9696AD] font-mono">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Real-time</span>
                </div>
              </div>

              <!-- Body / Notifications List -->
              <div class="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
                <!-- Empty State -->
                <div
                  v-if="filteredNotifications.length === 0"
                  class="h-full flex flex-col items-center justify-center text-center p-8 text-[#9696AD]"
                >
                  <div class="w-14 h-14 rounded-2xl bg-[#13131F] border border-[#29293B] flex items-center justify-center text-[#8B5CF6] mb-3 shadow-inner">
                    <DashboardIcon name="notifications" :size="24" />
                  </div>
                  <h4 class="text-sm font-bold text-[#F4F4F8] mb-1">
                    {{ activeTab === 'unread' ? 'هیچ اعلان خوانده‌نشده‌ای وجود ندارد' : 'صندوق اعلان‌ها خالی است' }}
                  </h4>
                  <p class="text-xs text-[#9696AD] max-w-xs leading-5">
                    {{ activeTab === 'unread' ? 'تمامی هشدارهای ارسالی بررسی شده‌اند.' : 'هرگونه سفارش جدید، هشدار انبار یا تراکنش مالی در این قسمت نمایش داده خواهد شد.' }}
                  </p>
                </div>

                <!-- List of Notification Cards -->
                <div
                  v-for="item in filteredNotifications"
                  :key="item.id"
                  @click="handleItemClick(item)"
                  class="group relative p-3.5 rounded-xl border transition-all duration-150 cursor-pointer"
                  :class="item.unread
                    ? 'bg-[#13131F] border-[#8B5CF6]/40 hover:border-[#8B5CF6] shadow-sm shadow-[#8B5CF6]/5'
                    : 'bg-[#13131F]/50 border-[#29293B] hover:bg-[#1A1A29] hover:border-[#3E3E54] opacity-85'"
                >
                  <div class="flex items-start gap-3">
                    <!-- Icon Avatar -->
                    <div
                      class="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5"
                      :class="getCategoryStyles(item.category).iconBg"
                    >
                      <DashboardIcon :name="item.icon" :size="18" />
                    </div>

                    <!-- Text Content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-2 mb-1">
                        <div class="flex items-center gap-1.5 min-w-0">
                          <span
                            class="text-[10px] px-1.5 py-0.5 rounded-md border font-medium shrink-0"
                            :class="getCategoryStyles(item.category).badge"
                          >
                            {{ getCategoryStyles(item.category).label }}
                          </span>
                          <span class="text-xs font-bold text-[#F4F4F8] truncate">
                            {{ item.title }}
                          </span>
                        </div>

                        <!-- Unread pulse dot -->
                        <span
                          v-if="item.unread"
                          class="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] ring-4 ring-[#8B5CF6]/20 shrink-0"
                        />
                      </div>

                      <p class="text-xs text-[#9696AD] leading-relaxed mb-2.5">
                        {{ item.description }}
                      </p>

                      <div class="flex items-center justify-between pt-1 border-t border-[#29293B]/60 text-[11px]">
                        <span class="text-[#9696AD]/80 font-mono">
                          {{ item.time }}
                        </span>

                        <span
                          v-if="item.link"
                          class="inline-flex items-center gap-1 text-[#8B5CF6] group-hover:underline font-medium transition"
                        >
                          <span>مشاهده جزئیات</span>
                          <span class="text-[9px]">←</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Drawer Footer -->
              <div class="p-4 border-t border-[#29293B] bg-[#09090F]/90 flex items-center justify-between text-xs text-[#9696AD] shrink-0">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>اتصال سیستم: برخط و بلادرنگ</span>
                </div>

                <NuxtLink
                  to="/admin-panel/settings#notifications"
                  @click="closeNotifications"
                  class="text-[11.5px] text-[#8B5CF6] hover:text-[#A78BFA] hover:underline transition"
                >
                  تنظیمات اعلان‌ها
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #29293B;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #3E3E54;
}
</style>