<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from "vue";
import { useVape } from "~/composables/useVape";
import { money, haptic } from "~/utils/vape";
import type { Product } from "~/types";
import IceMeter from "~/components/vapor/IceMeter.vue";
import {
  CloseIcon,
  ZapIcon,
  CheckIcon,
  DropletIcon,
  StarIcon,
  PlusIcon,
  FlameIcon,
  ShieldIcon,
  ArrowLeftIcon,
} from "~/components/vapor/VIcons";

export interface ProductRecommendation {
  product: Product;
  matchScore: number;
  reason: string;
  suggestedFlavor?: string;
  coolingLevel?: number;
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  products?: ProductRecommendation[];
}

const { add, setCartOpen } = useVape();

const isOpen = ref(false);
const activeTab = ref<"wizard" | "chat">("wizard");
const inputMessage = ref("");
const isTyping = ref(false);
const chatContainer = ref<HTMLDivElement | null>(null);

// Wizard State
const wizard = ref<{
  goal: "smoke" | "hookah" | "newbie" | "pro";
  category: string;
  taste: "fruity" | "ice" | "dessert" | "tobacco";
  cooling: number;
}>({
  goal: "smoke",
  category: "salts",
  taste: "fruity",
  cooling: 3,
});

const goals: { id: "smoke" | "hookah" | "newbie" | "pro"; label: string; sub: string; emoji: string }[] = [
  { id: "smoke", label: "ترک سیگار", sub: "گیرایی و نیکوتین قوی", emoji: "🚬" },
  { id: "hookah", label: "جایگزین قلیان", sub: "دود زیاد و طعم میوه‌ای", emoji: "💨" },
  { id: "newbie", label: "اولین بار / تفریحی", sub: "ساده بدون تنظیمات", emoji: "🌱" },
  { id: "pro", label: "کاربر با سابقه", sub: "طعم‌های پیچیده و کاستوم", emoji: "⚡" },
];

const tastes: { id: "fruity" | "ice" | "dessert" | "tobacco"; label: string; desc: string; icon: string }[] = [
  { id: "fruity", label: "میوه‌ای و استوایی", desc: "انبه، بلوبری، هلو، هندوانه", icon: "🥭" },
  { id: "ice", label: "خنک و آیس (Ice)", desc: "یخ، نعناع، طراوت شدید گلو", icon: "❄️" },
  { id: "tobacco", label: "تنباکویی و سیگاری", desc: "تنباکو کوبایی، وانیل تنباکو", icon: "🍂" },
  { id: "dessert", label: "دسری و شیرین", desc: "کیک خامه‌ای، کارامل، کاستارد", icon: "🧁" },
];

const messages = ref<Message[]>([
  {
    id: "welcome-1",
    sender: "bot",
    text: "سلام! من **دستیار هوشمند ویپ‌لب (VAPELAB)** هستم ☁️✨\nمی‌تونم بر اساس نیاز، ذائقه و بودجه شما دقیق‌ترین طعم و دستگاه رو بهتون پیشنهاد بدم یا به هر سوالتون درباره ویپینگ پاسخ بدم.",
    time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
  },
]);

const quickPrompts = [
  "ارزان‌ترین پادهای موجود 🏷️",
  "یه سالت میوه‌ای فوق خنک ❄️",
  "بهترین سالت برای ترک سیگار 🍂",
  "پرفروش‌ترین پادهای ۱۰۰۰۰ پاف 🔥",
  "تفاوت سالت با جویس چیه؟ 🤔",
];

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const openAssistant = () => {
  haptic(8);
  isOpen.value = true;
  scrollToBottom();
};

const closeAssistant = () => {
  isOpen.value = false;
};

// ارسال به سرور
const sendMessage = async (textToSend?: string) => {
  const text = (textToSend || inputMessage.value).trim();
  if (!text || isTyping.value) return;

  inputMessage.value = "";
  activeTab.value = "chat";

  // افزودن پیام کاربر
  messages.value.push({
    id: `u-${Date.now()}`,
    sender: "user",
    text,
    time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
  });

  isTyping.value = true;
  scrollToBottom();

  try {
    const res = await $fetch<{
      reply: string;
      products?: { product: Product; matchScore: number; reason: string }[];
    }>("/api/ai/chat", {
      method: "POST",
      body: { message: text },
    });

    messages.value.push({
      id: `b-${Date.now()}`,
      sender: "bot",
      text: res.reply,
      products: res.products,
      time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    });
  } catch (err) {
    messages.value.push({
      id: `b-${Date.now()}`,
      sender: "bot",
      text: "متاسفانه در برقراری ارتباط مشکلی پیش اومد، لطفاً دوباره امتحان کن یا پیام دیگه‌ای بفرست.",
      time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};

// اجرای کوییز هوشمند
const submitWizard = async () => {
  isTyping.value = true;
  activeTab.value = "chat";
  haptic(14);

  const goalText = {
    smoke: "ترک سیگار با گیرایی مشابه",
    hookah: "جایگزین قلیان با طعم پردود",
    newbie: "مبتدی و ساده‌ترین تجربه",
    pro: "ویپر با سابقه و دود حجیم",
  }[wizard.value.goal];

  const tasteText = {
    fruity: "میوه‌ای و استوایی 🍓",
    ice: "خنک و نعنایی / آیس ❄️",
    dessert: "دسری و کاراملی 🧁",
    tobacco: "تنباکویی کلاسیک 🍂",
  }[wizard.value.taste];

  messages.value.push({
    id: `u-${Date.now()}`,
    sender: "user",
    text: `🎯 مشخصات دلخواه من:\n• هدف: ${goalText}\n• طعم: ${tasteText}\n• میزان خنکی: ${wizard.value.cooling} از ۵`,
    time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
  });

  scrollToBottom();

  try {
    const res = await $fetch<{
      reply: string;
      products?: { product: Product; matchScore: number; reason: string }[];
    }>("/api/ai/chat", {
      method: "POST",
      body: { wizard: wizard.value },
    });

    messages.value.push({
      id: `b-${Date.now()}`,
      sender: "bot",
      text: res.reply,
      products: res.products,
      time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    });
  } catch {
    messages.value.push({
      id: `b-${Date.now()}`,
      sender: "bot",
      text: "خطا در تحلیل هوشمند، لطفاً دوباره تلاش کنید.",
      time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};

const handleQuickAdd = (p: Product) => {
  haptic(10);
  add({
    id: p.id,
    slug: p.slug,
    name: p.name,
    img: p.images[0] ?? "",
    price: p.discountPrice ?? p.price,
    oldPrice: p.discountPrice != null ? p.price : null,
    stock: p.stock,
  });
};
</script>

<template>
  <div>
    <!-- دکمه شناور مشاور هوشمند (FAB) -->
    <button
      @click="openAssistant"
      class="fixed bottom-20 left-4 lg:bottom-7 lg:left-7 z-[60] flex items-center gap-2.5 rounded-full border border-vio/50 bg-gradient-to-r from-[#17142b]/95 to-[#0e0e13]/95 p-2.5 pe-4 text-snow shadow-[0_8px_30px_rgba(167,139,250,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-vio hover:shadow-[0_10px_35px_rgba(167,139,250,0.6)] group cursor-pointer"
      aria-label="مشاور هوشمند طعم"
    >
      <span class="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-tr from-vio to-ice text-ink font-bold shadow-md">
        <span class="pulse-ring absolute inset-0 rounded-full bg-vio/40" />
        <ZapIcon :size="20" class="relative z-10" />
      </span>
      <div class="text-right">
        <p class="text-[12.5px] font-extrabold leading-tight text-snow flex items-center gap-1">
          مشاور هوشمند
          <span class="h-2 w-2 rounded-full bg-neon animate-pulse" />
        </p>
        <p class="text-[10px] text-vio font-bold">پیشنهاد طعم و نیکوتین</p>
      </div>
    </button>

    <!-- مودال / پنل هوشمند دستیار -->
    <Teleport to="body">
      <div v-if="isOpen" class="relative z-[95]">
        <!-- Backdrop -->
        <Transition
          enter-active-class="transition-opacity duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            class="fixed inset-0 bg-black/70 backdrop-blur-[6px]"
            @click="closeAssistant"
          />
        </Transition>

        <!-- Main Window -->
        <Transition
          enter-active-class="transition-all duration-300 cubic-bezier(0.22, 1, 0.36, 1)"
          enter-from-class="translate-y-full lg:translate-y-8 lg:opacity-0 lg:scale-95"
          enter-to-class="translate-y-0 lg:opacity-100 lg:scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="translate-y-0 lg:opacity-100 lg:scale-100"
          leave-to-class="translate-y-full lg:translate-y-8 lg:opacity-0 lg:scale-95"
        >
          <div
            class="fixed inset-x-0 bottom-0 lg:inset-auto lg:bottom-6 lg:left-6 lg:w-[460px] h-[85vh] lg:h-[650px] max-h-[90vh] flex flex-col rounded-t-[30px] lg:rounded-[28px] border border-vio/30 bg-[#0d0d12]/98 shadow-[0_20px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden"
          >
            <!-- Header -->
            <div class="relative px-5 py-4 border-b border-white/10 bg-gradient-to-r from-vio/15 via-transparent to-ice/10 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-vio to-ice text-ink shadow-lg">
                  <ZapIcon :size="20" />
                  <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0e0e13] bg-neon" />
                </div>
                <div>
                  <h3 class="text-[14.5px] font-extrabold text-snow flex items-center gap-1.5">
                    دستیار و استعدادیاب طعم
                    <span class="rounded-lg bg-vio/20 px-2 py-0.5 text-[9.5px] font-bold text-vio">AI</span>
                  </h3>
                  <p class="text-[11px] text-mist">پاسخگویی آنی و تحلیل اختصاصی ذائقه</p>
                </div>
              </div>

              <button
                @click="closeAssistant"
                class="pressable grid h-9 w-9 place-items-center rounded-xl bg-white/6 text-dim hover:text-snow cursor-pointer"
                aria-label="بستن"
              >
                <CloseIcon :size="16" />
              </button>
            </div>

            <!-- Tab Switcher -->
            <div class="flex border-b border-white/8 bg-white/[0.02] p-1.5 gap-1.5">
              <button
                @click="activeTab = 'wizard'"
                class="flex-1 py-2 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                :class="activeTab === 'wizard' ? 'bg-vio/20 text-vio border border-vio/40 shadow-sm' : 'text-dim hover:text-mist'"
              >
                <FlameIcon :size="14" />
                تست انتخاب طعم (Wizard)
              </button>
              <button
                @click="activeTab = 'chat'"
                class="flex-1 py-2 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                :class="activeTab === 'chat' ? 'bg-vio/20 text-vio border border-vio/40 shadow-sm' : 'text-dim hover:text-mist'"
              >
                <DropletIcon :size="14" />
                گفتگوی آزاد با هوش مصنوعی
              </button>
            </div>

            <!-- Tab 1: Wizard Questionnaire -->
            <div v-if="activeTab === 'wizard'" class="flex-1 overflow-y-auto p-5 space-y-6">
              <!-- Step 1: Goal -->
              <div>
                <label class="block text-[12.5px] font-extrabold text-snow mb-2.5">
                  ۱. هدف اصلی شما از مصرف ویپ چیست؟
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="g in goals"
                    :key="g.id"
                    @click="wizard.goal = g.id"
                    class="pressable p-3 rounded-2xl border text-right transition-all cursor-pointer"
                    :class="wizard.goal === g.id ? 'border-vio bg-vio/15 glow-v' : 'border-white/10 bg-white/3 text-mist'"
                  >
                    <span class="text-xl block mb-1">{{ g.emoji }}</span>
                    <p class="text-[13px] font-extrabold text-snow">{{ g.label }}</p>
                    <p class="text-[10px] text-dim mt-0.5">{{ g.sub }}</p>
                  </button>
                </div>
              </div>

              <!-- Step 2: Taste -->
              <div>
                <label class="block text-[12.5px] font-extrabold text-snow mb-2.5">
                  ۲. سلیقه طعمی مورد علاقه شما:
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="t in tastes"
                    :key="t.id"
                    @click="wizard.taste = t.id"
                    class="pressable p-3 rounded-2xl border text-right transition-all cursor-pointer"
                    :class="wizard.taste === t.id ? 'border-neon bg-neon/12 glow-g' : 'border-white/10 bg-white/3 text-mist'"
                  >
                    <span class="text-xl block mb-1">{{ t.icon }}</span>
                    <p class="text-[13px] font-extrabold text-snow">{{ t.label }}</p>
                    <p class="text-[10.5px] text-dim mt-0.5">{{ t.desc }}</p>
                  </button>
                </div>
              </div>

              <!-- Step 3: Cooling / Ice level -->
              <div class="rounded-2xl border border-white/10 bg-white/3 p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[12.5px] font-extrabold text-snow">۳. میزان خنکی و حس یخ (Ice Level):</span>
                  <IceMeter :level="wizard.cooling" />
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  v-model.number="wizard.cooling"
                  class="w-full accent-[#7dd3fc] cursor-pointer"
                />
                <div class="flex justify-between text-[10.5px] text-dim mt-1.5">
                  <span>بدون خنکی (گرم)</span>
                  <span>متعادل (آیس استاندارد)</span>
                  <span>یخ قطبی ❄️🔥</span>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                @click="submitWizard"
                class="pressable w-full h-14 rounded-2xl bg-gradient-to-l from-vio to-ice text-ink text-[14.5px] font-extrabold glow-v flex items-center justify-center gap-2 cursor-pointer"
              >
                <ZapIcon :size="18" :sw="2.4" />
                یافتن بهترین طعم و دستگاه من
              </button>
            </div>

            <!-- Tab 2: Free Chat & Stream -->
            <div v-else class="flex-1 flex flex-col min-h-0">
              <!-- Chat Container -->
              <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
                <div
                  v-for="msg in messages"
                  :key="msg.id"
                  class="flex flex-col gap-1.5"
                  :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
                >
                  <div
                    class="max-w-[88%] rounded-[20px] p-3.5 text-[13px] leading-6"
                    :class="
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-vio to-vio/80 text-white rounded-br-none shadow-md'
                        : 'card-g text-snow rounded-bl-none border border-white/12'
                    "
                  >
                    <p class="whitespace-pre-line">{{ msg.text }}</p>

                    <!-- Embedded Product Recommendations -->
                    <div v-if="msg.products && msg.products.length > 0" class="mt-3.5 space-y-2.5 pt-2 border-t border-white/10">
                      <div
                        v-for="rec in msg.products"
                        :key="rec.product.id"
                        class="p-3 rounded-xl bg-[#0e0e14]/90 border border-white/10 flex flex-col gap-2 transition-all hover:border-vio/40"
                      >
                        <div class="flex gap-3 items-center">
                          <NuxtLink :to="`/product/${rec.product.slug}`" @click="closeAssistant" class="shrink-0 overflow-hidden rounded-lg">
                            <img :src="rec.product.images[0]" :alt="rec.product.name" class="h-16 w-14 object-cover rounded-lg border border-white/10" />
                          </NuxtLink>
                          <div class="min-w-0 flex-1">
                            <div class="flex items-center justify-between gap-1">
                              <NuxtLink :to="`/product/${rec.product.slug}`" @click="closeAssistant" dir="ltr" class="text-[12.5px] font-extrabold text-snow truncate hover:text-vio">
                                {{ rec.product.name }}
                              </NuxtLink>
                              <span class="shrink-0 rounded-md bg-neon/15 border border-neon/30 px-1.5 py-0.5 text-[10px] font-extrabold text-neon">
                                ٪{{ rec.matchScore }} تطابق
                              </span>
                            </div>
                            <p class="text-[10.5px] text-vio font-medium mt-0.5">{{ rec.reason }}</p>

                            <!-- Suggested flavor chip if available -->
                            <div v-if="rec.suggestedFlavor" class="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span class="text-[9.5px] text-mist">طعم پیشنهادی:</span>
                              <span class="text-[10px] font-bold text-ice bg-ice/10 px-2 py-0.5 rounded-full border border-ice/25">
                                {{ rec.suggestedFlavor }}
                              </span>
                            </div>

                            <div class="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5">
                              <div class="flex items-center gap-1.5">
                                <span class="text-[12px] font-extrabold text-snow tnum">{{ money(rec.product.discountPrice ?? rec.product.price) }}</span>
                                <span v-if="rec.product.discountPrice" class="text-[10px] text-dim line-through tnum">{{ money(rec.product.price) }}</span>
                              </div>
                              <button
                                @click="handleQuickAdd(rec.product)"
                                class="pressable px-3 py-1 rounded-lg bg-gradient-to-l from-vio to-ice text-ink text-[11px] font-extrabold flex items-center gap-1 shadow-sm hover:brightness-110 cursor-pointer"
                              >
                                <PlusIcon :size="13" :sw="2.6" /> خرید مستقیم
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span class="text-[9.5px] text-dim px-1">{{ msg.time }}</span>
                </div>

                <!-- Typing indicator -->
                <div v-if="isTyping" class="flex items-center gap-2 text-mist text-[12px] card-g p-3 rounded-2xl w-fit">
                  <span class="flex gap-1">
                    <span class="h-2 w-2 rounded-full bg-vio animate-bounce" style="animation-delay: 0ms;" />
                    <span class="h-2 w-2 rounded-full bg-ice animate-bounce" style="animation-delay: 150ms;" />
                    <span class="h-2 w-2 rounded-full bg-neon animate-bounce" style="animation-delay: 300ms;" />
                  </span>
                  در حال تحلیل هوشمند و آماده‌سازی پیشنهاد...
                </div>
              </div>

              <!-- Quick Prompts Chips -->
              <div class="px-4 py-2 overflow-x-auto no-scrollbar flex gap-2 border-t border-white/6 bg-white/[0.01]">
                <button
                  v-for="qp in quickPrompts"
                  :key="qp"
                  @click="sendMessage(qp)"
                  class="pressable shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-mist hover:text-snow hover:border-vio/40 cursor-pointer"
                >
                  {{ qp }}
                </button>
              </div>

              <!-- Chat Input Bar -->
              <form @submit.prevent="sendMessage()" class="p-3 border-t border-white/10 flex items-center gap-2 bg-[#09090b]">
                <input
                  v-model="inputMessage"
                  placeholder="طعم، نیکوتین یا دستگاه مدنظرت رو بنویس..."
                  class="input h-12 text-[13px] rounded-2xl flex-1 px-4"
                  :disabled="isTyping"
                />
                <button
                  type="submit"
                  :disabled="!inputMessage.trim() || isTyping"
                  class="pressable h-12 w-12 grid place-items-center rounded-2xl bg-gradient-to-l from-vio to-ice text-ink font-bold disabled:opacity-40 cursor-pointer"
                  aria-label="ارسال"
                >
                  <ArrowLeftIcon :size="18" :sw="2.6" />
                </button>
              </form>
            </div>
          </div>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>
