<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import {
  ChevronLeftIcon,
  SearchIcon,
  CheckIcon,
} from "~/components/vapor/VIcons";

const route = useRoute();
const sidebarOpen = ref(false);
const mobileNavOpen = ref(false);

const navItems = [
  { label: "داشبورد آمار", path: "/admin-panel", icon: "📊", badge: "" },
  { label: "مدیریت محصولات", path: "/admin-panel/products", icon: "📦", badge: "" },
  { label: "مدیریت سفارشات", path: "/admin-panel/orders", icon: "🛍️", badge: "جدید" },
  { label: "مدیریت بنرها", path: "/admin-panel/banners", icon: "🖼️", badge: "ویژه" },
];

const closeMobile = () => {
  mobileNavOpen.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-[#09090b] text-[#f8fafc] font-sans selection:bg-vio selection:text-white antialiased" dir="rtl">
    <!-- لایه پس‌زمینه محو -->
    <div class="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(167,139,250,0.06),transparent_60%)]" />

    <div class="relative z-10 flex min-h-screen">
      <!-- ─────────────── سایدبار دسکتاپ ─────────────── -->
      <aside
        class="hidden lg:flex w-68 shrink-0 flex-col border-l border-white/8 bg-[#101218]/90 backdrop-blur-xl sticky top-0 h-screen z-30"
      >
        <!-- برند و لوگو -->
        <div class="h-18 flex items-center justify-between px-6 border-b border-white/8">
          <div class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-vio/30 to-ice/20 border border-vio/40 text-[20px] shadow-lg shadow-vio/20">
              💨
            </span>
            <div>
              <h2 class="font-display text-[15px] font-black text-snow tracking-tight">ویپ‌لب ادمین</h2>
              <span class="text-[11px] text-mist font-medium">نسخه Nuxt 4 Ultra</span>
            </div>
          </div>
        </div>

        <!-- منوی ناوبری -->
        <nav class="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="group flex items-center justify-between rounded-2xl px-4 py-3 text-[13.5px] font-bold transition-all duration-200"
            :class="[
              route.path === item.path
                ? 'bg-gradient-to-l from-vio/20 to-ice/10 text-snow border border-vio/35 shadow-lg shadow-vio/10'
                : 'text-mist hover:bg-white/4 hover:text-snow border border-transparent'
            ]"
          >
            <div class="flex items-center gap-3">
              <span class="text-[18px] transition-transform group-hover:scale-110">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </div>
            <span
              v-if="item.badge"
              class="rounded-full bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 text-[10px] font-black text-rose-300"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>
        </nav>

        <!-- فوتر سایدبار و لینک به فروشگاه -->
        <div class="p-4 border-t border-white/8 bg-black/20">
          <NuxtLink
            to="/"
            target="_blank"
            class="flex items-center justify-between rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-[12px] font-bold text-mist hover:text-snow hover:border-vio/40 hover:bg-white/8 transition"
          >
            <span class="flex items-center gap-2">
              <span>🏪</span>
              <span>مشاهده فروشگاه</span>
            </span>
            <span class="text-[11px] text-vio font-mono">↗</span>
          </NuxtLink>
        </div>
      </aside>

      <!-- ─────────────── سایدبار دراور موبایل ─────────────── -->
      <div
        v-if="mobileNavOpen"
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden transition-opacity"
        @click="closeMobile"
      >
        <div
          class="fixed right-0 top-0 bottom-0 w-72 bg-[#12141c] border-l border-white/10 p-5 flex flex-col z-50 shadow-2xl"
          @click.stop
        >
          <div class="flex items-center justify-between pb-4 border-b border-white/10">
            <div class="flex items-center gap-2.5">
              <span class="text-[22px]">💨</span>
              <h3 class="text-[15px] font-black text-snow">ویپ‌لب ادمین</h3>
            </div>
            <button class="h-8 w-8 rounded-lg bg-white/5 border border-white/10 text-mist hover:text-white grid place-items-center" @click="closeMobile">
              ✕
            </button>
          </div>

          <nav class="flex-1 py-4 space-y-1.5 overflow-y-auto">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center justify-between rounded-xl px-4 py-3 text-[13.5px] font-bold"
              :class="[
                route.path === item.path
                  ? 'bg-vio/20 text-snow border border-vio/40'
                  : 'text-mist hover:bg-white/5'
              ]"
              @click="closeMobile"
            >
              <div class="flex items-center gap-3">
                <span>{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </div>
              <span v-if="item.badge" class="text-[10px] text-rose-300">{{ item.badge }}</span>
            </NuxtLink>
          </nav>

          <NuxtLink
            to="/"
            target="_blank"
            class="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-[12px] font-bold text-mist hover:text-white"
          >
            🏪 مشاهده فروشگاه اصلی
          </NuxtLink>
        </div>
      </div>

      <!-- ─────────────── محتوای اصلی و هدر ─────────────── -->
      <div class="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <!-- هدر بالای صفحه -->
        <header class="h-18 sticky top-0 z-20 border-b border-white/8 bg-[#09090b]/85 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button
              class="lg:hidden h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-snow grid place-items-center cursor-pointer"
              @click="mobileNavOpen = true"
            >
              ☰
            </button>
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span class="text-[12.5px] font-bold text-mist hidden sm:inline">اتصال دیتابیس PostgreSQL:</span>
              <span class="text-[12px] font-mono font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                آنلاین (Live)
              </span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <NuxtLink
              to="/"
              class="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-white/12 bg-white/4 hover:bg-white/8 text-[12px] font-bold text-snow transition"
            >
              <span>🛒 فروشگاه</span>
            </NuxtLink>

            <a
              href="http://localhost:4200"
              target="_blank"
              class="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl border border-vio/30 bg-vio/10 hover:bg-vio/20 text-[11.5px] font-extrabold text-vio transition"
              title="مشاهده پنل انگولار در پورت ۴۲۰۰"
            >
              <span>🅰️ پنل انگولار (4200)</span>
            </a>

            <div class="flex items-center gap-2 pl-2 border-r border-white/10">
              <span class="h-8 w-8 rounded-full bg-gradient-to-tr from-vio to-ice text-ink font-black text-[12px] grid place-items-center">
                👑
              </span>
              <span class="text-[12.5px] font-bold text-snow hidden md:inline">مدیر ارشد سیستم</span>
            </div>
          </div>
        </header>

        <!-- محتوای صفحات -->
        <main class="flex-1 p-4 sm:p-8">
          <slot />
        </main>
      </div>
    </div>

    <!-- ─────────────── نوبار لمسی پایین موبایل ─────────────── -->
    <nav class="lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[#10121a]/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0px)]">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-[11px] font-bold transition-all"
        :class="[
          route.path === item.path ? 'text-vio' : 'text-mist hover:text-snow'
        ]"
      >
        <span class="text-[18px]">{{ item.icon }}</span>
        <span>{{ item.label.replace('مدیریت ', '') }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>
