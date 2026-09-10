"use client";

/* BottomSheet — کشوی پایین‌رو (معادل Bottom Sheet در اندروید)
 * با درگ/سوایپ رو به پایین برای بستن + اسنپ نرم + پشتیبانی از safe-area
 */
import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BottomSheet({
  open,
  onClose,
  children,
  label,
  snap = "88svh",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
  snap?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] w-full bg-black/65 backdrop-blur-[3px]"
            aria-label={`بستن ${label}`}
          />
          <motion.div
            initial={{ y: "104%" }}
            animate={{ y: 0 }}
            exit={{ y: "104%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.55 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="safe-bottom fixed inset-x-0 bottom-0 z-[81] flex flex-col rounded-t-[26px] border-t border-white/10 bg-[#0e0e13]/95 backdrop-blur-2xl sheet-shadow"
            style={{ height: snap, maxHeight: "92svh" }}
          >
            {/* دستگیره درگ */}
            <div className="flex shrink-0 cursor-grab touch-none items-center justify-center pt-3 pb-1 active:cursor-grabbing" aria-hidden>
              <span className="h-1.5 w-12 rounded-full bg-white/20" />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
