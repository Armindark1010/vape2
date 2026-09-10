"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/store";
import { NAV_LINKS } from "@/lib/content";
import {
  IcLogo,
  IcSearch,
  IcHeart,
  IcCart,
  IcUser,
  IcMenu,
  IcClose,
  IcInstagram,
  IcX,
  IcYoutube,
} from "@/components/icons";
import { Button } from "@/components/ui";

function CountBubble({ n, className }: { n: number; className?: string }) {
  if (n <= 0) return null;
  return (
    <span className={cn("absolute -top-1 -right-1 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-gold px-1 text-[9.5px] font-bold text-[#0c0c0e]", className)}>
      <motion.span key={n} initial={{ scale: 1.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
        {n > 99 ? "99+" : n}
      </motion.span>
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, wishlist, setCartOpen, hydrated } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const iconBtn =
    "relative grid h-10 w-10 place-items-center rounded-full text-cream/80 transition-all duration-300 hover:bg-white/[0.06] hover:text-cream";

  return (
    <>
      <div className="glass hairline-b relative z-40">
        <p className="wrap flex h-9 items-center justify-center gap-2 text-[11px] tracking-[0.08em] text-muted">
          <span className="hidden text-gold sm:inline">•</span>
          Free shipping over $300 · 60-day quiet trial ·
          <Link href="/shop" className="text-cream/90 underline-offset-4 hover:underline">
            WELCOME10
          </Link>
          for 10% off your first order
          <span className="hidden text-gold sm:inline">•</span>
        </p>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled ? "glass hairline-b py-0" : "bg-transparent py-3 md:py-4"
        )}
      >
        <div className={cn("wrap flex items-center justify-between transition-all duration-500", scrolled && "py-2.5")}>
          {/* left: mobile menu + logo */}
          <div className="flex items-center gap-2">
            <button
              className={cn(iconBtn, "md:hidden -ml-2")}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <IcMenu />
            </button>
            <Link href="/" className="group flex items-center gap-2.5" aria-label="NOCTURNE home">
              <span className="text-gold transition-transform duration-500 group-hover:rotate-[30deg]">
                <IcLogo size={24} />
              </span>
              <span className="font-display text-[17px] tracking-[0.42em] text-cream">NOCTURNE</span>
            </Link>
          </div>

          {/* center links */}
          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => {
              const active = l.href.includes("?") ? false : pathname === l.href || (l.href === "/shop" && pathname.startsWith("/shop"));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  data-active={active}
                  className="link-under text-[13px] font-medium tracking-[0.06em] text-cream/75 transition-colors hover:text-cream"
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* right actions */}
          <div className="flex items-center gap-0.5 md:gap-1.5">
            <Link href="/search" className={iconBtn} aria-label="Search">
              <IcSearch />
            </Link>
            <Link href="/wishlist" className={cn(iconBtn, "hidden sm:grid")} aria-label={`Wishlist, ${wishlist.length} items`}>
              <IcHeart filled={hydrated && wishlist.length > 0} />
              <CountBubble n={wishlist.length} />
            </Link>
            <button className={iconBtn} onClick={() => setCartOpen(true)} aria-label={`Cart, ${cartCount} items`}>
              <IcCart />
              <CountBubble n={cartCount} />
            </button>
            <Link href="/account" className={cn(iconBtn, "hidden sm:grid")} aria-label="Account">
              <IcUser />
            </Link>
          </div>
        </div>
      </header>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-[4px] md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-[61] flex w-[86%] max-w-sm flex-col bg-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
              <div className="hairline-b flex items-center justify-between px-6 py-5">
                <span className="flex items-center gap-2 text-gold">
                  <IcLogo size={20} />
                  <span className="font-display text-sm tracking-[0.4em] text-cream">NOCTURNE</span>
                </span>
                <button onClick={() => setMobileOpen(false)} className={iconBtn} aria-label="Close menu">
                  <IcClose />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Mobile">
                <ul className="space-y-1">
                  {[{ label: "Home", href: "/" }, ...NAV_LINKS, { label: "Search", href: "/search" }, { label: "Wishlist", href: "/wishlist" }, { label: "Cart", href: "/cart" }, { label: "Account", href: "/account" }, { label: "Contact", href: "/contact" }, { label: "FAQ", href: "/faq" }].map((l, i) => {
                    const active = l.href !== "/" && pathname.startsWith(l.href.split("?")[0]) && l.href !== "/shop?sort=newest";
                    return (
                      <motion.li
                        key={l.href}
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
                      >
                        <Link
                          href={l.href}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-3 py-3 font-display text-[22px] transition-colors",
                            active ? "text-goldsoft" : "text-cream/85 hover:text-cream"
                          )}
                        >
                          {l.label}
                          {active && <span className="h-1 w-1 rounded-full bg-gold" />}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                <p className="mt-10 mb-3 text-[10px] font-semibold tracking-[0.28em] text-faint uppercase">Shop by category</p>
                <div className="flex flex-wrap gap-2">
                  {["audio", "wearables", "workspace", "home", "travel"].map((c) => (
                    <Link
                      key={c}
                      href={`/shop?category=${c}`}
                      className="rounded-full border border-line px-4 py-2 text-xs capitalize text-muted transition-colors hover:border-gold/40 hover:text-cream"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="hairline-t flex items-center justify-between px-6 py-5">
                <span className="text-[11px] tracking-[0.14em] text-faint">© 2026 NOCTURNE</span>
                <div className="flex gap-1 text-muted">
                  <span className="grid h-9 w-9 place-items-center"><IcInstagram size={16} /></span>
                  <span className="grid h-9 w-9 place-items-center"><IcX size={16} /></span>
                  <span className="grid h-9 w-9 place-items-center"><IcYoutube size={16} /></span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
