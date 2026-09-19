<script setup lang="ts">
import { ref } from "vue";
import { SITE } from "~/utils/vape";
import VapeLogo from "~/components/vapor/VapeLogo.vue";
import { CheckIcon, TagIcon, ArrowLeftIcon } from "~/components/vapor/VIcons";

useSeoMeta({
  title: `کیت هویت بصری و لوگوهای رسمی | ${SITE.name} (${SITE.latin})`,
  description: "دانلود و مشاهده انواع مدل‌های لوگوی رسمی ویپ‌لب شامل لوگوی افقی، عمودی، آیکون نئونی و تایپوگرافی اختصاصی.",
});

const copied = ref<string | null>(null);

const copySvg = (name: string, url: string) => {
  navigator.clipboard?.writeText(window.location.origin + url);
  copied.value = name;
  setTimeout(() => {
    copied.value = null;
  }, 2000);
};

const logoModels = [
  {
    id: "horizontal",
    title: "مدل ۱: لوگوی ترکیبی افقی (Horizontal Brandmark)",
    desc: "مناسب برای هدر وب‌سایت، نوار ناوبری دسکتاپ و موبایل، سربرگ نامه‌ها و فاکتورها.",
    file: "/logo-horizontal.svg",
    bgClass: "bg-[#0c0c11]",
    badge: "پرکاربردترین",
  },
  {
    id: "vertical",
    title: "مدل ۲: لوگوی ترکیبی عمودی (Vertical Stack)",
    desc: "مناسب برای بسته‌بندی، کارت ویزیت، استوری‌ها و بنرهای عمودی شبکه‌های اجتماعی.",
    file: "/logo-vertical.svg",
    bgClass: "bg-[#0c0c11]",
    badge: "لوگوی رسمی",
  },
  {
    id: "icon",
    title: "مدل ۳: آیکون نئونی مجزا (App Icon & Favicon)",
    desc: "نشانگر مینیمال حروف VL با درخشش نئونی بنفش و سبز؛ مناسب برای آواتار، اپلیکیشن و فاوآیکون.",
    file: "/logo-icon.svg",
    bgClass: "bg-[#0c0c11]",
    badge: "نشان اختصاصی",
  },
  {
    id: "text",
    title: "مدل ۴: تایپوگرافی متنی (Wordmark)",
    desc: "تایپوگرافی اختصاصی VAPELAB با گرادیان دوگانه و نقطه سبز نعنایی در انتها.",
    file: "/logo-text.svg",
    bgClass: "bg-[#0c0c11]",
    badge: "تایپوگرافی",
  },
];

const brandColors = [
  { name: "یاسی درخشان (Lavender Neon)", hex: "#B19EFF", role: "رنگ اصلی لوگو (V) و هایلایت‌ها" },
  { name: "سبز نعنایی نئون (Mint Neon)", hex: "#2FE695", role: "رنگ ثانویه لوگو (L) و نماد تازگی" },
  { name: "مشکی زغالی عمیق (Obsidian Dark)", hex: "#0A0A0C", role: "پس‌زمینه اصلی و حس لوکس" },
  { name: "خاکستری تیره بدنه (Surface Dark)", hex: "#1E1E24", role: "بستر نشانگرها و کادر آیکون" },
];
</script>

<template>
  <div class="wrap min-h-screen py-10 lg:py-16">
    <!-- Breadcrumb & Back -->
    <div class="mb-6 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="pressable inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-4 py-2 text-[12.5px] font-bold text-mist hover:text-snow"
      >
        <ArrowLeftIcon :size="16" class="rotate-180" />
        بازگشت به فروشگاه
      </NuxtLink>
      <span class="rounded-full bg-neon/15 px-3 py-1 text-[11px] font-extrabold text-neon">
        کیت برند رسمی ۱۴۰۴
      </span>
    </div>

    <!-- Header -->
    <div class="text-center max-w-2xl mx-auto mb-14">
      <div class="inline-flex items-center gap-2 rounded-full border border-vio/30 bg-vio/10 px-4 py-1.5 text-[12px] font-extrabold text-vio mb-4">
        ✨ هویت بصری فروشگاه {{ SITE.name }} ({{ SITE.latin }})
      </div>
      <h1 class="font-display text-3xl font-extrabold text-snow sm:text-5xl">
        مدل‌های مختلف لوگوی <span class="text-grad">{{ SITE.latin }}</span>
      </h1>
      <p class="mt-4 text-[14px] leading-8 text-mist">
        مجموعه کامل و استاندارد مدل‌های لوگوی طراحی‌شده شامل نسخه افقی، عمودی، آیکون مجزا، تایپوگرافی و فایل مادر SVG.
      </p>
    </div>

    <!-- Grid of Logo Models -->
    <div class="grid gap-8 lg:grid-cols-2 mb-16">
      <div
        v-for="m in logoModels"
        :key="m.id"
        class="card-g relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 p-6 transition-all duration-300 hover:border-vio/40 hover:shadow-2xl"
      >
        <div>
          <!-- Top Tag -->
          <div class="flex items-center justify-between mb-5">
            <span class="rounded-lg bg-white/6 px-2.5 py-1 text-[11px] font-mono font-bold text-dim">
              {{ m.badge }}
            </span>
            <span class="text-[11.5px] font-bold text-vio font-mono" dir="ltr">{{ m.file }}</span>
          </div>

          <!-- Preview Stage -->
          <div
            :class="[m.bgClass, 'relative flex min-h-[170px] items-center justify-center rounded-2xl border border-white/8 p-8 transition-transform group-hover:scale-[1.01]']"
          >
            <!-- Background subtle glow -->
            <div class="pointer-events-none absolute h-28 w-28 rounded-full bg-vio/15 blur-2xl" />

            <!-- Model Component -->
            <VapeLogo
              v-if="m.id === 'horizontal'"
              variant="horizontal"
              height="44"
              class="relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
            />
            <VapeLogo
              v-else-if="m.id === 'vertical'"
              variant="vertical"
              height="80"
              class="relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
            />
            <VapeLogo
              v-else-if="m.id === 'icon'"
              variant="icon"
              height="58"
              class="relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
            />
            <VapeLogo
              v-else-if="m.id === 'text'"
              variant="text"
              height="32"
              class="relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
            />
          </div>

          <!-- Info -->
          <h2 class="mt-5 text-[16px] font-extrabold text-snow">{{ m.title }}</h2>
          <p class="mt-2 text-[12.5px] leading-6 text-mist">{{ m.desc }}</p>
        </div>

        <!-- Action buttons -->
        <div class="mt-6 flex items-center gap-3 pt-4 border-t border-white/8">
          <a
            :href="m.file"
            download
            class="pressable flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-vio to-ice px-4 py-2.5 text-[12.5px] font-extrabold text-ink glow-v cursor-pointer"
          >
            دانلود مستقیم فایل SVG
          </a>
          <button
            @click="copySvg(m.id, m.file)"
            class="pressable flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-3.5 py-2.5 text-[12px] font-bold text-snow hover:bg-white/10 cursor-pointer"
          >
            <CheckIcon v-if="copied === m.id" :size="15" class="text-neon" />
            <TagIcon v-else :size="15" />
            <span>{{ copied === m.id ? 'کپی شد!' : 'کپی لینک' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Master Showcase (All Models Together) -->
    <div class="card-g rounded-3xl border border-vio/30 p-8 mb-16 overflow-hidden relative">
      <div class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vio/20 blur-3xl" />
      <div class="relative z-10">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span class="rounded-lg bg-vio/15 px-3 py-1 text-[11px] font-extrabold text-vio">
              فایل مادر اصلی (All-in-One)
            </span>
            <h2 class="mt-2 text-xl font-extrabold text-snow">لوگوشیت کامل (Master Artboard)</h2>
            <p class="mt-1 text-[12.5px] text-mist">حاوی تمامی مدل‌ها در ابعاد ۶۰۰x۲۰۰ پیکسل با افکت نئونی کامل</p>
          </div>
          <a
            href="/logo.svg"
            download
            class="pressable inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-neon to-ice px-6 py-3 text-[13px] font-extrabold text-ink glow-g"
          >
            دانلود فایل مادر logo.svg
          </a>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-white/10 bg-[#0A0A0C] p-4 flex justify-center">
          <img src="/logo.svg" alt="Master VAPELAB Logo Board" class="h-auto max-h-56 w-auto" />
        </div>
      </div>
    </div>

    <!-- Brand Color Palette -->
    <div class="mb-14">
      <h2 class="text-xl font-extrabold text-snow mb-5 flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-neon" />
        پالت رنگی برند {{ SITE.latin }}
      </h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="c in brandColors"
          :key="c.hex"
          class="card-g rounded-2xl p-4 border border-white/10"
        >
          <div
            class="h-16 w-full rounded-xl mb-3 border border-white/10 shadow-inner"
            :style="{ backgroundColor: c.hex }"
          />
          <p class="font-mono text-[14px] font-extrabold text-snow" dir="ltr">{{ c.hex }}</p>
          <p class="mt-1 text-[12.5px] font-bold text-mist">{{ c.name }}</p>
          <p class="mt-1 text-[11px] text-dim">{{ c.role }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
