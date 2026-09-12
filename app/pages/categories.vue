<script setup lang="ts">
import { computed } from "vue";
import type { Product, Category } from "~/types";
import VaporBackground from "~/components/vapor/VaporBackground.vue";
import CategorySlider from "~/components/vapor/CategorySlider.vue";
import SectionRow from "~/components/vapor/SectionRow.vue";
import ProductRail from "~/components/vapor/ProductRail.vue";
import RailItem from "~/components/vapor/RailItem.vue";
import ProductCard from "~/components/vapor/ProductCard.vue";
import { CATS_META } from "~/utils/vape";

useSeoMeta({
  title: "دسته‌بندی‌ها",
  description: "دسته‌بندی تخصصی پاد یک‌بارمصرف، سالت نیکوتین، مود و لوازم جانبی ویپ.",
});

const { data: categories } = await useFetch<Category[]>("/api/categories", { default: () => [] });
const { data: allProducts } = await useFetch<Product[]>("/api/products", {
  query: { limit: 40 },
  default: () => [],
});

const perCategory = computed(() => {
  const map: Record<string, Product[]> = {};
  for (const c of categories.value || []) {
    map[c.slug] = (allProducts.value || []).filter((p) => p.categorySlug === c.slug).slice(0, 4);
  }
  return map;
});
</script>

<template>
  <div>
    <section class="relative overflow-hidden">
      <VaporBackground class-name="opacity-60" />
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      <div class="wrap relative z-10 pt-10 pb-8 lg:pt-16">
        <p class="text-[11px] font-extrabold tracking-widest text-vio">برو به دسته‌ی دلخواهت</p>
        <h1 class="mt-2 font-display text-[32px] font-extrabold text-snow lg:text-5xl">
          دسته‌بندی <span class="text-grad">محصولات</span>
        </h1>
      </div>
    </section>

    <CategorySlider :cats="(categories || []).map((c) => ({ slug: c.slug, name: c.name, count: c.count, image: c.image }))" />

    <template v-for="c in categories || []" :key="c.slug">
      <SectionRow
        v-if="(perCategory[c.slug] || []).length > 0"
        :title="`${CATS_META[c.slug]?.emoji ?? '✨'} ${c.name}`"
        :sub="CATS_META[c.slug]?.sub"
        :href="`/shop?category=${c.slug}`"
      >
        <ProductRail>
          <RailItem v-for="(p, i) in perCategory[c.slug]" :key="p.id">
            <ProductCard :p="p" :index="i" />
          </RailItem>
        </ProductRail>
      </SectionRow>
    </template>

    <section class="wrap mt-14">
      <div class="card-g rounded-[24px] p-6 sm:p-8">
        <h2 class="font-display text-[20px] font-extrabold text-snow">راهنمای انتخاب 🤔</h2>
        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div
            v-for="[t, s] in [
              ['اولین باره؟', 'پاد یک‌بارمصرف با نیکوتین ۲۰ رو انتخاب کن؛ ساده، بدون دردسر و خوش‌طعم.'],
              ['سیگاری بودی؟', 'سالت با نیکوتین ۳۵ یا ۵۰ بهترین گزینه برای حس مشابه سیگار است.'],
              ['مصرف روزانه؟', 'مود با کویل قابل تعویض هم اقتصادی‌تره و هم بخار بهتری داره.'],
              ['شک داری؟', 'چت با پشتیبان واپر (پایین صفحه) یا تماس با ما — مشاوره رایگانه.'],
            ]"
            :key="t"
            class="rounded-2xl border border-white/8 bg-white/3 p-4"
          >
            <p class="text-[13.5px] font-extrabold text-snow">{{ t }}</p>
            <p class="mt-1.5 text-[12px] leading-6 text-dim">{{ s }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
