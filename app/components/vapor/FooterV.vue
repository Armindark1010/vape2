<script setup lang="ts">
import { SITE, DISCLAIMER } from "~/utils/vape";
import VapeLogo from "~/components/vapor/VapeLogo.vue";

const cols: { t: string; links: [string, string][] }[] = [
  {
    t: "دسترسی سریع",
    links: [
      ["خانه", "/"],
      ["دسته‌بندی‌ها", "/categories"],
      ["فروشگاه", "/shop"],
      ["جدیدترین‌ها", "/shop?sort=newest"],
    ],
  },
  {
    t: "خدمات",
    links: [
      ["پیگیری سفارش", "/account"],
      ["سبد خرید", "/cart"],
      ["تکمیل خرید", "/checkout"],
      ["کیت هویت برند و لوگو", "/brand"],
    ],
  },
  {
    t: "خرید مطمئن",
    links: [
      ["ضمانت اصالت کالا", "/categories"],
      ["راهنمای انتخاب", "/categories"],
      ["پرداخت در محل", "/checkout"],
      ["تماس: ۰۲۱-۹۱۰۰۲۲۳۳", "tel:02191002233"],
    ],
  },
];
</script>

<template>
  <footer class="mt-16 border-t border-white/8 bg-[#0b0b0f]">
    <div class="wrap grid gap-10 py-12 md:grid-cols-[1.3fr_repeat(3,1fr)]">
      <div>
        <NuxtLink to="/" class="flex items-center gap-3 transition-opacity hover:opacity-90" aria-label="ویپ‌لب">
          <VapeLogo variant="horizontal" height="34" />
        </NuxtLink>
        <p class="mt-4 max-w-xs text-[12.5px] leading-6 text-dim">
          فروشگاه تخصصی ویپ، سالت و پاد — فقط با کالای اورجینال و هولوگرام‌دار. {{ SITE.tagline }}.
        </p>
        <p class="mt-4 text-[12px] font-bold text-mist" dir="ltr">{{ SITE.phone }}</p>
      </div>
      <nav v-for="c in cols" :key="c.t" :aria-label="c.t">
        <p class="mb-4 text-[12px] font-extrabold text-snow">{{ c.t }}</p>
        <ul class="space-y-2.5">
          <li v-for="[l, h] in c.links" :key="l">
            <a v-if="h.startsWith('tel:')" :href="h" class="text-[12.5px] text-dim transition-colors hover:text-vio">{{ l }}</a>
            <NuxtLink v-else :to="h" class="text-[12.5px] text-dim transition-colors hover:text-vio">{{ l }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
    <div class="border-t border-white/8 px-5 py-6">
      <p class="mx-auto max-w-3xl text-center text-[10.5px] leading-5 text-dim/80">{{ DISCLAIMER }}</p>
      <p class="mt-3 text-center text-[11px] text-dim">
        © ۱۴۰۴ {{ SITE.name }} — کلیه حقوق محفوظ است. فروش فقط به افراد بالای ۱۸ سال.
      </p>
    </div>
  </footer>
</template>
