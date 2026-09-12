<script setup lang="ts">
import type { NuxtError } from "#app";
import { ArrowLeftIcon, RefreshIcon } from "~/components/vapor/VIcons";

const props = defineProps<{
  error: NuxtError;
}>();

const is404 = computed(() => props.error.statusCode === 404);

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtLayout>
    <!-- 404 Not Found Page -->
    <div v-if="is404" class="wrap flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
      <p class="text-6xl">🌫️</p>
      <h1 class="mt-6 font-display text-[28px] font-extrabold text-snow">این صفحه در دود گم شد!</h1>
      <p class="mt-3 max-w-sm text-[13px] leading-7 text-dim">
        صفحه‌ای که دنبالش بودی وجود نداره یا جابه‌جا شده. بذار برگردونیمت به جای خوش‌بو. ☁️
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <button
          class="pressable inline-flex h-13 items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-7 py-4 text-[14px] font-extrabold text-ink glow-v cursor-pointer"
          @click="handleError"
        >
          <ArrowLeftIcon :size="17" :sw="2.4" /> صفحه اصلی
        </button>
        <NuxtLink
          to="/shop"
          class="pressable inline-flex h-13 items-center rounded-2xl border border-white/14 px-7 py-4 text-[14px] font-extrabold text-snow"
        >
          فروشگاه
        </NuxtLink>
      </div>
    </div>

    <!-- Generic Error Page -->
    <div v-else class="wrap flex min-h-[60vh] flex-col items-center justify-center py-32 text-center">
      <p class="text-[11px] font-semibold tracking-[0.34em] text-vio uppercase">خطایی رخ داد</p>
      <h1 class="mt-5 font-display text-4xl text-snow md:text-5xl">
        مشکلی در بارگذاری <span class="text-grad">پیش آمد</span>
      </h1>
      <p class="mt-5 max-w-sm text-sm leading-relaxed text-mist">
        {{ error.message || "یک خطای غیرمنتظره رخ داد." }}
      </p>
      <div class="mt-10 flex gap-4">
        <button
          class="pressable flex items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-7 py-3.5 text-sm font-extrabold text-ink glow-v cursor-pointer"
          @click="handleError"
        >
          <RefreshIcon :size="15" /> تلاش مجدد
        </button>
        <NuxtLink
          to="/"
          class="pressable rounded-2xl border border-white/14 px-7 py-3.5 text-sm font-extrabold text-snow"
        >
          صفحه اصلی
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
