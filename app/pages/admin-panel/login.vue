<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: 'ورود به پنل مدیریت ارشد ویپ‌لب',
});

const router = useRouter();
const { loginWithPassword, user, isLoggedIn } = useAuth();

const identifier = ref('admin');
const password = ref('Admin@VapeLab2026!');
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

    // Role check: only ADMIN allowed in main admin
    if (user.value?.role !== 'ADMIN' && !user.value?.isAdmin) {
      errorMessage.value = 'دسترسی غیرمجاز: این حساب کاربری دارای مجوز مدیریت ارشد پلتفرم نیست.';
      return;
    }

    router.push('/admin-panel');
  } catch (err: any) {
    errorMessage.value = err?.message || 'خطا در برقراری ارتباط با سرور احراز هویت.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#0c0c0e] flex items-center justify-center p-4 relative overflow-hidden font-sans" dir="rtl">
    <!-- Ambient glowing gradients -->
    <div class="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(100%_70%_at_50%_0%,rgba(0,220,130,0.08),transparent_70%)]" />
    <div class="pointer-events-none fixed -top-40 -right-40 w-96 h-96 bg-[#00DC82]/10 rounded-full blur-3xl" />

    <div class="relative z-10 w-full max-w-md">
      <!-- Brand Logo & Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00DC82]/10 border border-[#00DC82]/20 mb-3">
          <DashboardIcon name="nuxt" :size="30" class="text-[#00DC82]" />
        </div>
        <h1 class="text-2xl font-black text-white tracking-tight">پنل مدیریت ارشد ویپ‌لب</h1>
        <p class="text-xs text-zinc-400 mt-1.5">سامانه جامع نظارت، سفارشات و تسویه مارکت‌پلیس</p>
      </div>

      <!-- Login Card -->
      <div class="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Error Alert -->
          <div
            v-if="errorMessage"
            class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs leading-5 flex items-start gap-2.5"
          >
            <span class="text-base shrink-0">⚠️</span>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Username / Identifier -->
          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-2">
              نام کاربری یا ایمیل مدیر
            </label>
            <div class="relative">
              <input
                v-model="identifier"
                type="text"
                placeholder="admin یا admin@vapelab.ir"
                class="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#00DC82] transition"
                required
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-2">
              کلمه عبور امنیتی
            </label>
            <div class="relative">
              <input
                v-model="password"
                type="password"
                placeholder="••••••••••••"
                class="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#00DC82] transition font-mono"
                required
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 px-4 rounded-xl bg-[#00DC82] hover:bg-[#00c575] text-zinc-950 font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <span v-if="loading" class="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin"></span>
            <span>{{ loading ? 'در حال تایید هویت...' : 'ورود به پنل مدیریت ارشد' }}</span>
          </button>
        </form>

        <!-- Footer Help -->
        <div class="mt-6 pt-5 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <NuxtLink to="/" class="hover:text-white transition flex items-center gap-1">
            <span>←</span>
            <span>صفحه اصلی فروشگاه</span>
          </NuxtLink>
          <NuxtLink to="/supplier/login" class="text-[#00DC82] hover:underline">
            پرتال تأمین‌کنندگان
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

