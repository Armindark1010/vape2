<script setup lang="ts">
import { CATS_META } from "~/utils/vape";

defineProps<{
  cats: { slug: string; name: string; count: number; image: string | null }[];
}>();
</script>

<template>
  <div class="wrap mt-10">
    <div class="mb-4 flex items-end justify-between">
      <div>
        <h2 class="text-[19px] font-extrabold text-snow">دسته‌بندی‌ها</h2>
        <p class="mt-1 text-[11.5px] text-dim">سریع‌ترین راه رسیدن به طعم دلخواهت</p>
      </div>
      <NuxtLink to="/categories" class="pressable rounded-xl px-2 py-2 text-[12px] font-extrabold text-vio">
        همه دسته‌ها ←
      </NuxtLink>
    </div>
    <div class="no-scrollbar snap-x-mandatory -mx-0 flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-4">
      <NuxtLink
        v-for="(c, i) in cats"
        :key="c.slug"
        :to="`/shop?category=${c.slug}`"
        :class="[
          'group relative block w-[72vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-[22px] border border-white/10 lg:w-auto',
          i === 0 ? 'lg:col-span-1' : '',
        ]"
      >
        <div class="relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/10]">
          <img
            :src="c.image ?? ''"
            :alt="c.name"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
          />
          <div
            :class="[
              'absolute inset-0 bg-gradient-to-t to-transparent',
              CATS_META[c.slug]?.tint === 'neon'
                ? 'from-ink via-neon/15'
                : CATS_META[c.slug]?.tint === 'ice'
                  ? 'from-ink via-ice/15'
                  : CATS_META[c.slug]?.tint === 'blush'
                    ? 'from-ink via-blush/15'
                    : 'from-ink via-vio/20',
            ]"
          />
          <div class="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
            <div>
              <p class="text-[17px] font-extrabold text-snow drop-shadow-md">{{ c.name }}</p>
              <p class="mt-0.5 text-[11px] text-mist tnum">{{ c.count }} محصول</p>
            </div>
            <span class="text-[24px] drop-shadow-[0_0_14px_rgba(167,139,250,0.8)]">
              {{ CATS_META[c.slug]?.emoji ?? "✨" }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
