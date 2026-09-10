"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useVape } from "@/store/vapeStore";
import { CheckIcon, CloseIcon } from "@/components/vapor/VIcons";

export function Toasts() {
  const { toasts, dismiss } = useVape();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 lg:bottom-8">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 26, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
              t.kind === "ok"
                ? "border-neon/25 bg-[#0c120e]/92 text-neon"
                : "border-blush/25 bg-[#160c14]/92 text-blush"
            }`}
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/8">
              {t.kind === "ok" ? <CheckIcon size={13} sw={2.6} /> : <CloseIcon size={13} sw={2.6} />}
            </span>
            <p className="text-[13px] font-bold text-snow">{t.msg}</p>
            <button onClick={() => dismiss(t.id)} className="mr-1 text-dim" aria-label="بستن پیام">
              <CloseIcon size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
