<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  collapsed?: boolean;
  title?: string;
  subtitle?: string;
  badge?: string;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  title: 'ویپ‌لب — مرکز مدیریت',
  subtitle: 'VAPELAB Marketplace',
  badge: 'Admin Pro',
  icon: 'nuxt',
});

const open = ref(false);

const teams = [
  { name: 'فروشگاه اصلی تهران', role: 'شعبه مرکزی و انبار اصلی', active: true },
  { name: 'مارکت‌پلیس تأمین‌کنندگان', role: 'شبکه پخش سراسری', active: false },
  { name: 'پرتال B2B همکاران', role: 'فروش سازمانی', active: false },
];
</script>

<template>
  <div class="relative w-full">
    <button
      type="button"
      @click="open = !open"
      class="w-full flex items-center justify-between gap-3 p-2 rounded-xl border border-transparent hover:border-zinc-800 hover:bg-zinc-850/60 transition-all text-right group cursor-pointer"
      :class="{ 'justify-center p-2': collapsed }"
      :title="collapsed ? title : undefined"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-9 h-9 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center text-[#00DC82] shrink-0">
          <DashboardIcon :name="icon" :size="20" />
        </div>
        <div v-if="!collapsed" class="min-w-0 text-right">
          <div class="flex items-center gap-2">
            <span class="text-[13.5px] font-bold text-white truncate group-hover:text-white transition">
              {{ title }}
            </span>
            <span v-if="badge" class="text-[10px] px-1.5 py-0.2 bg-[#00DC82]/10 text-[#00DC82] border border-[#00DC82]/25 rounded font-mono font-medium">
              {{ badge }}
            </span>
          </div>
          <span class="text-[11px] text-zinc-400 block truncate">
            {{ subtitle }}
          </span>
        </div>
      </div>

      <div v-if="!collapsed" class="text-zinc-500 group-hover:text-zinc-300 transition-transform" :class="{ 'rotate-180': open }">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

    <!-- Workspace Switcher Dropdown -->
    <div
      v-if="open && !collapsed"
      class="absolute right-0 top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
    >
      <div class="px-2.5 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
        ورک‌اسپیس‌ها و شعب
      </div>
      <div class="space-y-0.5">
        <button
          v-for="team in teams"
          :key="team.name"
          @click="open = false"
          class="w-full text-right px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer"
          :class="team.active ? 'bg-[#00DC82]/10 text-white font-bold border border-[#00DC82]/25' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'"
        >
          <div>
            <div class="font-medium">{{ team.name }}</div>
            <div class="text-[10.5px] text-zinc-500 font-normal">{{ team.role }}</div>
          </div>
          <span v-if="team.active" class="w-1.5 h-1.5 rounded-full bg-[#00DC82]"></span>
        </button>
      </div>
    </div>
  </div>
</template>

