<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { OrderView } from "~/types";
import { money, haptic } from "~/utils/vape";
import {
  CheckIcon,
  ShieldIcon,
  DropletIcon,
  ChevronLeftIcon,
  ArrowLeftIcon,
} from "~/components/vapor/VIcons";

const route = useRoute();
const router = useRouter();

const orderId = computed(() => String(route.params.id || ""));
const queryStatus = computed(() => String(route.query.status || ""));

const order = ref<OrderView | null>(null);
const loading = ref(true);
const errorMsg = ref("");

useSeoMeta({
  title: computed(() => (order.value ? `فاکتور رسمی سفارش ${order.value.number} · ویپ‌لب` : "فاکتور سفارش")),
  robots: "noindex, nofollow",
});

const fetchOrder = async () => {
  if (!orderId.value) {
    errorMsg.value = "شماره سفارش مشخص نیست.";
    loading.value = false;
    return;
  }
  try {
    const data = await $fetch<OrderView>(`/api/orders?number=${orderId.value}`);
    order.value = data;
  } catch {
    errorMsg.value = "فاکتور سفارش مورد نظر یافت نشد.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrder();
});

const isCod = computed(() => queryStatus.value === "cod" || order.value?.paymentGateway === "cod");
const isPaid = computed(() => {
  if (isCod.value) return false;
  if (queryStatus.value === "success") return true;
  return order.value?.paymentStatus === "paid";
});

const printInvoice = () => {
  haptic(15);
  if (typeof window !== "undefined") {
    window.print();
  }
};

const goToPayment = () => {
  if (order.value) {
    router.push(`/payment/gateway?order=${order.value.number}`);
  }
};

const formatDate = (isoStr?: string) => {
  if (!isoStr) return "لحظاتی پیش";
  try {
    const d = new Date(isoStr);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return isoStr;
  }
};
</script>

<template>
  <div class="wrap pt-6 pb-16 min-h-screen text-snow selection:bg-vio selection:text-white" dir="rtl">
    <!-- وضعیت بارگذاری -->
    <div v-if="loading" class="py-24 text-center">
      <div class="mx-auto h-12 w-12 rounded-full border-2 border-vio border-t-transparent animate-spin" />
      <p class="mt-4 text-[13.5px] text-mist">در حال بارگذاری فاکتور رسمی...</p>
    </div>

    <!-- وضعیت خطا -->
    <div v-else-if="errorMsg || !order" class="max-w-md mx-auto py-20 text-center">
      <div class="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20">
        <p class="text-[14px] font-bold text-rose-400">{{ errorMsg || "فاکتور یافت نشد" }}</p>
        <NuxtLink to="/shop" class="mt-5 inline-block rounded-xl bg-white/10 px-6 py-2.5 text-[13px] font-bold text-snow hover:bg-white/15 transition">
          بازگشت به فروشگاه
        </NuxtLink>
      </div>
    </div>

    <!-- بدنه فاکتور دیجیتال رسمی -->
    <div v-else class="max-w-3xl mx-auto space-y-6">
      <!-- نوار اعلان وضعیت پرداخت بالا -->
      <div
        class="print:hidden rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl transition"
        :class="[
          isPaid
            ? 'bg-gradient-to-l from-emerald-950/80 to-teal-900/60 border border-emerald-500/40'
            : isCod
            ? 'bg-gradient-to-l from-blue-950/80 to-cyan-950/60 border border-cyan-500/40'
            : 'bg-gradient-to-l from-rose-950/80 to-amber-950/60 border border-rose-500/40'
        ]"
      >
        <div class="flex items-center gap-3">
          <span
            class="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
            :class="[
              isPaid
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : isCod
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            ]"
          >
            <CheckIcon v-if="isPaid || isCod" :size="24" :sw="2.6" />
            <span v-else class="text-[18px] font-black">!</span>
          </span>
          <div>
            <h2
              class="text-[14.5px] font-black"
              :class="isPaid ? 'text-emerald-300' : isCod ? 'text-cyan-300' : 'text-rose-300'"
            >
              {{ isPaid ? "پرداخت آنلاین موفقیت‌آمیز · سفارش نهایی و تایید شد" : isCod ? "سفارش ثبت شد · پرداخت در محل با کارتخوان هنگام تحویل" : "پرداخت سفارش معلق یا ناموفق است" }}
            </h2>
            <p class="text-[12px] text-mist mt-0.5">
              {{ isPaid ? `شماره تراکنش بانکی (RRN): ${order.paymentRef || 'تایید شاپرک'}` : isCod ? "سفارش شما در صف آماده‌سازی و ارسال با پیک اکسپرس قرار گرفت و مبلغ سفارش درب محل دریافت می‌شود." : "می‌توانید مجدداً وارد درگاه پرداخت شده و سفارش خود را تکمیل کنید." }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="!isPaid && !isCod"
            type="button"
            class="h-10 px-5 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-400 text-ink font-black text-[12.5px] hover:opacity-90 transition cursor-pointer"
            @click="goToPayment"
          >
            پرداخت مجدد از درگاه
          </button>
          <NuxtLink
            :to="`/track?order=${order.number}`"
            class="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-snow text-[12px] font-bold flex items-center gap-1.5 transition"
          >
            🚚 پیگیری مرسوله
          </NuxtLink>
        </div>
      </div>

      <!-- برگه فاکتور اصلی رسمی (مناسب نمایش دیجیتال و چاپ A4) -->
      <article class="invoice-paper relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0f131d] p-6 sm:p-9 shadow-2xl print:border-none print:p-0 print:bg-white print:text-black">
        <!-- واترمارک رسمی در پس‌زمینه فاکتور -->
        <div class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-vio/10 blur-3xl print:hidden" />
        <div class="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-ice/10 blur-3xl print:hidden" />

        <!-- سربرگ رسمی فاکتور -->
        <header class="border-b border-white/10 pb-6 print:border-gray-300 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-3">
              <div class="h-11 w-11 rounded-2xl bg-gradient-to-tr from-vio to-ice grid place-items-center text-ink font-black text-[16px] shadow-lg shadow-vio/20 print:border print:border-black">
                VL
              </div>
              <div>
                <h1 class="text-[20px] font-black text-snow print:text-black">فاکتور رسمی فروشگاه ویپ‌لب</h1>
                <p class="text-[11.5px] text-mist print:text-gray-600">مرجع تخصصی ویپ، سالت و پاد اورجینال · VAPELAB Store</p>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-4 text-[12px] text-mist print:text-gray-700">
              <div>
                <span>تاریخ صدور: </span>
                <strong class="text-snow print:text-black">{{ formatDate(order.createdAt) }}</strong>
              </div>
              <div>
                <span>وضعیت فاکتور: </span>
                <strong :class="isPaid ? 'text-emerald-400 print:text-green-700' : 'text-amber-400 print:text-amber-700'">
                  {{ isPaid ? "تسویه شده" : "در انتظار پرداخت" }}
                </strong>
              </div>
            </div>
          </div>

          <!-- شماره فاکتور و بارکد -->
          <div class="text-left flex flex-col items-end">
            <div class="inline-flex flex-col items-end rounded-2xl border border-white/10 bg-white/5 p-3.5 print:border-gray-300 print:bg-gray-50">
              <span class="text-[11px] text-mist print:text-gray-500">شماره سفارش (فاکتور)</span>
              <span class="font-mono text-[17px] font-black text-vio print:text-black tracking-wider" dir="ltr">{{ order.number }}</span>
              <!-- بارکد SVG مینیمال خطی -->
              <svg class="mt-1.5 h-6 w-36 text-mist print:text-black" viewBox="0 0 140 20" fill="currentColor">
                <rect x="0" y="0" width="3" height="20" />
                <rect x="5" y="0" width="1" height="20" />
                <rect x="8" y="0" width="4" height="20" />
                <rect x="14" y="0" width="2" height="20" />
                <rect x="18" y="0" width="1" height="20" />
                <rect x="21" y="0" width="5" height="20" />
                <rect x="28" y="0" width="2" height="20" />
                <rect x="32" y="0" width="3" height="20" />
                <rect x="37" y="0" width="1" height="20" />
                <rect x="40" y="0" width="4" height="20" />
                <rect x="46" y="0" width="2" height="20" />
                <rect x="50" y="0" width="5" height="20" />
                <rect x="57" y="0" width="1" height="20" />
                <rect x="60" y="0" width="3" height="20" />
                <rect x="65" y="0" width="4" height="20" />
                <rect x="71" y="0" width="2" height="20" />
                <rect x="75" y="0" width="5" height="20" />
                <rect x="82" y="0" width="2" height="20" />
                <rect x="86" y="0" width="1" height="20" />
                <rect x="89" y="0" width="4" height="20" />
                <rect x="95" y="0" width="3" height="20" />
                <rect x="100" y="0" width="2" height="20" />
                <rect x="104" y="0" width="5" height="20" />
                <rect x="111" y="0" width="2" height="20" />
                <rect x="115" y="0" width="3" height="20" />
                <rect x="120" y="0" width="4" height="20" />
                <rect x="126" y="0" width="1" height="20" />
                <rect x="129" y="0" width="4" height="20" />
                <rect x="135" y="0" width="3" height="20" />
              </svg>
            </div>
          </div>
        </header>

        <!-- جدول مشخصات فروشنده و خریدار -->
        <section class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-[12.5px]">
          <!-- اطلاعات خریدار -->
          <div class="rounded-2xl border border-white/10 bg-white/3 p-4 print:border-gray-200 print:bg-transparent">
            <h3 class="text-[13px] font-extrabold text-snow print:text-black mb-2 flex items-center gap-1.5">
              <span>👤 مشخصات تحویل‌گیرنده</span>
            </h3>
            <ul class="space-y-1.5 text-mist print:text-gray-700">
              <li><span class="text-dim print:text-gray-500">نام و نام خانوادگی:</span> <strong class="text-snow print:text-black font-bold">{{ order.name }}</strong></li>
              <li><span class="text-dim print:text-gray-500">شماره تماس:</span> <span dir="ltr" class="font-mono text-snow print:text-black">{{ order.phone || 'ثبت نشده' }}</span></li>
              <li><span class="text-dim print:text-gray-500">ایمیل:</span> <span dir="ltr" class="text-snow print:text-black">{{ order.email }}</span></li>
              <li><span class="text-dim print:text-gray-500">نشانی تحویل:</span> <span class="text-snow print:text-black">{{ order.shipping?.city }}، {{ order.shipping?.line1 }}</span></li>
              <li v-if="order.shipping?.zip"><span class="text-dim print:text-gray-500">کد پستی:</span> <span dir="ltr" class="font-mono text-snow print:text-black">{{ order.shipping.zip }}</span></li>
            </ul>
          </div>

          <!-- اطلاعات فروشنده و شیپینگ -->
          <div class="rounded-2xl border border-white/10 bg-white/3 p-4 print:border-gray-200 print:bg-transparent">
            <h3 class="text-[13px] font-extrabold text-snow print:text-black mb-2 flex items-center gap-1.5">
              <span>🏢 اطلاعات فروشنده و ارسال</span>
            </h3>
            <ul class="space-y-1.5 text-mist print:text-gray-700">
              <li><span class="text-dim print:text-gray-500">فروشنده:</span> <strong class="text-snow print:text-black font-bold">مجموعه تخصصی ویپ‌لب (VAPELAB)</strong></li>
              <li><span class="text-dim print:text-gray-500">ناوگان ارسال:</span> <span class="text-emerald-400 print:text-black font-bold">{{ order.courier || 'پیک ویژه ۲ ساعته تهران / پست پیشتاز' }}</span></li>
              <li v-if="order.trackingCode">
                <span class="text-dim print:text-gray-500">کد رهگیری مرسوله:</span>
                <strong dir="ltr" class="font-mono text-vio print:text-black font-bold">{{ order.trackingCode }}</strong>
              </li>
              <li><span class="text-dim print:text-gray-500">پشتیبانی تلگرام و تلفنی:</span> <span dir="ltr" class="font-mono text-snow print:text-black">@Vapelab_Support</span></li>
            </ul>
          </div>
        </section>

        <!-- جدول اقلام خریداری شده -->
        <section class="mt-6">
          <div class="overflow-x-auto">
            <table class="w-full text-right text-[12.5px]">
              <thead>
                <tr class="border-b border-white/10 text-mist print:border-gray-300 print:text-gray-600">
                  <th class="py-3 px-2 font-extrabold">ردیف</th>
                  <th class="py-3 px-2 font-extrabold">شرح کالا</th>
                  <th class="py-3 px-2 font-extrabold text-center">تعداد</th>
                  <th class="py-3 px-2 font-extrabold text-left">قیمت واحد</th>
                  <th class="py-3 px-2 font-extrabold text-left">مبلغ کل (تومان)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 print:divide-gray-200">
                <tr v-for="(item, idx) in order.items" :key="idx" class="text-snow print:text-black">
                  <td class="py-3 px-2 text-dim print:text-gray-500 font-mono tnum">{{ idx + 1 }}</td>
                  <td class="py-3 px-2">
                    <div class="flex items-center gap-2.5">
                      <img
                        v-if="item.image"
                        :src="item.image"
                        :alt="item.name"
                        class="h-10 w-10 rounded-xl object-contain bg-white/5 border border-white/10 p-1 print:border-gray-300"
                      />
                      <div>
                        <strong class="block font-bold text-[13px]">{{ item.name }}</strong>
                        <div class="flex items-center gap-2 mt-0.5">
                          <span v-if="item.color" class="inline-flex items-center rounded-md bg-white/10 px-1.5 py-0.5 text-[10.5px] font-bold text-ice print:text-black">
                            رنگ: {{ item.color }}
                          </span>
                          <span class="text-[11px] text-emerald-400 print:text-gray-500">گارانتی اصالت کالا و هولوگرام اورجینال</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-2 text-center font-mono font-bold tnum">{{ item.qty }}</td>
                  <td class="py-3 px-2 text-left font-mono tnum">{{ money(item.price) }}</td>
                  <td class="py-3 px-2 text-left font-mono font-extrabold text-snow print:text-black tnum">
                    {{ money(item.price * item.qty) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- جمع‌بندی مالی و مهر فاکتور -->
        <section class="mt-6 pt-6 border-t border-white/10 print:border-gray-300 flex flex-wrap items-end justify-between gap-6">
          <!-- مهر و بارکد تایید اصالت -->
          <div class="flex items-center gap-4">
            <!-- مهر شبیه‌سازی شده اصالت ویپ‌لب -->
            <div class="h-24 w-24 rounded-full border-2 border-dashed border-emerald-500/50 bg-emerald-500/5 p-2 grid place-items-center text-center rotate-[-8deg] print:border-black">
              <div>
                <span class="block text-[10px] font-black text-emerald-400 print:text-black">VAPELAB</span>
                <span class="block text-[8.5px] text-emerald-300 print:text-black font-bold">اصالت ۱۰۰٪ کالا</span>
                <span class="block text-[7.5px] text-dim print:text-gray-600 mt-0.5">تایید انبار مرکزی</span>
              </div>
            </div>

            <!-- QR Code شبیه‌سازی شده پیگیری مرسوله -->
            <div class="text-right">
              <span class="block text-[11px] font-bold text-mist print:text-gray-600 mb-1">کد QR رهگیری مستقیم:</span>
              <div class="h-16 w-16 rounded-xl border border-white/15 bg-white p-1 shadow-sm grid place-items-center">
                <img
                  :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://vapelab.ir/track?order=${order.number}`"
                  alt="QR Code Track"
                  class="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>

          <!-- مبالغ کل فاکتور -->
          <div class="w-full sm:w-72 space-y-2 text-[12.5px]">
            <div class="flex justify-between text-mist print:text-gray-700">
              <span>جمع اقلام:</span>
              <span class="font-mono tnum text-snow print:text-black">{{ money(order.subtotal) }} تومان</span>
            </div>
            <div v-if="order.discount > 0" class="flex justify-between text-emerald-400 print:text-green-700 font-bold">
              <span>تخفیف کوپن:</span>
              <span class="font-mono tnum">-{{ money(order.discount) }} تومان</span>
            </div>
            <div class="flex justify-between text-mist print:text-gray-700">
              <span>هزینه بسته‌بندی و ارسال:</span>
              <span class="font-mono tnum text-snow print:text-black">
                {{ order.shippingFee === 0 ? "رایگان 🎁" : `${money(order.shippingFee)} تومان` }}
              </span>
            </div>
            <div class="pt-2 border-t border-white/10 print:border-gray-400 flex justify-between items-center text-[15px] font-black text-neon print:text-black">
              <span>مبلغ نهایی فاکتور:</span>
              <span class="font-mono tnum text-[17px]">{{ money(order.total) }} تومان</span>
            </div>
          </div>
        </section>

        <!-- پانوشت فاکتور -->
        <footer class="mt-8 pt-4 border-t border-white/5 print:border-gray-200 text-center text-[10.5px] text-dim print:text-gray-500 leading-5">
          کلیه محصولات خریداری شده دارای ضمانت اصالت فیزیکی و هولوگرام رسمی می‌باشند. در صورت هرگونه سوال با پشتیبانی ویپ‌لب در تماس باشید.
        </footer>
      </article>

      <!-- دکمه‌های اقدام پایین صفحه -->
      <div class="print:hidden flex flex-wrap items-center justify-between gap-3 pt-2">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-12 px-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 font-extrabold text-[13px] text-snow flex items-center gap-2 transition cursor-pointer"
            @click="printInvoice"
          >
            <span>🖨️ چاپ فاکتور رسمی</span>
          </button>
          <NuxtLink
            :to="`/track?order=${order.number}`"
            class="h-12 px-6 rounded-2xl bg-gradient-to-l from-vio to-ice text-ink font-extrabold text-[13.5px] flex items-center gap-2 shadow-lg shadow-vio/20 hover:opacity-95 transition"
          >
            <span>🚚 پیگیری زنده مرسوله</span>
          </NuxtLink>
        </div>

        <NuxtLink
          to="/shop"
          class="h-12 px-5 rounded-2xl border border-white/10 bg-transparent text-mist hover:text-snow text-[13px] font-bold flex items-center gap-2 transition"
        >
          <span>بازگشت به فروشگاه</span>
          <ArrowLeftIcon :size="16" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }
  .wrap {
    max-width: 100% !important;
    padding: 0 !important;
  }
}
</style>
