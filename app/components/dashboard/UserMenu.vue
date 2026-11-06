<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useRouter } from 'vue-router';

interface Props {
  collapsed?: boolean;
}

defineProps<Props>();

const { user, token } = useAuth();
const router = useRouter();
const open = ref(false);

const handleLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vapelab.auth.user');
    localStorage.removeItem('vapelab.auth.token');
    localStorage.removeItem('vapora.auth.user');
    localStorage.removeItem('vapora.auth.token');
  }
  user.value = null;
  token.value = null;
  open.value = false;
  router.push('/');
};
</script>

<template>
  <div class="relative w-full">
    <button
      type="button"
      @click="open = !open"
      class="w-full flex items-center justify-between gap-3 p-2 rounded-xl border border-transparent hover:border-zinc-800 hover:bg-zinc-850/60 transition-all text-right group cursor-pointer"
      :class="{ 'justify-center p-2': collapsed }"
      :title="collapsed ? (user?.name || user?.username || 'پروفایل مدیر') : undefined"
    >
      <div class="flex items-center gap-3 min-w-0">
        <!-- Avatar with status indicator -->
        <div class="relative shrink-0">
          <div class="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-black text-white">
            {{ ((user?.name || user?.username || 'A')[0] || 'A').toUpperCase() }}
          </div>
          <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00DC82] border-2 border-[#121214]"></span>
        </div>

        <div v-if="!collapsed" class="min-w-0 text-right">
          <div class="text-[13px] font-bold text-white truncate transition">
            {{ user?.name || user?.username || 'مدیر سیستم' }}
          </div>
          <div class="text-[11px] text-zinc-400 truncate">
            {{ user?.email || (user?.role === 'SUPPLIER' ? 'تأمین‌کننده' : 'مدیر کل ویپ‌لب') }}
          </div>
        </div>
      </div>

      <div v-if="!collapsed" class="text-zinc-500 group-hover:text-zinc-300 transition-transform" :class="{ 'rotate-180': open }">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="open"
      class="absolute right-0 bottom-full mb-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
    >
      <div class="px-3 py-2 border-b border-zinc-800 mb-1">
        <div class="text-xs font-bold text-white truncate">
          {{ user?.name || user?.username || 'کاربر سیستم' }}
        </div>
        <div class="text-[10.5px] text-zinc-400 truncate font-mono">
          {{ user?.email || 'user@vapelab.ir' }}
        </div>
        <div class="mt-1.5 flex items-center gap-1.5">
          <span class="text-[9.5px] px-1.5 py-0.2 bg-[#00DC82]/10 text-[#00DC82] border border-[#00DC82]/25 rounded font-mono font-medium">
            {{ user?.role === 'ADMIN' ? 'مدیر کل (Full Admin)' : (user?.role === 'SUPPLIER' ? 'تأمین‌کننده رسمی' : 'مشتری') }}
          </span>
        </div>
      </div>

      <div class="space-y-0.5">
        <NuxtLink
          to="/"
          target="_blank"
          @click="open = false"
          class="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <span class="flex items-center gap-2">
            <DashboardIcon name="overview" :size="15" class="text-[#00DC82]" />
            <span>مشاهده فروشگاه اصلی</span>
          </span>
          <span class="text-[10px] text-zinc-500 font-mono">↗</span>
        </NuxtLink>

        <NuxtLink
          to="/account"
          @click="open = false"
          class="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <DashboardIcon name="customers" :size="15" class="text-zinc-400" />
          <span>پروفایل کاربری</span>
        </NuxtLink>

        <button
          type="button"
          @click="handleLogout"
          class="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-right cursor-pointer"
        >
          <svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>خروج از حساب</span>
        </button>
      </div>
    </div>
  </div>
</template>
