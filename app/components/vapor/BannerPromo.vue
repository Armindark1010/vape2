<script setup lang="ts">
import { computed } from "vue";
import type { Banner } from "~/types";
import { ArrowLeftIcon } from "~/components/vapor/VIcons";

const props = defineProps<{
  banner?: Banner | null;
}>();

const b = computed(() => props.banner);
</script>

<template>
  <section v-if="b" class="wrap mt-14">
    <div class="relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-white/15 bg-[#0e131d] shadow-2xl">
      <!-- تصویر پس‌زمینه با ترنسپرنسی و پوشش تم دار -->
      <img
        :src="b.image"
        :alt="b.title"
        class="absolute inset-0 h-full w-full object-cover object-center transform scale-105"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-l from-[#090b10]/95 via-[#090b10]/85 to-[#090b10]/40" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.12),transparent_70%)]" />

      <div class="relative flex flex-col gap-6 px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between z-10">
        <div class="max-w-xl">
          <span
            v-if="b.badge"
            class="inline-block rounded-xl bg-neon/15 border border-neon/30 px-3.5 py-1.5 text-[11.5px] font-black text-neon shadow-sm mb-3"
          >
            {{ b.badge }}
          </span>
          <h3 class="font-display text-[24px] sm:text-[30px] leading-snug font-black text-snow drop-shadow">
            {{ b.title }}
          </h3>
          <p v-if="b.subtitle" class="mt-2.5 text-[13.5px] leading-7 text-mist max-w-md font-medium">
            {{ b.subtitle }}
          </p>
        </div>

        <NuxtLink
          :to="b.link || '/shop'"
          class="pressable inline-flex h-13 w-fit items-center gap-2 self-start rounded-2xl bg-gradient-to-l from-neon to-ice px-7 py-3.5 text-[14px] font-black text-ink glow-g md:self-center shrink-0 shadow-xl hover:opacity-95 transition"
        >
          <span>{{ b.buttonText || 'مشاهده پیشنهاد' }}</span>
          <ArrowLeftIcon :size="17" :sw="2.5" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
