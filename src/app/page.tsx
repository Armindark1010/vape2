import Link from "next/link";
import { getProducts, getCategories } from "@/db/queries";
import { VaporBackground } from "@/components/vapor/VaporBackground";
import { ProductCard } from "@/components/vapor/ProductCard";
import { CategorySlider, SectionRow, ProductRail, RailItem } from "@/components/vapor/TouchRows";
import { SITE, TRUST, WHY, HERO_IMG, PROMO_IMG, BRANDS_LINE, CATS_META } from "@/lib/vape";
import { ArrowLeftIcon, CheckIcon } from "@/components/vapor/VIcons";
import { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [all, cats] = await Promise.all([getProducts({}, 40), getCategories()]);
  const newest = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);
  const best = all.filter((p) => p.bestSeller).slice(0, 8);
  const deal = all.find((p) => p.discountPrice != null) ?? all[0];

  const toV = (p: Product) => p;

  return (
    <>
      {/* ─────────────── Hero با دود سه‌بعدی ─────────────── */}
      <section className="relative flex min-h-[88svh] items-center overflow-hidden">
        <VaporBackground />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,#09090b_88%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink to-transparent" />

        <div className="wrap relative z-10 grid w-full items-center gap-8 pt-6 pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-vio/30 bg-vio/10 px-4 py-2 text-[11.5px] font-bold text-vio">
              <span className="pulse-ring h-1.5 w-1.5 rounded-full bg-vio" />
              ورژن جدید پادهای ۱۰۰۰۰ پافی رسید
            </span>
            <h1 className="mt-6 font-display text-[40px] leading-[1.2] font-extrabold text-snow sm:text-6xl lg:text-[64px] lg:leading-[1.15]">
              دودِ نرم،
              <br />
              <span className="text-grad">طعمِ ناب.</span>
            </h1>
            <p className="mt-5 max-w-md text-[14.5px] leading-8 text-mist">
              فروشگاه تخصصی ویپ، سالت و پاد با ضمانت اصالت کالا. از {BRANDS_LINE[0]} تا {BRANDS_LINE[3]} — هرچی بخوای،
              اصلش پیش ماست. 🔥
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="pressable flex h-14 items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-8 text-[15px] font-extrabold text-ink glow-v"
              >
                مشاهده محصولات
                <ArrowLeftIcon size={18} sw={2.4} />
              </Link>
              <Link
                href="/categories"
                className="pressable flex h-14 items-center gap-2 rounded-2xl border border-white/14 bg-white/4 px-7 text-[14px] font-extrabold text-snow backdrop-blur"
              >
                دسته‌بندی‌ها
              </Link>
            </div>

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
              {TRUST.slice(0, 3).map((t) => (
                <li key={t.t} className="flex items-center gap-2 text-[12px] text-mist">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-neon/15 text-neon">
                    <CheckIcon size={11} sw={3} />
                  </span>
                  <strong className="text-snow">{t.t}</strong> · {t.s}
                </li>
              ))}
            </ul>
          </div>

          {/* کارت محصول شناور */}
          <div className="relative mx-auto hidden w-full max-w-sm lg:block">
            <div className="floaty relative overflow-hidden rounded-[28px] border border-vio/30 bg-panel glow-v">
              <img src={HERO_IMG} alt="پاد یک‌بارمصرف" className="aspect-[3/4] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl glass px-5 py-4">
                <div>
                  <p dir="ltr" className="text-[13px] font-extrabold text-snow">{deal.name}</p>
                  <p className="mt-1 text-[11px] text-mist">{CATS_META[deal.categorySlug]?.label}</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-dim line-through tnum">{(deal.price / 1000).toLocaleString("en-US")} هزار</p>
                  <p className="text-[15px] font-extrabold text-neon tnum">{(deal.price / 1000).toLocaleString("en-US")} هزار</p>
                </div>
              </div>
              <span className="absolute top-4 right-4 rounded-xl bg-neon px-2.5 py-1 text-[11px] font-extrabold text-ink" dir="ltr">
                ٪{Math.round(((deal.price - (deal.discountPrice ?? deal.price)) / deal.price) * 100)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* نوار برندها */}
      <div className="hairline-t hairline-b overflow-hidden bg-white/[0.02] py-4" aria-hidden>
        <div className="marquee-track flex items-center gap-0">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {BRANDS_LINE.map((b) => (
                <span key={b + dup} dir="ltr" className="flex items-center gap-10 pr-10 text-[15px] font-extrabold tracking-[0.2em] whitespace-nowrap text-white/25">
                  {b} <span className="text-vio/60">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* دسته‌بندی‌ها */}
      <CategorySlider cats={cats.map((c) => ({ slug: c.slug, name: c.name, count: c.count, image: c.image }))} />

      {/* جدیدترین‌ها */}
      <SectionRow title="تازه‌های ویپورا ☁️" sub="جدیدترین پادها و سالت‌ها — زود تموم میشن" href="/shop?sort=newest">
        <ProductRail>
          {newest.map((p, i) => (
            <RailItem key={p.id}>
              <ProductCard p={toV(p)} index={i} />
            </RailItem>
          ))}
        </ProductRail>
      </SectionRow>

      {/* بنر پروموشن */}
      <section className="wrap mt-12">
        <div className="relative overflow-hidden rounded-[26px] border border-neon/20">
          <img src={PROMO_IMG} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-l from-ink/95 via-ink/80 to-ink/40" />
          <div className="relative flex flex-col gap-5 px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="rounded-lg bg-neon/15 px-3 py-1.5 text-[11px] font-extrabold text-neon">پیشنهاد ویژه این هفته</span>
              <h2 className="mt-4 max-w-sm font-display text-[26px] leading-10 font-extrabold text-snow sm:text-3xl">
                تا <span className="text-grad">٪۱۵ تخفیف</span> روی همه سالت‌ها
              </h2>
              <p className="mt-2 text-[13px] text-mist">
                کد تخفیف: <strong dir="ltr" className="rounded-lg border border-dashed border-neon/50 bg-ink/60 px-2 py-1 font-mono text-neon">VAPORA15</strong> — در صفحه پرداخت وارد کن
              </p>
            </div>
            <Link
              href="/shop?category=salts"
              className="pressable inline-flex h-13 w-fit items-center gap-2 self-start rounded-2xl bg-gradient-to-l from-neon to-ice px-7 py-4 text-[14px] font-extrabold text-ink glow-g md:self-center"
            >
              خرید سالت
              <ArrowLeftIcon size={17} sw={2.4} />
            </Link>
          </div>
        </div>
      </section>

      {/* پرفروش‌ها */}
      <SectionRow title="پرفروش‌ترین‌ها 🔥" sub="آنچه واپرها بیشتر از همه دوستشون دارن" href="/shop?sort=popular">
        <div className="wrap grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4">
          {best.map((p, i) => (
            <ProductCard key={p.id} p={toV(p)} index={i} />
          ))}
        </div>
      </SectionRow>

      {/* چرا ویپورا */}
      <section className="wrap mt-14">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <div key={w.t} className="card-g rounded-[22px] p-5 transition-all duration-300 hover:border-vio/30 hover:glow-v">
              <span className="text-[26px]">{w.emoji}</span>
              <h3 className="mt-3 text-[14px] font-extrabold text-snow">{w.t}</h3>
              <p className="mt-2 text-[11.5px] leading-6 text-dim">{w.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA نهایی */}
      <section className="wrap mt-14">
        <div className="relative overflow-hidden rounded-[26px] border border-vio/25 p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute -top-20 left-1/2 h-56 w-[500px] -translate-x-1/2 rounded-full bg-vio/15 blur-3xl" />
          <p className="relative text-[12px] font-extrabold tracking-widest text-vio">خرید مطمئن با {SITE.name}</p>
          <h2 className="relative mt-3 font-display text-[26px] font-extrabold text-snow sm:text-3xl">
            آماده‌ای یه <span className="text-grad">کلیک</span> تا طعم موردعلاقه‌ت فاصله داری؟
          </h2>
          <Link
            href="/shop"
            className="pressable relative mt-7 inline-flex h-14 items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-10 text-[15px] font-extrabold text-ink glow-v"
          >
            شروع خرید <ArrowLeftIcon size={18} sw={2.4} />
          </Link>
        </div>
      </section>
    </>
  );
}
