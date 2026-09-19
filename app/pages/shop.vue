<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import type { Product, Category, Brand } from "~/types";
import ProductCard from "~/components/vapor/ProductCard.vue";
import ShopBar from "~/components/vapor/ShopBar.vue";
import { CATS_META } from "~/utils/vape";

useSeoMeta({
  title: "فروشگاه",
  description: "خرید آنلاین پاد یک‌بارمصرف، سالت نیکوتین و مود — اصل با هولوگرام و ارسال فوری.",
});

const SORTS = [
  { v: "popular", l: "پرفروش‌ترین" },
  { v: "newest", l: "جدیدترین" },
  { v: "price-asc", l: "ارزان‌ترین" },
  { v: "price-desc", l: "گران‌ترین" },
  { v: "rating", l: "بالاترین امتیاز" },
];

const route = useRoute();

const { data: categories } = await useFetch<Category[]>("/api/categories", { default: () => [] });
const { data: brands } = await useFetch<Brand[]>("/api/brands", { default: () => [] });

const { data: allProducts } = await useFetch<Product[]>("/api/products", {
  query: { limit: 60 },
  default: () => [],
});

const currentFilters = computed(() => ({
  category: route.query.category as string | undefined,
  brand: route.query.brand as string | undefined,
  max: route.query.max ? Number(route.query.max) : undefined,
  min: route.query.min ? Number(route.query.min) : undefined,
  stock: route.query.stock === "in" ? "in" : undefined,
  sort: (route.query.sort as string) || "popular",
  q: route.query.q as string | undefined,
}));

const { data: products } = await useFetch<Product[]>("/api/products", {
  query: currentFilters,
  watch: [() => route.query],
  default: () => [],
});

const catName = computed(
  () => categories.value?.find((c) => c.slug === route.query.category)?.name
);
const brandName = computed(
  () => brands.value?.find((b) => b.slug === route.query.brand)?.name
);

const priceCeil = computed(() => {
  const allPrices = (allProducts.value || []).map((p) => p.discountPrice ?? p.price);
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 3000000;
  return Math.ceil(maxPrice / 100000) * 100000;
});

const initial = computed(() => ({
  category: route.query.category as string | undefined,
  brand: route.query.brand as string | undefined,
  inStock: route.query.stock === "in",
  max: route.query.max ? Number(route.query.max) : undefined,
  sort: (route.query.sort as string) || "popular",
}));
</script>

<template>
  <div class="wrap pt-8 pb-4">
    <!-- سربرگ -->
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-[11px] font-extrabold tracking-widest text-vio">
          {{ catName ? `دسته: ${catName}` : "فروشگاه ویپ‌لب" }}
        </p>
        <h1 class="mt-1 font-display text-[28px] font-extrabold text-snow lg:text-4xl">
          {{ catName ? catName : "همه محصولات" }}
          <span v-if="brandName" dir="ltr" class="text-grad"> · {{ brandName }}</span>
        </h1>
        <p class="mt-2 text-[12.5px] text-dim tnum">{{ (products || []).length }} محصول · ارسال فوری تهران 🚚</p>
      </div>
    </div>

    <!-- چیپ دسته‌ها -->
    <div class="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
      <NuxtLink
        to="/shop"
        :class="[
          'pressable flex h-12 shrink-0 items-center gap-2 rounded-2xl px-4 text-[13px] font-bold',
          !route.query.category ? 'border border-vio/50 bg-vio/15 text-snow glow-v' : 'border border-white/10 bg-white/4 text-mist',
        ]"
      >
        همه
      </NuxtLink>
      <NuxtLink
        v-for="c in categories || []"
        :key="c.slug"
        :to="route.query.category === c.slug ? '/shop' : `/shop?category=${c.slug}`"
        :class="[
          'pressable flex h-12 shrink-0 items-center gap-2 rounded-2xl px-4 text-[13px] font-bold',
          route.query.category === c.slug ? 'border border-vio/50 bg-vio/15 text-snow glow-v' : 'border border-white/10 bg-white/4 text-mist',
        ]"
      >
        <span>{{ CATS_META[c.slug]?.emoji ?? "✨" }}</span>
        {{ c.name }}
      </NuxtLink>
    </div>

    <!-- نوار ابزار -->
    <ShopBar
      :initial="initial"
      :cats="(categories || []).map((c) => ({ slug: c.slug, name: c.name }))"
      :brands="(brands || []).map((b) => ({ slug: b.slug, name: b.name }))"
      :price-ceil="priceCeil"
      :sort-options="SORTS"
      :count="(products || []).length"
    />

    <!-- محصولات -->
    <div v-if="(products || []).length === 0" class="card-g mt-6 rounded-[24px] p-14 text-center">
      <p class="text-5xl">😔</p>
      <p class="mt-4 text-[16px] font-extrabold text-snow">چیزی با این فیلترها پیدا نشد</p>
      <p class="mt-2 text-[12.5px] text-dim">فیلترها رو ساده‌تر کن یا همه محصولات رو ببین</p>
      <NuxtLink
        to="/shop"
        class="pressable mt-6 inline-flex h-12 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-7 text-[13px] font-extrabold text-ink"
      >
        حذف فیلترها
      </NuxtLink>
    </div>
    <div v-else class="mt-5 grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4 2xl:grid-cols-5">
      <ProductCard v-for="(p, i) in products || []" :key="p.id" :p="p" :index="i" />
    </div>

    <p class="mt-10 text-center text-[11px] leading-6 text-dim">
      همه کالاهای ویپ‌لب دارای <strong class="text-mist">هولوگرام اصالت</strong> هستند · در صورت مغایرت، وجه کامل برگردانده می‌شود.
    </p>
  </div>
</template>
