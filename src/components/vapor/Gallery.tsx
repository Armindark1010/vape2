"use client";

/* گالری تصاویر با انگشت‌شستی (Touch) — سوایپ بین عکس‌ها */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon } from "@/components/vapor/VIcons";
import { haptic } from "@/lib/vape";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const imgs = images.length ? images : [""];
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [startX, setStartX] = useState<number | null>(null);

  const go = (d: number) => {
    haptic(5);
    setDir(d);
    setI((x) => (x + d + imgs.length) % imgs.length);
  };

  return (
    <div>
      <div
        className="relative touch-pan-y overflow-hidden rounded-[24px] border border-white/10 bg-panel"
        onTouchStart={(e) => setStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (startX == null) return;
          const dx = e.changedTouches[0].clientX - startX;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          setStartX(null);
        }}
        onMouseDown={(e) => setStartX(e.clientX)}
        onMouseUp={(e) => {
          if (startX == null) return;
          const dx = e.clientX - startX;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          setStartX(null);
        }}
      >
        <div className="aspect-[4/5] overflow-hidden">
          <AnimatePresence mode="popLayout" custom={dir}>
            <motion.img
              key={i}
              src={imgs[i]}
              alt={`${name} — عکس ${i + 1}`}
              initial={{ x: dir * 90, opacity: 0, scale: 1.02 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: dir * -90, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {imgs.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="عکس قبلی"
              className="pressable absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/55 text-snow backdrop-blur"
            >
              <ChevronLeftIcon size={18} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="عکس بعدی"
              className="pressable absolute top-1/2 left-3 grid h-11 w-11 -translate-y-1/2 rotate-180 place-items-center rounded-full bg-ink/55 text-snow backdrop-blur"
            >
              <ChevronLeftIcon size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {imgs.map((_, x) => (
                <button
                  key={x}
                  onClick={() => setI(x)}
                  aria-label={`عکس ${x + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${x === i ? "w-5 bg-vio" : "w-1.5 bg-white/35"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* بندانگشتی */}
      {imgs.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {imgs.map((img, x) => (
            <button
              key={x}
              onClick={() => {
                setDir(x > i ? 1 : -1);
                setI(x);
              }}
              aria-label={`مشاهده عکس ${x + 1}`}
              className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${x === i ? "border-vio" : "border-transparent opacity-55"}`}
            >
              <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
