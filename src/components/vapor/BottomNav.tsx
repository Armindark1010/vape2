"use client";

/*
 * MobileBottomNav — نوار پایین اپ‌گونه (معادل MobileBottomNav.vue)
 * خانه / دسته‌بندی‌ها / جستجوی سریع / سبد خرید (با Badge) / حساب کاربری
 * همراه با هدر دسکتاپ و جستجوی تمام‌صفحه لمسی + هپتیک
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useVape } from "@/store/vapeStore";
import { SITE, haptic, BRANDS_LINE } from "@/lib/vape";
import {
  HomeIcon,
  GridIcon,
  SearchIcon,
  BagIcon,
  UserIcon,
  CloseIcon,
  DropletIcon,
} from "@/components/vapor/VIcons";

type Hit = { id: number; slug: string; name: string; price: number; image: string; tagline: string | null };

const ITEMS = [
  { id: "home", label: "خانه", href: "/", Icon: HomeIcon },
  { id: "cats", label: "دسته‌بندی‌ها", href: "/categories", Icon: GridIcon },
  { id: "search", label: "جستجو", action: "search" as const, Icon: SearchIcon },
  { id: "cart", label: "سبد خرید", action: "cart" as const, Icon: BagIcon },
  { id: "acc", label: "حساب", href: "/account", Icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, setCartOpen, hydrated } = useVape();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [busy, setBusy] = useState(false);
  const boxRef = useRef<HTMLInputElement>(null);
  const deb = useRef<number>(0);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (searchOpen) setSearchOpen(false);
  }

  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => boxRef.current?.focus(), 120);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  const search = (term: string) => {
    setQ(term);
    window.clearTimeout(deb.current);
    if (term.trim().length < 2) {
      setHits(null);
      return;
    }
    setBusy(true);
    deb.current = window.setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(term.trim())}`);
        const d = await r.json();
        setHits(Array.isArray(d) ? d : []);
      } catch {
        setHits([]);
      } finally {
        setBusy(false);
      }
    }, 180);
  };

  const go = (slug: string) => {
    setSearchOpen(false);
    router.push(`/product/${slug}`);
  };

  const isActive = (href?: string) => (href && href !== "/" ? pathname.startsWith(href) : pathname === href);

  return (
    <>
      {/* هدر دسکتاپ */}
      <header className="glass sticky top-0 z-50 hidden border-b border-white/8 lg:block">
        <div className="wrap flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="ویپورا">
            <span className="text-vio"><DropletIcon size={22} /></span>
            <span dir="ltr" className="font-extrabold tracking-[0.3em] text-snow">{SITE.latin}</span>
            <span className="rounded-full bg-vio/15 px-2.5 py-1 text-[10px] font-bold text-vio">ویپ و سالت</span>
          </Link>
          <nav className="flex items-center gap-8 text-[13px] font-semibold text-mist">
            <Link href="/" className="hover:text-snow">خانه</Link>
            <Link href="/categories" className="hover:text-snow">دسته‌بندی‌ها</Link>
            <Link href="/categories" className="hover:text-snow">فروشگاه</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="pressable flex h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-[13px] text-mist"
              aria-label="جستجو"
            >
              <SearchIcon size={17} /> جستجو
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="pressable relative grid h-11 w-11 place-items-center rounded-xl border border-white/12 text-snow"
              aria-label={`سبد خرید (${cartCount})`}
            >
              <BagIcon size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-l from-neon to-ice px-1 text-[10px] font-extrabold text-ink">
                  {cartCount}
                </span>
              )}
            </button>
            <Link
              href="/account"
              className="pressable grid h-11 w-11 place-items-center rounded-xl border border-white/12 text-snow transition-colors hover:border-vio/40 hover:text-vio"
              aria-label="حساب کاربری"
            >
              <UserIcon size={19} />
            </Link>
          </div>
        </div>
      </header>

      {/* نوار پایین موبایل */}
      <nav
        className="glass safe-bottom fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 pb-1 lg:hidden"
        aria-label="ناوبری اصلی"
      >
        <div className="mx-auto flex h-[62px] max-w-lg items-stretch justify-around px-1">
          {ITEMS.map((it) => {
            const active = it.href ? isActive(it.href) : false;
            const inner = (
              <>
                <span className="relative">
                  <it.Icon size={23} className={active ? "text-snow" : "text-dim"} sw={active ? 2 : 1.7} />
                  {it.action === "cart" && hydrated && cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 1.6 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2.5 -right-2.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gradient-to-l from-neon to-ice px-1 text-[9.5px] font-extrabold text-ink"
                    >
                      {cartCount > 99 ? "99" : cartCount}
                    </motion.span>
                  )}
                </span>
                <span className={`text-[10px] font-semibold ${active ? "text-snow" : "text-dim"}`}>{it.label}</span>
                {active && <motion.span layoutId="navdot" className="absolute bottom-0.5 h-1 w-1 rounded-full bg-vio" />}
              </>
            );

            if (it.href) {
              return (
                <Link
                  key={it.id}
                  href={it.href}
                  onClick={() => haptic(8)}
                  aria-label={it.label}
                  aria-current={active ? "page" : undefined}
                  className="pressable relative flex w-[20%] flex-col items-center justify-center gap-1 rounded-2xl"
                >
                  {inner}
                </Link>
              );
            }

            return (
              <button
                key={it.id}
                type="button"
                onClick={() => {
                  haptic(8);
                  if (it.action === "cart") setCartOpen(true);
                  else if (it.action === "search") setSearchOpen(true);
                }}
                aria-label={it.label}
                className="pressable relative flex w-[20%] flex-col items-center justify-center gap-1 rounded-2xl"
              >
                {inner}
              </button>
            );
          })}
        </div>
      </nav>

      {/* جستجوی سریع تمام‌صفحه */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] overflow-y-auto bg-ink/90 backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="جستجوی سریع"
          >
            <div className="mx-auto min-h-svh w-full max-w-2xl px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-28">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <SearchIcon size={20} className="absolute top-1/2 right-4 -translate-y-1/2 text-dim" />
                  <input
                    ref={boxRef}
                    value={q}
                    onChange={(e) => search(e.target.value)}
                    placeholder="دنبال چه طعمی هستی؟ (انگور یخ، بلوبری…)"
                    className="input h-14 rounded-2xl pr-12 text-[15px]"
                    aria-label="جستجو"
                  />
                </div>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="pressable grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/12 text-mist"
                  aria-label="بستن جستجو"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              {q.trim().length < 2 ? (
                <div className="mt-8">
                  <p className="mb-3 text-[12px] font-bold text-dim">جستجوهای پرطرفدار</p>
                  <div className="flex flex-wrap gap-2">
                    {["انگور یخ", "بلوبری", "تنباکو", "نعناع", "سالت ۵۰", "پاد ۶۰۰۰"].map((s) => (
                      <button
                        key={s}
                        onClick={() => search(s)}
                        className="pressable rounded-full border border-white/12 bg-white/4 px-4 py-2.5 text-[13px] text-mist"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="mt-10 mb-3 text-[12px] font-bold text-dim">برندهای معتبر</p>
                  <div className="flex flex-wrap gap-2">
                    {BRANDS_LINE.map((b) => (
                      <span key={b} dir="ltr" className="rounded-lg bg-white/4 px-3 py-2 text-[12px] font-bold tracking-wider text-mist">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  {busy ? (
                    <div className="grid grid-cols-2 gap-4 pt-2" aria-busy="true">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-56 w-full" />
                      ))}
                    </div>
                  ) : hits && hits.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/12 p-10 text-center">
                      <p className="text-4xl">🔍</p>
                      <p className="mt-3 text-sm font-semibold text-mist">چیزی پیدا نشد</p>
                      <p className="mt-1 text-[12px] text-dim">املا را بررسی کن یا کلمه دیگری را امتحان کن</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {(hits ?? []).map((h, i) => (
                        <button key={h.id} onClick={() => go(h.slug)} className="text-right">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(i * 0.04, 0.3) }}
                            className="card-g overflow-hidden rounded-2xl"
                          >
                            <img src={h.image} alt={h.name} className="aspect-[4/5] w-full object-cover" loading="lazy" />
                          </motion.div>
                          <p dir="ltr" className="mt-2 truncate text-right text-[13px] font-bold text-snow">
                            {h.name}
                          </p>
                          <p className="mt-0.5 text-[11px] font-semibold text-neon tnum">{h.price.toLocaleString("en-US")} تومان</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
