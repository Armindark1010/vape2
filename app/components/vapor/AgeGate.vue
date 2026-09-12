<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useVape } from "~/composables/useVape";
import { SITE, DISCLAIMER, haptic } from "~/utils/vape";
import { DropletIcon } from "~/components/vapor/VIcons";

const { ageOk, hydrated, confirmAge, toast } = useVape();
const under = ref(false);

const updateOverflow = () => {
  if (typeof document === "undefined") return;
  if (hydrated.value && (!ageOk.value || under.value)) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

watch([hydrated, ageOk, under], updateOverflow);

onMounted(() => {
  updateOverflow();
});

onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});

const onConfirm = () => {
  haptic(14);
  confirmAge();
  toast("خوش آمدید ☁️");
};

const onUnder = () => {
  haptic(6);
  under.value = true;
};
</script>

<template>
  <ClientOnly>
    <div v-if="hydrated">
      <!-- گیت تأیید سن -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-400 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="!ageOk && !under"
          class="fixed inset-0 z-[120] overflow-y-auto bg-ink/80 backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="تأیید سن"
        >
          <div class="gate-in mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center px-6 py-10 text-center">
            <span class="floaty grid h-20 w-20 place-items-center rounded-[26px] bg-gradient-to-br from-vio/25 via-ice/15 to-neon/20 text-vio glow-v">
              <DropletIcon :size="38" />
            </span>
            <p dir="ltr" class="mt-7 font-display text-2xl font-extrabold tracking-[0.3em] text-snow">
              {{ SITE.latin }}
            </p>
            <h1 class="mt-2 text-[15px] font-semibold text-mist">
              فروشگاه تخصصی {{ SITE.name }} — ویپ، سالت و پاد
            </h1>

            <div class="mt-10 w-full space-y-3 rounded-2xl border border-vio/25 bg-vio/[0.06] p-5 text-right">
              <p class="text-[15px] font-bold text-snow">⚠️ این فروشگاه مخصوص بزرگسالان است</p>
              <p class="text-[13px] leading-7 text-mist">{{ DISCLAIMER }}</p>
              <p class="text-[13px] text-mist">
                با ورود به این وب‌سایت تأیید می‌کنید که <strong class="text-snow">۱۸ سال یا بیشتر</strong> دارید.
              </p>
            </div>

            <div class="mt-8 grid w-full gap-3">
              <button
                @click="onConfirm"
                class="pressable h-14 w-full rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink shadow-[0_8px_30px_-8px_rgba(167,139,250,0.7)] cursor-pointer"
              >
                بله، بالای ۱۸ سال هستم
              </button>
              <button
                @click="onUnder"
                class="pressable h-14 w-full rounded-2xl border border-line2 text-[14px] font-semibold text-mist cursor-pointer"
              >
                نه، هنوز زیر ۱۸ هستم
              </button>
            </div>
            <p class="mt-6 text-[11px] leading-6 text-dim">
              مصرف دخانیات و نیکوتین برای سلامتی مضر است.
              <br />
              {{ SITE.phone }} · {{ SITE.tagline }}
            </p>
          </div>
        </div>
      </Transition>

      <!-- صفحه خروج زیر ۱۸ سال -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="under"
          class="fixed inset-0 z-[120] bg-ink backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="خروج"
        >
          <div class="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center px-6 text-center">
            <span class="text-6xl">🚫</span>
            <h2 class="mt-6 font-display text-2xl font-extrabold text-snow">متأسفیم!</h2>
            <p class="mt-3 text-sm leading-7 text-mist">
              دسترسی به این فروشگاه فقط برای افراد بالای ۱۸ سال مجاز است.
              <br />
              لطفاً بعداً و با نظارت والدین بازگردید. 💜
            </p>
            <button
              @click="under = false"
              class="pressable mt-8 h-12 rounded-2xl border border-line2 px-8 text-sm font-semibold text-mist cursor-pointer"
            >
              بازگشت
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>
