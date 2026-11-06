<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: 'ورود به پرتال اختصاصی تأمین‌کنندگان ویپ‌لب',
});

const router = useRouter();
const { loginWithPassword, user } = useAuth();

const identifier = ref('supplier1');
const password = ref('Supplier@2026!');
const loading = ref(false);
const errorMessage = ref<string | null>(null);

const handleLogin = async () => {
  if (!identifier.value || !password.value) {
    errorMessage.value = 'لطفاً نام کاربری و رمز عبور را وارد فرمایید.';
    return;
  }

  loading.value = true;
  errorMessage.value = null;

  try {
    const success = await loginWithPassword(identifier.value, password.value);
    if (!success) {
      errorMessage.value = 'شناسه کاربری یا رمز عبور اشتباه است.';
      return;
    }

    if (user.value?.role !== 'SUPPLIER' && user.value?.role !== 'ADMIN') {
      errorMessage.value = 'دسترسی غیرمجاز: حساب کاربری شما به عنوان تأمین‌کننده در سیستم ثبت نشده است.';
      return;
    }

    router.push('/supplier');
  } catch (err: any) {
    errorMessage.value = err?.message || 'خطا در برقراری ارتباط با سرور.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#09090F] flex items-center justify-center p-4 relative overflow-hidden font-sans" dir="rtl">
    <div class="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(100%_70%_at_50%_0%,rgba(59,130,246,0.12),transparent_70%)]" />
    <div class="pointer-events-none fixed -top-40 -right-40 w-96 h-96 bg-[#3B82F6]/15 rounded-full blur-3xl" />
    <div class="pointer-events-none fixed -bottom-40 -left-40 w-96 h-96 bg-[#8B5CF6]/15 rounded-full blur-3xl" />

    <div class="relative z-10 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B82F6]/30 to-[#8B5CF6]/20 border border-[#3B82F6]/40 shadow-xl shadow-[#3B82F6]/20 mb-3 text-2xl">
          🏭
        </div>
        <h1 class="text-2xl font-black text-[#F4F4F8] tracking-tight">پرتال تأمین‌کنندگان ویپ‌لب</h1>
        <p class="text-xs text-[#9696AD] mt-1.5">مدیریت موجودی انبار، رهگیری فاکتورها و گزارش تسویه‌حساب</p>
      </div>

      <div class="rounded-3xl bg-[#13131F]/90 border border-[#29293B] p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div
            v-if="errorMessage"
            class="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs leading-5 flex items-start gap-2.5"
          >
            <span class="text-base shrink-0">⚠️</span>
            <span>{{ errorMessage }}</span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#F4F4F8] mb-2">
              شناسه یا ایمیل تأمین‌کننده
            </label>
            <div class="relative">
              <input
                v-model="identifier"
                type="text"
                placeholder="supplier1 یا ایمیل شرکت"
                class="w-full px-4 py-3 rounded-xl bg-[#1A1A29] border border-[#29293B] text-sm text-[#F4F4F8] placeholder-[#9696AD] focus:outline-none focus:border-[#3B82F6] transition"
                required
              />
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#9696AD]">🏢</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#F4F4F8] mb-2">
              کلمه عبور امنیتی
            </label>
            <div class="relative">
              <input
                v-model="password"
                type="password"
                placeholder="••••••••••••"
                class="w-full px-4 py-3 rounded-xl bg-[#1A1A29] border border-[#29293B] text-sm text-[#F4F4F8] placeholder-[#9696AD] focus:outline-none focus:border-[#3B82F6] transition font-mono"
                required
              />
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#9696AD]">🔒</span>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-l from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E40AF] text-white font-bold text-sm shadow-lg shadow-[#3B82F6]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <span v-if="loading" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            <span>{{ loading ? 'در حال بررسی دسترسی...' : 'ورود به پرتال تأمین‌کنندگان' }}</span>
          </button>
        </form>

        <div class="mt-6 pt-5 border-t border-[#29293B] flex items-center justify-between text-xs text-[#9696AD]">
          <NuxtLink to="/" class="hover:text-[#F4F4F8] transition flex items-center gap-1">
            <span>←</span>
            <span>صفحه اصلی فروشگاه</span>
          </NuxtLink>
          <NuxtLink to="/admin-panel/login" class="text-[#3B82F6] hover:underline">
            ورود مدیران کل
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

