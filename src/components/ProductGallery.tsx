"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";

export function ProductGallery({ product: p }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const boxRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const images = p.images.length ? p.images : [""];
  const count = images.length;

  const go = useCallback(
    (dir: number) => {
      setActive((a) => (a + dir + count) % count);
      setZoom(false);
    },
    [count]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go]);

  function onMove(e: React.MouseEvent) {
    if (!boxRef.current || !zoom) return;
    const r = boxRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div>
      <div
        ref={boxRef}
        onMouseMove={onMove}
        onClick={() => setZoom((z) => !z)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setZoom((z) => !z);
        }}
        role="button"
        tabIndex={0}
        aria-label={`View ${p.name}, image ${active + 1} of ${count}. Click to zoom.`}
        className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-card outline-none focus-visible:cursor-zoom-in"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={`${p.name} — view ${active + 1}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: zoom && !reduce ? 1.8 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.45 }, scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
            style={{ transformOrigin: zoom ? origin : "center" }}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        </AnimatePresence>

        <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
          {p.newArrival && <Badge tone="gold">New</Badge>}
          {p.bestSeller && <Badge tone="neutral" className="bg-black/50 backdrop-blur">Best seller</Badge>}
        </div>

        <span
          className={cn(
            "absolute right-4 bottom-4 rounded-full bg-black/55 px-3.5 py-1.5 text-[11px] tracking-[0.14em] text-cream/85 uppercase backdrop-blur transition-opacity duration-300",
            zoom ? "opacity-0" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {zoom ? "Click to zoom out" : "Click to zoom"}
        </span>
      </div>

      {/* thumbnails */}
      <div className="mt-3 flex gap-2.5 overflow-x-auto no-scrollbar" role="tablist" aria-label="Product images">
        {images.map((img, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={active === i}
            aria-label={`View image ${i + 1}`}
            onClick={() => {
              setActive(i);
              setZoom(false);
            }}
            className={cn(
              "relative h-[72px] w-[60px] shrink-0 overflow-hidden rounded-lg border transition-all duration-300",
              active === i ? "border-gold" : "border-line opacity-60 hover:opacity-100"
            )}
          >
            <img src={img} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
