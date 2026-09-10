import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, getCategories, getBrands } from "@/db/queries";
import { ProductCard } from "@/components/vapor/ProductCard";
import { ShopBar } from "@/components/vapor/ShopBar";
import { CATS_META } from "@/lib/vape";
import { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "فروشگاه",
  description: "خرید آنلاین پاد یک‌بارمصرف، سالت نیکوتین و مود — اصل با هولوگرام و ارسال فوری.",
  alternates: { canonical: "/shop" },
};

export const dynamic = "force-dynamic";

const SORTS = [
  { v: "popular", l: "پرفروش‌ترین" },
  { v: "newest", l: "جدیدترین" },
  { v: "price-asc", l: "ارزان‌ترین" },
  { v: "price-desc", l: "گران‌ترین" },
  { v: "rating", l: "بالاترین امتیاز" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const s = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);

  const [products, cats, brands] = await Promise.all([
    getProducts(
      {
        category: s("category"),
        brand: s("brand"),
        max: s("max") ? Number(s("max")) : undefined,
        min: s("min") ? Number(s("min")) : undefined,
        stock: s("stock") === "in" ? "in" : undefined,
        sort: s("sort") ?? "popular",
        q: s("q"),
      },
      60
    ),
    getCategories(),
    getBrands(),
  ]);

  const catName = cats.find((c) => c.slug === s("category"))?.name;
  const brandName = brands.find((b) => b.slug === s("brand"))?.name;
  const allPrices = (await getProducts({}, 60)).map((p) => p.discountPrice ?? p.price);
  const priceCeil = Math.ceil(Math.max(...allPrices) / 100_000) * 100_000;

  const initial = {
    category: s("category"),
    brand: s("brand"),
    inStock: s("stock") === "in",
    max: s("max") ? Number(s("max")) : undefined,
    sort: s("sort") ?? "popular",
  };

  return (
    <div className="wrap pt-8 pb-4">
      {/* سربرگ */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold tracking-widest text-vio">
            {catName ? `دسته: ${catName}` : "فروشگاه ویپورا"}
          </p>
          <h1 className="mt-1 font-display text-[28px] font-extrabold text-snow lg:text-4xl">
            {catName ? catName : "همه محصولات"}
            {brandName && <span dir="ltr" className="text-grad"> · {brandName}</span>}
          </h1>
          <p className="mt-2 text-[12.5px] text-dim tnum">{products.length} محصول · ارسال فوری تهران 🚚</p>
        </div>
      </div>

      {/* چیپ دسته‌ها */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
        <Link
          href="/shop"
          className={`pressable flex h-12 shrink-0 items-center gap-2 rounded-2xl px-4 text-[13px] font-bold ${
            !s("category") ? "border border-vio/50 bg-vio/15 text-snow glow-v" : "border border-white/10 bg-white/4 text-mist"
          }`}
        >
          همه
        </Link>
        {cats.map((c) => (
          <Link
            key={c.slug}
            href={s("category") === c.slug ? "/shop" : `/shop?category=${c.slug}`}
            className={`pressable flex h-12 shrink-0 items-center gap-2 rounded-2xl px-4 text-[13px] font-bold ${
              s("category") === c.slug ? "border border-vio/50 bg-vio/15 text-snow glow-v" : "border border-white/10 bg-white/4 text-mist"
            }`}
          >
            <span>{CATS_META[c.slug]?.emoji ?? "✨"}</span>
            {c.name}
          </Link>
        ))}
      </div>

      {/* نوار ابزار */}
      <ShopBar
        initial={initial}
        cats={cats.map((c) => ({ slug: c.slug, name: c.name }))}
        brands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
        priceCeil={priceCeil}
        sortOptions={SORTS}
        count={products.length}
      />

      {/* محصولات */}
      {products.length === 0 ? (
        <div className="card-g mt-6 rounded-[24px] p-14 text-center">
          <p className="text-5xl">😔</p>
          <p className="mt-4 text-[16px] font-extrabold text-snow">چیزی با این فیلترها پیدا نشد</p>
          <p className="mt-2 text-[12.5px] text-dim">فیلترها رو ساده‌تر کن یا همه محصولات رو ببین</p>
          <Link href="/shop" className="pressable mt-6 inline-flex h-12 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-7 text-[13px] font-extrabold text-ink">
            حذف فیلترها
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4 2xl:grid-cols-5">
          {products.map((p: Product, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-[11px] leading-6 text-dim">
        همه کالاهای ویپورا دارای <strong className="text-mist">هولوگرام اصالت</strong> هستند · در صورت مغایرت، وجه کامل برگردانده می‌شود.
      </p>
    </div>
  );
}
