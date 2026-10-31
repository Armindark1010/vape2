<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Banner } from "~/types";
import { ArrowLeftIcon, ChevronLeftIcon, CheckIcon } from "~/components/vapor/VIcons";
import { haptic } from "~/utils/vape";

const props = withDefaults(
  defineProps<{
    banners?: Banner[];
    autoPlayInterval?: number;
  }>(),
  {
    banners: () => [],
    autoPlayInterval: 6000,
  }
);

const activeIndex = ref(0);
const isHovered = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);
let timer: any = null;
const progress = ref(0);
let progressTimer: any = null;

const bannerList = computed(() => {
  if (props.banners && props.banners.length > 0) {
    return props.banners;
  }
  return [];
});

const currentBanner = computed(() => {
  if (bannerList.value.length === 0) return null;
  return bannerList.value[activeIndex.value] || bannerList.value[0];
});

const nextSlide = () => {
  if (bannerList.value.length <= 1) return;
  haptic(10);
  activeIndex.value = (activeIndex.value + 1) % bannerList.value.length;
  resetProgress();
};

const prevSlide = () => {
  if (bannerList.value.length <= 1) return;
  haptic(10);
  activeIndex.value =
    (activeIndex.value - 1 + bannerList.value.length) % bannerList.value.length;
  resetProgress();
};

const goToSlide = (idx: number) => {
  if (activeIndex.value === idx) return;
  haptic(10);
  activeIndex.value = idx;
  resetProgress();
};

const resetProgress = () => {
  progress.value = 0;
};

const startAutoPlay = () => {
  stopAutoPlay();
  if (bannerList.value.length <= 1) return;

  const intervalStep = 50;
  const increment = (intervalStep / props.autoPlayInterval) * 100;

  progressTimer = setInterval(() => {
    if (!isHovered.value) {
      progress.value += increment;
      if (progress.value >= 100) {
        progress.value = 0;
        nextSlide();
      }
    }
  }, intervalStep);
};

const stopAutoPlay = () => {
  if (progressTimer) clearInterval(progressTimer);
  if (timer) clearInterval(timer);
};

const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].clientX;
};

const onTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].clientX;
  handleSwipe();
};

const handleSwipe = () => {
  const diff = touchStartX.value - touchEndX.value;
  // RTL aware: swipe left means next, swipe right means prev
  if (Math.abs(diff) > 45) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<template>
  <section
    v-if="bannerList.length > 0 && currentBanner"
    class="relative w-full overflow-hidden rounded-[28px] sm:rounded-[36px] border border-white/12 bg-[#0c0f17] shadow-2xl transition-all"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- نوار پیشرفت اسلاید فعال -->
    <div
      v-if="bannerList.length > 1"
      class="absolute top-0 inset-x-0 z-30 h-1 bg-white/10 overflow-hidden"
    >
      <div
        class="h-full bg-gradient-to-r from-vio via-neon to-ice transition-all duration-75 ease-linear"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <!-- کانتینر اصلی اسلایدها -->
    <div class="relative min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center">
      <!-- تصویر پس‌زمینه با افکت ترنزیشن نرم -->
      <transition-group name="fade-slide" tag="div" class="absolute inset-0 z-0">
        <div
          v-for="(b, idx) in bannerList"
          v-show="idx === activeIndex"
          :key="b.id"
          class="absolute inset-0 w-full h-full"
        >
          <img
            :src="b.image"
            :alt="b.title"
            class="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          />
          <!-- لایه‌های گرادینت تاریک و محو کننده برای بیشترین خوانایی متن در موبایل و دسکتاپ -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/80 to-transparent sm:bg-gradient-to-r sm:from-[#090b10] sm:via-[#090b10]/85 sm:to-transparent" />
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(167,139,250,0.15),transparent_60%)]" />
        </div>
      </transition-group>

      <!-- محتوای متنی و دکمه اکشن بنر -->
      <div class="wrap relative z-10 w-full py-10 sm:py-14 grid lg:grid-cols-[1.2fr_0.8fr] items-center gap-8">
        <div class="max-w-xl">
          <!-- نشان / بج بنر -->
          <div
            v-if="currentBanner.badge"
            class="inline-flex items-center gap-2 rounded-full border border-vio/40 bg-vio/15 px-3.5 py-1.5 text-[12px] font-extrabold text-vio shadow-lg shadow-vio/10 backdrop-blur-md animate-fade-in"
          >
            <span class="h-2 w-2 rounded-full bg-vio animate-ping" />
            <span>{{ currentBanner.badge }}</span>
          </div>

          <!-- عنوان اصلی بنر -->
          <h2
            class="mt-4 font-display text-[30px] leading-[1.25] font-black text-snow sm:text-4xl lg:text-[46px] lg:leading-[1.2] drop-shadow-md"
          >
            {{ currentBanner.title }}
          </h2>

          <!-- زیرعنوان / توضیحات -->
          <p
            v-if="currentBanner.subtitle"
            class="mt-3.5 text-[13.5px] sm:text-[15px] leading-7 sm:leading-8 text-mist/95 max-w-lg font-medium"
          >
            {{ currentBanner.subtitle }}
          </p>

          <!-- دکمه‌های اقدام (CTA) -->
          <div class="mt-8 flex flex-wrap items-center gap-3.5">
            <NuxtLink
              :to="currentBanner.link"
              class="pressable inline-flex h-13 sm:h-14 items-center gap-2.5 rounded-2xl bg-gradient-to-l from-vio to-ice px-7 sm:px-9 text-[14px] sm:text-[15px] font-black text-ink glow-v shadow-xl hover:opacity-95 transition"
            >
              <span>{{ currentBanner.buttonText || 'مشاهده و خرید' }}</span>
              <ArrowLeftIcon :size="18" :sw="2.5" />
            </NuxtLink>

            <NuxtLink
              to="/categories"
              class="pressable inline-flex h-13 sm:h-14 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 px-6 text-[13.5px] font-bold text-snow backdrop-blur transition"
            >
              <span>تمام دسته‌ها</span>
            </NuxtLink>
          </div>
        </div>

        <!-- کنترل‌های سمت چپ در دسکتاپ یا پیش‌نمایش کوچک -->
        <div class="hidden lg:flex flex-col items-end justify-between self-stretch py-4">
          <!-- شماره اسلاید -->
          <div
            v-if="bannerList.length > 1"
            class="rounded-full border border-white/15 bg-black/40 backdrop-blur-md px-4 py-1.5 text-[12px] font-mono font-bold text-snow"
            dir="ltr"
          >
            <span class="text-vio font-black">0{{ activeIndex + 1 }}</span>
            <span class="text-dim mx-1">/</span>
            <span class="text-mist">0{{ bannerList.length }}</span>
          </div>

          <!-- فلش‌های ناوبری دستی -->
          <div v-if="bannerList.length > 1" class="flex items-center gap-2.5 mt-auto">
            <button
              type="button"
              class="pressable h-11 w-11 rounded-2xl border border-white/15 bg-black/40 hover:bg-white/10 text-snow grid place-items-center backdrop-blur-md transition cursor-pointer"
              title="بنر بعدی"
              @click="nextSlide"
            >
              <ChevronLeftIcon :size="20" />
            </button>
            <button
              type="button"
              class="pressable h-11 w-11 rounded-2xl border border-white/15 bg-black/40 hover:bg-white/10 text-snow grid place-items-center backdrop-blur-md transition rotate-180 cursor-pointer"
              title="بنر قبلی"
              @click="prevSlide"
            >
              <ChevronLeftIcon :size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- اندیکاتور نقطه‌ای پایین برای موبایل و تبلت -->
    <div
      v-if="bannerList.length > 1"
      class="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2"
    >
      <button
        v-for="(b, idx) in bannerList"
        :key="b.id"
        type="button"
        class="h-2 rounded-full transition-all duration-300 cursor-pointer"
        :class="[
          idx === activeIndex
            ? 'w-7 bg-gradient-to-r from-vio to-ice shadow-md shadow-vio/40'
            : 'w-2 bg-white/25 hover:bg-white/50'
        ]"
        :aria-label="`اسلاید شماره ${idx + 1}`"
        @click="goToSlide(idx)"
      />
    </div>
  </section>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: scale(1.04);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
