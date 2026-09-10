"use client";

/* معادل AgeCheckModal.vue — تأییدیه ورود +۱۸ با ورود بلورین */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVape } from "@/store/vapeStore";
import { SITE, DISCLAIMER, haptic } from "@/lib/vape";
import { DropletIcon } from "@/components/vapor/VIcons";

export function AgeGate() {
  const { ageOk, hydrated, confirmAge, toast } = useVape();
  const [under, setUnder] = useState(false);

  useEffect(() => {
    if (hydrated && (!ageOk || under)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [hydrated, ageOk, under]);

  if (!hydrated) return null;

  return (
    <AnimatePresence>
      {!ageOk && !under && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[120] overflow-y-auto bg-ink/80 backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="تأیید سن"
        >
          <div className="gate-in mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center px-6 py-10 text-center">
            <span className="floaty grid h-20 w-20 place-items-center rounded-[26px] bg-gradient-to-br from-vio/25 via-ice/15 to-neon/20 text-vio glow-v">
              <DropletIcon size={38} />
            </span>
            <p dir="ltr" className="mt-7 font-display text-2xl font-extrabold tracking-[0.3em] text-snow">
              {SITE.latin}
            </p>
            <h1 className="mt-2 text-[15px] font-semibold text-mist">
              فروشگاه تخصصی {SITE.name} — ویپ، سالت و پاد
            </h1>

            <div className="mt-10 w-full space-y-3 rounded-2xl border border-vio/25 bg-vio/[0.06] p-5 text-right">
              <p className="text-[15px] font-bold text-snow">⚠️ این فروشگاه مخصوص بزرگسالان است</p>
              <p className="text-[13px] leading-7 text-mist">{DISCLAIMER}</p>
              <p className="text-[13px] text-mist">
                با ورود به این وب‌سایت تأیید می‌کنید که <strong className="text-snow">۱۸ سال یا بیشتر</strong> دارید.
              </p>
            </div>

            <div className="mt-8 grid w-full gap-3">
              <button
                onClick={() => {
                  haptic(14);
                  confirmAge();
                  toast("خوش آمدید ☁️");
                }}
                className="pressable h-14 w-full rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink shadow-[0_8px_30px_-8px_rgba(167,139,250,0.7)]"
              >
                بله، بالای ۱۸ سال هستم
              </button>
              <button
                onClick={() => {
                  haptic(6);
                  setUnder(true);
                }}
                className="pressable h-14 w-full rounded-2xl border border-line2 text-[14px] font-semibold text-mist"
              >
                نه، هنوز زیر ۱۸ هستم
              </button>
            </div>
            <p className="mt-6 text-[11px] leading-6 text-dim">
              مصرف دخانیات و نیکوتین برای سلامتی مضر است.
              <br />
              {SITE.phone} · {SITE.tagline}
            </p>
          </div>
        </motion.div>
      )}

      {under && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[120] bg-ink backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="خروج"
        >
          <div className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center px-6 text-center">
            <span className="text-6xl">🚫</span>
            <h2 className="mt-6 font-display text-2xl font-extrabold text-snow">متأسفیم!</h2>
            <p className="mt-3 text-sm leading-7 text-mist">
              دسترسی به این فروشگاه فقط برای افراد بالای ۱۸ سال مجاز است.
              <br />
              لطفاً بعداً و با نظارت والدین بازگردید. 💜
            </p>
            <button
              onClick={() => setUnder(false)}
              className="pressable mt-8 h-12 rounded-2xl border border-line2 px-8 text-sm font-semibold text-mist"
            >
              بازگشت
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
