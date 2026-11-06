<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  title: 'ایجاد و ثبت تأمین‌کننده جدید',
});

const router = useRouter();

const form = ref({
  companyName: '',
  contactName: '',
  username: '',
  password: '',
  phone: '',
  email: '',
  iban: '',
  commissionRate: 10,
});

const loading = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const submitCreate = async () => {
  if (!form.value.companyName || !form.value.username || !form.value.password || !form.value.phone) {
    errorMessage.value = 'لطفاً نام شرکت، نام کاربری، کلمه عبور و شماره تماس را تکمیل فرمایید.';
    return;
  }

  loading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    const res = await $fetch('/api/v1/suppliers/admin', {
      method: 'POST',
      body: {
        ...form.value,
        commissionRate: Number(form.value.commissionRate),
      },
    });

    successMessage.value = `حساب کاربری تأمین‌کننده "${form.value.companyName}" با موفقیت ایجاد گردید.`;
    setTimeout(() => {
      router.push('/admin-panel/suppliers');
    }, 1500);
  } catch (err: any) {
    errorMessage.value = err?.data?.message || err.message || 'خطا در ثبت اطلاعات تأمین‌کننده در سرور.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="ثبت تأمین‌کننده جدید در مارکت‌پلیس" badge="New Partner">
        <template #right>
          <NuxtLink
            to="/admin-panel/suppliers"
            class="px-3 py-1.5 rounded-xl bg-[#13131F] border border-[#29293B] text-xs text-[#9696AD] hover:text-[#F4F4F8] transition flex items-center gap-1.5"
          >
            <span>←</span>
            <span>بازگشت به لیست</span>
          </NuxtLink>
        </template>
      </DashboardUDashboardNavbar>
    </template>

    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Info Header Card -->
      <div class="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center text-[#00DC82] shrink-0">
          <DashboardIcon name="suppliers" :size="24" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-white">ایجاد هویت یکپارچه تأمین‌کننده (Role = SUPPLIER)</h2>
          <p class="text-xs text-zinc-400 mt-1 leading-5">
            با تکمیل این فرم، همزمان یک حساب کاربری امنیتی برای ورود به پرتال اختصاصی تأمین‌کننده و پروفایل تجاری رسمی شرکت در مارکت‌پلیس ویپ‌لب ثبت خواهد شد.
          </p>
        </div>
      </div>

      <!-- Alerts -->
      <div
        v-if="errorMessage"
        class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
      >
        <DashboardIcon name="trash" :size="16" />
        <span>{{ errorMessage }}</span>
      </div>

      <div
        v-if="successMessage"
        class="p-4 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/25 text-[#00DC82] text-xs flex items-center gap-2"
      >
        <DashboardIcon name="check" :size="16" />
        <span>{{ successMessage }}</span>
      </div>

      <!-- Form Box -->
      <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 md:p-8 shadow-xl">
        <form @submit.prevent="submitCreate" class="space-y-6 text-right">
          <!-- Section 1: Business Profile -->
          <div>
            <h3 class="text-xs font-bold text-[#00DC82] uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800">
              ۱. مشخصات کسب‌وکار و شرکت
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-300 mb-1.5">
                  نام شرکت / برند تجاری <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model="form.companyName"
                  type="text"
                  placeholder="مثال: شرکت بازرگانی نیکوتین‌پارس"
                  class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00DC82]"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-zinc-300 mb-1.5">
                  نام و نام خانوادگی مسئول هماهنگی
                </label>
                <input
                  v-model="form.contactName"
                  type="text"
                  placeholder="مثال: مهندس صادقی"
                  class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00DC82]"
                />
              </div>
            </div>
          </div>

          <!-- Section 2: Account Access Credentials -->
          <div>
            <h3 class="text-xs font-bold text-[#00DC82] uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800">
              ۲. اطلاعات حساب کاربری و احراز هویت ورود به پرتال
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-300 mb-1.5">
                  نام کاربری ورود (Username) <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model="form.username"
                  type="text"
                  placeholder="مثال: supplier_nicotine"
                  class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-[#00DC82]"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-zinc-300 mb-1.5">
                  کلمه عبور امنیتی اولیه <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="حداقل ۸ کاراکتر..."
                  class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-[#00DC82]"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-zinc-300 mb-1.5">
                  شماره موبایل جهت هماهنگی و ورود <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model="form.phone"
                  type="text"
                  placeholder="0912xxxxxxx"
                  class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-[#00DC82]"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-zinc-300 mb-1.5">
                  آدرس ایمیل شرکتی
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="contact@company.com"
                  class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-[#00DC82]"
                />
              </div>
            </div>
          </div>

          <!-- Section 3: Financial Settlement Settings -->
          <div>
            <h3 class="text-xs font-bold text-[#00DC82] uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800">
              ۳. تنظیمات مالی، شبا بانکی و کارمزد پلتفرم
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-300 mb-1.5">
                  درصد کارمزد کسر از فروش (%) <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model="form.commissionRate"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
                  required
                />
                <span class="text-[10.5px] text-zinc-500 mt-1 block">پیش‌فرض پلتفرم: ۱۰ درصد</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-zinc-300 mb-1.5">
                  شماره شبای ۲۴ رقمی واریز (بانک مرکزی)
                </label>
                <input
                  v-model="form.iban"
                  type="text"
                  placeholder="IR82012..."
                  class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-[#00DC82]"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <NuxtLink
              to="/admin-panel/suppliers"
              class="px-5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 hover:text-white transition"
            >
              انصراف
            </NuxtLink>

            <button
              type="submit"
              :disabled="loading"
              class="px-7 py-2.5 rounded-xl bg-[#00DC82] text-zinc-950 hover:bg-[#00c575] font-bold text-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <span v-if="loading" class="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin"></span>
              <span>{{ loading ? 'در حال ایجاد حساب...' : 'ایجاد و ثبت نهایی تأمین‌کننده' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </DashboardUDashboardPanel>
</template>

