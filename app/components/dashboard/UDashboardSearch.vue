<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
  collapsed?: boolean;
}

defineProps<Props>();

const router = useRouter();
const isOpen = ref(false);
const searchQuery = ref('');

const searchItems = [
  { group: 'صفحات ادمین', label: 'داشبورد اصلی', icon: 'overview', to: '/admin-panel', shortcut: 'G D' },
  { group: 'صفحات ادمین', label: 'مدیریت محصولات', icon: 'products', to: '/admin-panel/products', shortcut: 'G P' },
  { group: 'صفحات ادمین', label: 'مدیریت سفارشات', icon: 'orders', to: '/admin-panel/orders', shortcut: 'G O' },
  { group: 'صفحات ادمین', label: 'لیست تأمین‌کنندگان', icon: 'suppliers', to: '/admin-panel/suppliers', shortcut: 'G S' },
  { group: 'صفحات ادمین', label: 'ایجاد تأمین‌کننده جدید', icon: 'plus', to: '/admin-panel/suppliers/create' },
  { group: 'صفحات ادمین', label: 'تسویه‌حساب‌ها و مالی', icon: 'finance', to: '/admin-panel/finance' },
  { group: 'صفحات ادمین', label: 'مدیریت بنرها', icon: 'banners', to: '/admin-panel/banners' },
  { group: 'صفحات ادمین', label: 'تنظیمات کمیسیون و سیستم', icon: 'settings', to: '/admin-panel/settings' },
  { group: 'پرتال تأمین‌کننده', label: 'داشبورد تأمین‌کننده', icon: 'suppliers', to: '/supplier' },
  { group: 'پرتال تأمین‌کننده', label: 'کالاهای تخصیص‌یافته', icon: 'products', to: '/supplier/products' },
  { group: 'پرتال تأمین‌کننده', label: 'سفارشات من', icon: 'orders', to: '/supplier/orders' },
  { group: 'پرتال تأمین‌کننده', label: 'تسویه‌های من', icon: 'finance', to: '/supplier/finance' },
];

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return searchItems;
  const q = searchQuery.value.toLowerCase().trim();
  return searchItems.filter(item => item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q));
});

const selectItem = (item: typeof searchItems[0]) => {
  isOpen.value = false;
  searchQuery.value = '';
  router.push(item.to);
};

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    isOpen.value = !isOpen.value;
  }
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div>
    <!-- Button Trigger (Nuxt UI Pro style) -->
    <button
      type="button"
      @click="isOpen = true"
      class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-400 hover:text-white transition-all group"
      :class="{ 'justify-center px-2': collapsed }"
      :title="collapsed ? 'جستجو (Ctrl+K)' : undefined"
    >
      <div class="flex items-center gap-2.5">
        <svg class="w-4 h-4 text-zinc-400 group-hover:text-[#00DC82] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span v-if="!collapsed" class="text-xs font-normal">جستجو در سیستم...</span>
      </div>

      <div v-if="!collapsed" class="flex items-center gap-1 font-mono text-[10px] text-zinc-500 bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded">
        <span>CTRL</span>
        <span>K</span>
      </div>
    </button>

    <!-- Command Palette Dialog -->
    <ClientOnly>
      <Teleport to="body">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[10000] flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
          dir="rtl"
          @click.self="isOpen = false"
        >
          <div class="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <!-- Search Input -->
            <div class="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800 bg-zinc-950/60">
              <svg class="w-5 h-5 text-[#00DC82] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="نام بخش، صفحه یا عملیات مورد نظر را تایپ کنید..."
                class="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                autofocus
              />
              <button
                @click="isOpen = false"
                class="text-[11px] font-mono text-zinc-400 hover:text-white px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 cursor-pointer"
              >
                ESC
              </button>
            </div>

            <!-- Search Results List -->
            <div class="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-800/40">
              <div v-if="filteredItems.length === 0" class="py-8 text-center text-xs text-zinc-500">
                موردی مطابق با جستجوی شما پیدا نشد.
              </div>

              <div
                v-for="item in filteredItems"
                :key="item.to"
                @click="selectItem(item)"
                class="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer hover:bg-zinc-800/80 hover:text-white transition-all group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-[#00DC82] group-hover:scale-105 transition-transform">
                    <DashboardIcon :name="item.icon" :size="15" />
                  </div>
                  <div>
                    <div class="text-[13px] font-medium text-zinc-200 group-hover:text-white">
                      {{ item.label }}
                    </div>
                    <div class="text-[10px] text-zinc-500">
                      {{ item.group }}
                    </div>
                  </div>
                </div>

                <span class="text-xs text-[#00DC82] opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  انتخاب ↵
                </span>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-4 py-2 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-[11px] text-zinc-500">
              <span>راهنما: با کلیدهای جهت‌نما یا ماوس پیمایش کنید</span>
              <span class="text-[#00DC82] font-mono font-medium">ویپ‌لب داشبورد</span>
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>

