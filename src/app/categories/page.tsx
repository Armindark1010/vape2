import { getCategories, getProducts } from "@/db/queries";
import { VaporBackground } from "@/components/vapor/VaporBackground";
import { CategorySlider, SectionRow, ProductRail, RailItem } from "@/components/vapor/TouchRows";
import { ProductCard } from "@/components/vapor/ProductCard";
import { CATS_META } from "@/lib/vape";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [cats, all] = await Promise.all([getCategories(), getProducts({}, 40)]);
  const per: Record<string, typeof all> = {};
  for (const c of cats) {
    per[c.slug] = all.filter((p) => p.categorySlug === c.slug).slice(0, 4);
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <VaporBackground className="opacity-60" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
        <div className="wrap relative z-10 pt-10 pb-8 lg:pt-16">
          <p className="text-[11px] font-extrabold tracking-widest text-vio">برو به دسته‌ی دلخواهت</p>
          <h1 className="mt-2 font-display text-[32px] font-extrabold text-snow lg:text-5xl">
            دسته‌بندی <span className="text-grad">محصولات</span>
          </h1>
        </div>
      </section>

      <CategorySlider cats={cats.map((c) => ({ slug: c.slug, name: c.name, count: c.count, image: c.image }))} />

      {cats.map((c) => {
        const items = per[c.slug] ?? [];
        if (!items.length) return null;
        const meta = CATS_META[c.slug] ?? { label: c.name, emoji: "✨", tint: "vio" };
        return (
          <SectionRow key={c.slug} title={`${meta.emoji} ${c.name}`} sub={meta.sub} href={`/shop?category=${c.slug}`}>
            <ProductRail>
              {items.map((p, i) => (
                <RailItem key={p.id}>
                  <ProductCard p={p} index={i} />
                </RailItem>
              ))}
            </ProductRail>
          </SectionRow>
        );
      })}

      <section className="wrap mt-14">
        <div className="card-g rounded-[24px] p-6 sm:p-8">
          <h2 className="font-display text-[20px] font-extrabold text-snow">راهنمای انتخاب 🤔</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["اولین باره؟", "پاد یک‌بارمصرف با نیکوتین ۲۰ رو انتخاب کن؛ ساده، بدون دردسر و خوش‌طعم."],
              ["سیگاری بودی؟", "سالت با نیکوتین ۳۵ یا ۵۰ بهترین گزینه برای حس مشابه سیگار است."],
              ["مصرف روزانه؟", "مود با کویل قابل تعویض هم اقتصادی‌تره و هم بخار بهتری داره."],
              ["شک داری؟", "چت با پشتیبان واپر (پایین صفحه) یا تماس با ما — مشاوره رایگانه."],
            ].map(([t, s]) => (
              <div key={t} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <p className="text-[13.5px] font-extrabold text-snow">{t}</p>
                <p className="mt-1.5 text-[12px] leading-6 text-dim">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
