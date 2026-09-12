<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import type { Product } from "~/types";
import BuyBox from "~/components/vapor/BuyBox.vue";
import Gallery from "~/components/vapor/Gallery.vue";
import Product3DModal from "~/components/vapor/Product3DModal.vue";
import SectionRow from "~/components/vapor/SectionRow.vue";
import ProductRail from "~/components/vapor/ProductRail.vue";
import RailItem from "~/components/vapor/RailItem.vue";
import ProductCard from "~/components/vapor/ProductCard.vue";
import {
  ChevronLeftIcon,
  ShieldIcon,
  RefreshIcon,
  FlameIcon,
  TruckIcon,
  Cube3DIcon,
} from "~/components/vapor/VIcons";
import { SITE } from "~/utils/vape";

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const show3DModal = ref(false);

const { data: product, error } = await useFetch<Product>(() => `/api/products/${slug.value}`, {
  key: `product-${slug.value}`,
});

if (error.value || !product.value) {
  throw createError({ statusCode: 404, message: "محصول پیدا نشد", fatal: true });
}

const { data: allProducts } = await useFetch<Product[]>("/api/products", {
  query: { limit: 40 },
  default: () => [],
});

const related = computed(() =>
  (allProducts.value || [])
    .filter((p) => p.categorySlug === product.value?.categorySlug && p.slug !== product.value?.slug)
    .slice(0, 8)
);

const specEntries = computed(() =>
  Object.entries(product.value?.specs ?? {}).filter(([k]) => k !== "options")
);

useSeoMeta({
  title: computed(() => (product.value ? `${product.value.name} | ${product.value.brand}` : "محصول")),
  description: computed(() => product.value?.tagline ?? product.value?.description?.slice(0, 150)),
  ogTitle: computed(() => product.value?.name),
  ogDescription: computed(() => product.value?.tagline ?? undefined),
  ogImage: computed(() => product.value?.images?.[0]),
});

const jsonLd = computed(() => {
  if (!product.value) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.value.name,
    image: product.value.images,
    description: product.value.description,
    brand: { "@type": "Brand", name: product.value.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "IRR",
      price: String((product.value.discountPrice ?? product.value.price) * 10),
      availability: product.value.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE.domain}/product/${product.value.slug}`,
    },
  };
});

useHead({
  script: computed(() =>
    jsonLd.value
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify(jsonLd.value),
          },
        ]
      : []
  ),
});
</script>

<template>
  <div v-if="product" class="wrap pt-4 pb-4">
    <!-- مسیر -->
    <nav aria-label="مسیر صفحه" class="flex items-center gap-1.5 overflow-x-auto py-2 text-[12px] whitespace-nowrap text-dim no-scrollbar">
      <NuxtLink to="/" class="hover:text-vio">خانه</NuxtLink>
      <ChevronLeftIcon :size="12" />
      <NuxtLink :to="`/shop?category=${product.categorySlug}`" class="hover:text-vio">{{ product.category }}</NuxtLink>
      <ChevronLeftIcon :size="12" />
      <span class="text-mist">{{ product.name }}</span>
    </nav>

    <div class="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      <div>
        <Gallery
          :images="product.images"
          :name="product.name"
          @open-3d="show3DModal = true"
        />

        <!-- بنر میانبر اسکن ۳ بعدی -->
        <div class="mt-4 flex items-center justify-between rounded-2xl border border-vio/20 bg-vio/8 p-3.5 backdrop-blur-md">
          <div class="flex items-center gap-2.5">
            <span class="grid h-8 w-8 place-items-center rounded-xl bg-vio/20 text-vio glow-v">
              <Cube3DIcon :size="18" />
            </span>
            <div>
              <p class="text-[12px] font-extrabold text-snow">نمایشگر سه‌بعدی تعاملی و AR</p>
              <p class="text-[10px] text-mist">مدل را بچرخانید و رنگ‌های مختلف آن را تست کنید</p>
            </div>
          </div>

          <button
            type="button"
            class="pressable rounded-xl bg-vio px-3 py-1.5 text-[11px] font-extrabold text-ink glow-v transition-all hover:scale-105 cursor-pointer"
            @click="show3DModal = true"
          >
            مشاهده ۳D
          </button>
        </div>
      </div>

      <div class="lg:pt-4">
        <BuyBox :product="product" />
      </div>
    </div>

    <!-- مودال سه‌بعدی -->
    <Product3DModal
      :show="show3DModal"
      :product="product"
      @close="show3DModal = false"
    />

    <!-- توضیحات و مشخصات -->
    <section class="mt-12 grid gap-6 lg:grid-cols-2">
      <div class="card-g rounded-[22px] p-6">
        <h2 class="flex items-center gap-2 text-[16px] font-extrabold text-snow">
          <FlameIcon :size="18" class="text-vio" /> درباره محصول
        </h2>
        <p class="mt-4 text-[13px] leading-8 text-mist">{{ product.description }}</p>
      </div>
      <div class="card-g rounded-[22px] p-6">
        <h2 class="text-[16px] font-extrabold text-snow">مشخصات فنی</h2>
        <dl class="mt-4 divide-y divide-white/6">
          <div v-for="[k, v] in specEntries" :key="k" class="flex items-center justify-between gap-4 py-2.5">
            <dt class="text-[12.5px] text-dim">{{ k }}</dt>
            <dd dir="ltr" class="text-left text-[12.5px] font-extrabold text-snow">{{ v }}</dd>
          </div>
          <div class="flex items-center justify-between gap-4 py-2.5">
            <dt class="text-[12.5px] text-dim">وضعیت موجودی</dt>
            <dd :class="product.stock > 0 ? 'font-extrabold text-neon' : 'font-extrabold text-blush'">
              {{ product.stock > 0 ? `${product.stock} عدد در انبار` : 'ناموجود' }}
            </dd>
          </div>
        </dl>
        <div class="mt-4 grid grid-cols-3 gap-2 border-t border-white/8 pt-4">
          <div
            v-for="item in [
              { I: ShieldIcon, t: 'ضمانت اصالت' },
              { I: TruckIcon, t: 'ارسال سریع' },
              { I: RefreshIcon, t: 'بازگشت ۷ روزه' },
            ]"
            :key="item.t"
            class="flex flex-col items-center gap-1.5 rounded-xl bg-white/3 py-3 text-center"
          >
            <component :is="item.I" :size="16" class="text-neon" />
            <span class="text-[9.5px] font-bold text-dim">{{ item.t }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- محصولات مشابه -->
    <div v-if="related.length > 0" class="mt-14">
      <SectionRow title="شاید این‌ها هم خوشت بیاد 💜" sub="بر اساس دسته‌بندی همین محصول">
        <ProductRail>
          <RailItem v-for="(r, i) in related" :key="r.id">
            <ProductCard :p="r" :index="i" />
          </RailItem>
        </ProductRail>
      </SectionRow>
    </div>

    <p class="mt-12 rounded-2xl border border-blush/20 bg-blush/6 p-5 text-center text-[11.5px] leading-6 text-mist">
      ⚠️ محصولات نیکوتین‌دار فقط برای افراد بالای ۱۸ سال قابل خرید است. مصرف دخانیات برای سلامتی مضر است.
    </p>
  </div>
</template>
