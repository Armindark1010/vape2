import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/db/queries";
import { BuyBox } from "@/components/vapor/BuyBox";
import { Gallery } from "@/components/vapor/Gallery";
import { ProductRail, RailItem, SectionRow } from "@/components/vapor/TouchRows";
import { ProductCard } from "@/components/vapor/ProductCard";
import { ChevronLeftIcon, ShieldIcon, RefreshIcon, FlameIcon } from "@/components/vapor/VIcons";
import { SITE } from "@/lib/vape";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "محصول پیدا نشد" };
  return {
    title: `${p.name} | ${p.brand}`,
    description: p.tagline ?? p.description.slice(0, 150),
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: p.name, description: p.tagline ?? undefined, images: p.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const related = (await getRelatedProducts(p, 10)).slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.images,
    description: p.description,
    brand: { "@type": "Brand", name: p.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "IRR",
      price: String((p.discountPrice ?? p.price) * 10),
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE.domain}/product/${p.slug}`,
    },
  };

  const specEntries = Object.entries(p.specs ?? {}).filter(([k]) => k !== "options");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap pt-4 pb-4">
        {/* مسیر */}
        <nav aria-label="مسیر صفحه" className="flex items-center gap-1.5 overflow-x-auto py-2 text-[12px] whitespace-nowrap text-dim no-scrollbar">
          <Link href="/" className="hover:text-vio">خانه</Link>
          <ChevronLeftIcon size={12} />
          <Link href={`/shop?category=${p.categorySlug}`} className="hover:text-vio">{p.category}</Link>
          <ChevronLeftIcon size={12} />
          <span className="text-mist">{p.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <Gallery images={p.images} name={p.name} />
          <div className="lg:pt-4">
            <BuyBox product={p} />
          </div>
        </div>

        {/* توضیحات و مشخصات */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="card-g rounded-[22px] p-6">
            <h2 className="flex items-center gap-2 text-[16px] font-extrabold text-snow">
              <FlameIcon size={18} className="text-vio" /> درباره محصول
            </h2>
            <p className="mt-4 text-[13px] leading-8 text-mist">{p.description}</p>
          </div>
          <div className="card-g rounded-[22px] p-6">
            <h2 className="text-[16px] font-extrabold text-snow">مشخصات فنی</h2>
            <dl className="mt-4 divide-y divide-white/6">
              {specEntries.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-[12.5px] text-dim">{k}</dt>
                  <dd dir="ltr" className="text-left text-[12.5px] font-extrabold text-snow">{v}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-[12.5px] text-dim">وضعیت موجودی</dt>
                <dd className={p.stock > 0 ? "font-extrabold text-neon" : "font-extrabold text-blush"}>
                  {p.stock > 0 ? `${p.stock} عدد در انبار` : "ناموجود"}
                </dd>
              </div>
            </dl>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/8 pt-4">
              {[
                { I: ShieldIcon, t: "ضمانت اصالت" },
                { I: TruckIcon2, t: "ارسال سریع" },
                { I: RefreshIcon, t: "بازگشت ۷ روزه" },
              ].map(({ I, t }) => (
                <div key={t} className="flex flex-col items-center gap-1.5 rounded-xl bg-white/3 py-3 text-center">
                  <I size={16} className="text-neon" />
                  <span className="text-[9.5px] font-bold text-dim">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* محصولات مشابه */}
        {related.length > 0 && (
          <div className="mt-14">
            <SectionRow title="شاید این‌ها هم خوشت بیاد 💜" sub="بر اساس دسته‌بندی همین محصول">
              <ProductRail>
                {related.map((r, i) => (
                  <RailItem key={r.id}>
                    <ProductCard p={r} index={i} />
                  </RailItem>
                ))}
              </ProductRail>
            </SectionRow>
          </div>
        )}

        <p className="mt-12 rounded-2xl border border-blush/20 bg-blush/6 p-5 text-center text-[11.5px] leading-6 text-mist">
          ⚠️ محصولات نیکوتین‌دار فقط برای افراد بالای ۱۸ سال قابل خرید است. مصرف دخانیات برای سلامتی مضر است.
        </p>
      </div>
    </>
  );
}

const TruckIcon2 = (p: { size?: number; className?: string }) => (
  <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className={p.className} aria-hidden>
    <path d="M2.5 6h11v11h-11zM13.5 10h3.6l2.9 3.3V17h-6.5" />
    <circle cx="6.5" cy="17.5" r="1.9" />
    <circle cx="17" cy="17.5" r="1.9" />
  </svg>
);
