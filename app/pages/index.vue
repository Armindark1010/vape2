<script setup lang="ts">
import { computed } from "vue";
import type { Product, Category } from "~/types";
import VaporBackground from "~/components/vapor/VaporBackground.vue";
import ProductCard from "~/components/vapor/ProductCard.vue";
import CategorySlider from "~/components/vapor/CategorySlider.vue";
import SectionRow from "~/components/vapor/SectionRow.vue";
import ProductRail from "~/components/vapor/ProductRail.vue";
import RailItem from "~/components/vapor/RailItem.vue";
import { SITE, TRUST, WHY, HERO_IMG, PROMO_IMG, BRANDS_LINE, CATS_META } from "~/utils/vape";
import { ArrowLeftIcon, CheckIcon } from "~/components/vapor/VIcons";

useSeoMeta({
  title: `${SITE.name} | فروشگاه تخصصی ویپ، سالت و پاد — ${SITE.tagline}`,
  description:
    "فروشگاه تخصصی ویپ‌لب (VAPELAB) — خرید آنلاین پاد یک‌بارمصرف، سالت نیکوتین، مود و لوازم جانبی اصل با هولوگرام. ارسال فوری تهران، پرداخت در محل، ضمانت اصالت کالا.",
  ogTitle: `${SITE.name} — ${SITE.tagline}`,
  ogDescription: "پاد یک‌بارمصرف، سالت نیکوتین و مود اصل با ضمانت اصالت و ارسال فوری.",
  ogImage: "https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=1200",
});

const { data: allProducts } = await useFetch<Product[]>("/api/products", {
  query: { limit: 40 },
  default: () => [],
});

const { data: categories } = await useFetch<Category[]>("/api/categories", {
  default: () => [],
});

const newest = computed(() =>
  [...(allProducts.value || [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10)
);

const best = computed(() => (allProducts.value || []).filter((p) => p.bestSeller).slice(0, 8));

const deal = computed(
  () =>
    (allProducts.value || []).find((p) => p.discountPrice != null) ||
    allProducts.value?.[0] || {
      id: 1,
      slug: "elfbar-te6000",
      name: "ELFBAR TE6000",
      price: 1150000,
      discountPrice: 990000,
      categorySlug: "pods",
    }
);
</script>

<template>
  <div>
    <!-- ─────────────── Hero با دود سه‌بعدی ─────────────── -->
    <section class="relative flex min-h-[88svh] items-center overflow-hidden">
      <VaporBackground />
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,#09090b_88%)]" />
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink to-transparent" />

      <div class="wrap relative z-10 grid w-full items-center gap-8 pt-6 pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full border border-vio/30 bg-vio/10 px-4 py-2 text-[11.5px] font-bold text-vio">
            <span class="pulse-ring h-1.5 w-1.5 rounded-full bg-vio" />
            ورژن جدید پادهای ۱۰۰۰۰ پافی رسید
          </span>
          <h1 class="mt-6 font-display text-[40px] leading-[1.2] font-extrabold text-snow sm:text-6xl lg:text-[64px] lg:leading-[1.15]">
            دودِ نرم،
            <br />
            <span class="text-grad">طعمِ ناب.</span>
          </h1>
          <p class="mt-5 max-w-md text-[14.5px] leading-8 text-mist">
            فروشگاهسیسی تخصصی ویپ، سالت و پاد با ضمانت اصالت کالا. از {{ BRANDS_LINE[0] }} تا {{ BRANDS_LINE[3] }} — هرچی بخوای،
            اصلش پیش ماست. 🔥
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <NuxtLink
              to="/shop"
              class="pressable flex h-14 items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-8 text-[15px] font-extrabold text-ink glow-v"
            >
              مشاهده محصولات
              <ArrowLeftIcon :size="18" :sw="2.4" />
            </NuxtLink>
            <NuxtLink
              to="/categories"
              class="pressable flex h-14 items-center gap-2 rounded-2xl border border-white/14 bg-white/4 px-7 text-[14px] font-extrabold text-snow backdrop-blur"
            >
              دسته‌بندی‌ها
            </NuxtLink>
          </div>

          <ul class="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            <li v-for="t in TRUST.slice(0, 3)" :key="t.t" class="flex items-center gap-2 text-[12px] text-mist">
              <span class="grid h-5 w-5 place-items-center rounded-full bg-neon/15 text-neon">
                <CheckIcon :size="11" :sw="3" />
              </span>
              <strong class="text-snow">{{ t.t }}</strong> · {{ t.s }}
            </li>
          </ul>
        </div>

        <!-- کارت محصول شناور -->
        <div class="relative mx-auto hidden w-full max-w-sm lg:block">
          <div class="floaty relative overflow-hidden rounded-[28px] border border-vio/30 bg-panel glow-v">
            <img :src="HERO_IMG" alt="پاد یک‌بارمصرف" class="aspect-[3/4] w-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
            <div class="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl glass px-5 py-4">
              <div>
                <p dir="ltr" class="text-[13px] font-extrabold text-snow">{{ deal.name }}</p>
                <p class="mt-1 text-[11px] text-mist">{{ CATS_META[deal.categorySlug]?.label }}</p>
              </div>
              <div class="text-left">
                <p class="text-[10px] text-dim line-through tnum">{{ (deal.price / 1000).toLocaleString("en-US") }} هزار</p>
                <p class="text-[15px] font-extrabold text-neon tnum">{{ ((deal.discountPrice ?? deal.price) / 1000).toLocaleString("en-US") }} هزار</p>
              </div>
            </div>
            <span
              v-if="deal.discountPrice"
              class="absolute top-4 right-4 rounded-xl bg-neon px-2.5 py-1 text-[11px] font-extrabold text-ink"
              dir="ltr"
            >
              ٪{{ Math.round(((deal.price - deal.discountPrice) / deal.price) * 100) }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- نوار برندها -->
    <div class="hairline-t hairline-b overflow-hidden bg-white/[0.02] py-4" aria-hidden="true">
      <div class="marquee-track flex items-center gap-0">
        <div v-for="dup in [0, 1]" :key="dup" class="flex shrink-0 items-center">
          <span
            v-for="b in BRANDS_LINE"
            :key="b + dup"
            dir="ltr"
            class="flex items-center gap-10 pr-10 text-[15px] font-extrabold tracking-[0.2em] whitespace-nowrap text-white/25"
          >
            {{ b }} <span class="text-vio/60">✦</span>
          </span>
        </div>
      </div>
    </div>

    <!-- دسته‌بندی‌ها -->
    <CategorySlider :cats="(categories || []).map((c) => ({ slug: c.slug, name: c.name, count: c.count, image: c.image }))" />

    <!-- جدیدترین‌ها -->
    <SectionRow title="تازه‌های ویپ‌لب ☁️" sub="جدیدترین پادها و سالت‌ها — زود تموم میشن" href="/shop?sort=newest">
      <ProductRail>
        <RailItem v-for="(p, i) in newest" :key="p.id">
          <ProductCard :p="p" :index="i" />
        </RailItem>
      </ProductRail>
    </SectionRow>

    <!-- بنر پروموشن -->
    <section class="wrap mt-12">
      <div class="relative overflow-hidden rounded-[26px] border border-neon/20">
        <img :src="PROMO_IMG" alt="" class="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-l from-ink/95 via-ink/80 to-ink/40" />
        <div class="relative flex flex-col gap-5 px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between">
          <div>
            <span class="rounded-lg bg-neon/15 px-3 py-1.5 text-[11px] font-extrabold text-neon">پیشنهاد ویژه این هفته</span>
            <h2 class="mt-4 max-w-sm font-display text-[26px] leading-10 font-extrabold text-snow sm:text-3xl">
              تا <span class="text-grad">٪۱۵ تخفیف</span> روی همه سالت‌ها
            </h2>
            <p class="mt-2 text-[13px] text-mist">
              کد تخفیف: <strong dir="ltr" class="rounded-lg border border-dashed border-neon/50 bg-ink/60 px-2 py-1 font-mono text-neon">VAPELAB15</strong> — در صفحه پرداخت وارد کن
            </p>
          </div>
          <NuxtLink
            to="/shop?category=salts"
            class="pressable inline-flex h-13 w-fit items-center gap-2 self-start rounded-2xl bg-gradient-to-l from-neon to-ice px-7 py-4 text-[14px] font-extrabold text-ink glow-g md:self-center"
          >
            خرید سالت
            <ArrowLeftIcon :size="17" :sw="2.4" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- پرفروش‌ها -->
    <SectionRow title="پرفروش‌ترین‌ها 🔥" sub="آنچه واپرها بیشتر از همه دوستشون دارن" href="/shop?sort=popular">
      <div class="wrap grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4">
        <ProductCard v-for="(p, i) in best" :key="p.id" :p="p" :index="i" />
      </div>
    </SectionRow>

    <!-- چرا ویپ‌لب -->
    <section class="wrap mt-14">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="w in WHY"
          :key="w.t"
          class="card-g rounded-[22px] p-5 transition-all duration-300 hover:border-vio/30 hover:glow-v"
        >
          <span class="text-[26px]">{{ w.emoji }}</span>
          <h3 class="mt-3 text-[14px] font-extrabold text-snow">{{ w.t }}</h3>
          <p class="mt-2 text-[11.5px] leading-6 text-dim">{{ w.s }}</p>
        </div>
      </div>
    </section>

    <!-- CTA نهایی -->
    <section class="wrap mt-14">
      <div class="relative overflow-hidden rounded-[26px] border border-vio/25 p-8 text-center sm:p-12">
        <div class="pointer-events-none absolute -top-20 left-1/2 h-56 w-[500px] -translate-x-1/2 rounded-full bg-vio/15 blur-3xl" />
        <p class="relative text-[12px] font-extrabold tracking-widest text-vio">خرید مطمئن با {{ SITE.name }}</p>
        <h2 class="relative mt-3 font-display text-[26px] font-extrabold text-snow sm:text-3xl">
          آماده‌ای یه <span class="text-grad">کلیک</span> تا طعم موردعلاقه‌ت فاصله داری؟
        </h2>
        <NuxtLink
          to="/shop"
          class="pressable relative mt-7 inline-flex h-14 items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-10 text-[15px] font-extrabold text-ink glow-v"
        >
          شروع خرید <ArrowLeftIcon :size="18" :sw="2.4" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
