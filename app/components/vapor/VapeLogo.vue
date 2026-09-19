<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "horizontal" | "vertical" | "icon" | "text" | "all";
    height?: number | string;
    glow?: boolean;
    badge?: boolean;
    showSub?: boolean;
    subText?: string;
  }>(),
  {
    variant: "horizontal",
    height: undefined,
    glow: true,
    badge: false,
    showSub: false,
    subText: "ویپ و سالت",
  }
);

const numH = computed(() => {
  if (typeof props.height === "number") return props.height;
  if (typeof props.height === "string") {
    const parsed = parseFloat(props.height);
    if (!isNaN(parsed)) return parsed;
  }
  switch (props.variant) {
    case "icon":
      return 36;
    case "vertical":
      return 68;
    case "text":
      return 26;
    case "all":
      return 120;
    default:
      return 36;
  }
});

const h = computed(() => `${numH.value}px`);

const imageSrc = computed(() => {
  switch (props.variant) {
    case "icon":
      return "/logo-icon.png";
    case "vertical":
      return "/logo-vertical.png";
    case "text":
      return "/logo-text.png";
    case "horizontal":
    default:
      return "/logo-horizontal.png";
  }
});
</script>

<template>
  <div
    dir="ltr"
    style="direction: ltr;"
    class="inline-flex items-center shrink-0 select-none group transition-transform duration-200"
  >
    <!-- واریانت‌های تکی (افقی، عمودی، آیکون، متن) بر پایه تصویر ترنسپرنت اصلی -->
    <template v-if="variant !== 'all'">
      <img
        :src="imageSrc"
        :alt="`لوگوی رسمی ویپ‌لب - ${variant}`"
        :style="{ height: h, width: 'auto' }"
        class="block shrink-0 object-contain drop-shadow-[0_2px_12px_rgba(47,230,149,0.15)] select-none pointer-events-none"
        loading="eager"
      />
    </template>

    <!-- واریانت نمایش کامل هر ۴ مدل برای صفحه برند (Brand Showcase) -->
    <div
      v-else
      class="flex flex-wrap items-center gap-6 rounded-2xl bg-[#0A0A0C] p-5 border border-white/10"
    >
      <div class="flex flex-col items-center gap-2">
        <span class="text-[10px] text-sub font-mono">1. ICON</span>
        <img
          src="/logo-icon.png"
          alt="Icon"
          class="h-12 w-auto object-contain drop-shadow-md"
        />
      </div>

      <div class="flex flex-col items-center gap-2">
        <span class="text-[10px] text-sub font-mono">2. HORIZONTAL</span>
        <img
          src="/logo-horizontal.png"
          alt="Horizontal"
          class="h-9 w-auto object-contain drop-shadow-md"
        />
      </div>

      <div class="flex flex-col items-center gap-2">
        <span class="text-[10px] text-sub font-mono">3. VERTICAL</span>
        <img
          src="/logo-vertical.png"
          alt="Vertical"
          class="h-14 w-auto object-contain drop-shadow-md"
        />
      </div>

      <div class="flex flex-col items-center gap-2">
        <span class="text-[10px] text-sub font-mono">4. TEXT</span>
        <img
          src="/logo-text.png"
          alt="Text"
          class="h-6 w-auto object-contain drop-shadow-md"
        />
      </div>
    </div>

    <!-- زیرعنوان فارسی اختیاری -->
    <span
      v-if="showSub"
      class="mr-2 rounded-full bg-violet-500/15 border border-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-400 self-center"
    >
      {{ subText }}
    </span>
  </div>
</template>
