"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { HERO_IMAGE, HERO_FEATURE } from "@/lib/content";
import { Stars, Button, Magnetic } from "@/components/ui";
import { IcArrowRight } from "@/components/icons";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 900], [0, 160]);
  const yFeature = useTransform(scrollY, [0, 900], [0, -70]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.2]);

  const line = {
    hidden: { y: 46, opacity: 0 },
    show: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE },
    }),
  };

  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden" aria-label="Featured collection">
      {/* background */}
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y: yBg }}>
        <img
          src={HERO_IMAGE}
          alt=""
          className="kb h-[115%] w-full object-cover"
          fetchPriority="high"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/78 to-[#0a0a0c]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-[#0a0a0c]/60" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0c] to-transparent" />

      <div className="wrap relative z-10 grid w-full items-center gap-10 pb-24 pt-16 md:grid-cols-[1.2fr_1fr] md:pt-8">
        {/* copy */}
        <div>
          <motion.p
            variants={line}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-6 flex items-center gap-3 text-[11px] font-semibold tracking-[0.34em] text-gold uppercase"
          >
            <span className="h-px w-10 bg-gold/60" />
            The quiet collection · 2026
          </motion.p>

          <motion.h1
            className="font-display text-[13.5vw] leading-[0.98] text-cream sm:text-6xl md:text-7xl lg:text-[5.2rem]"
            variants={line}
            initial="hidden"
            animate="show"
            custom={1}
          >
            Objects for
            <br />
            the <em className="text-goldsoft not-italic md:italic">quiet hours.</em>
          </motion.h1>

          <motion.p
            variants={line}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-7 max-w-md text-[15px] leading-relaxed text-muted"
          >
            Audio, wearables and home objects, engineered to disappear into a room — and earned there. Built slowly,
            repaired forever, shipped carbon-neutral.
          </motion.p>

          <motion.div variants={line} initial="hidden" animate="show" custom={3} className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button href="/shop" variant="gold" size="lg">
                Shop the collection <IcArrowRight size={16} />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="/categories" variant="outline" size="lg">
                Explore categories
              </Button>
            </Magnetic>
          </motion.div>

          <motion.div
            variants={line}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-4"
          >
            {[
              ["17", "objects in the collection"],
              ["60-day", "quiet trial, no questions"],
              ["7-year", "parts guarantee"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-2xl text-cream tnum">{n}</p>
                <p className="mt-1 text-[11px] tracking-[0.1em] text-faint uppercase">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* feature product */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
          className="relative mx-auto hidden w-full max-w-sm md:block"
          style={reduce ? undefined : { y: yFeature }}
        >
          <Link href="/product/atlas-wireless-headphones" className="group relative block overflow-hidden rounded-2xl border border-line/60">
            <img
              src={HERO_FEATURE}
              alt="Atlas Wireless Headphones"
              className="aspect-[3/4] w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-xl glass px-4 py-3">
              <div>
                <p className="text-[13px] font-semibold text-cream">Atlas Wireless</p>
                <div className="mt-1 flex items-center gap-2">
                  <Stars value={4.8} size={11} />
                  <span className="text-[10px] text-muted tnum">214 reviews</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-faint line-through tnum">$349</p>
                <p className="font-display text-lg text-goldsoft tnum">$279</p>
              </div>
            </div>
          </Link>
          <motion.div
            initial={false}
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-8 top-10 rounded-xl border border-line/70 glass px-4 py-3"
            style={{ opacity: 0.95 }}
          >
            <p className="text-[10px] tracking-[0.2em] text-faint uppercase">Battery</p>
            <p className="font-display text-xl text-cream tnum">60 hrs</p>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        style={reduce ? undefined : { opacity }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.3em] text-faint uppercase">Scroll</span>
        <span className="h-10 w-px overflow-hidden bg-line2">
          <motion.span
            className="block h-4 w-px bg-gold"
            animate={reduce ? undefined : { y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
