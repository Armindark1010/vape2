<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import VapeLogo from "~/components/vapor/VapeLogo.vue";
import { useAuth } from "~/composables/useAuth";
import { useVape } from "~/composables/useVape";
import {
  CloseIcon,
  UserIcon,
  SmartphoneIcon,
  KeyIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  EditIcon,
  BoltIcon,
  UserPlusIcon,
} from "~/components/vapor/VIcons";

const {
  authModalOpen,
  authMode,
  authTab,
  otpStep,
  otpPhone,
  authReason,
  loading,
  authError,
  closeAuth,
  setAuthTab,
  setAuthMode,
  sendOtp,
  loginWithOtp,
  loginWithPassword,
  register,
} = useAuth();

const { toast } = useVape();

// OTP Form state
const mobileInput = ref("");
const otpCode = ref("");
const resendTimer = ref(0);
let timerInterval: any = null;

// Password Login state
const loginIdentifier = ref("");
const loginPass = ref("");
const showLoginPass = ref(false);

// Register state
const regFullName = ref("");
const regIdentifier = ref("");
const regPass = ref("");
const regConfirmPass = ref("");
const showRegPass = ref(false);

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && authModalOpen.value) {
    closeAuth();
  }
};

watch(authModalOpen, (isOpen: boolean) => {
  if (typeof document === "undefined") return;
  if (isOpen) {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeydown);
  } else {
    document.body.style.overflow = "";
    window.removeEventListener("keydown", handleKeydown);
    clearInterval(timerInterval);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeydown);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }
  clearInterval(timerInterval);
});

const startResendTimer = () => {
  resendTimer.value = 90;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

// ────────── Handlers ──────────

const handleSendOtp = async () => {
  const phone = mobileInput.value.trim();
  if (!phone) {
    toast("لطفاً شماره موبایل خود را وارد کنید", "err");
    return;
  }
  if (!/^(\+98|0)?9\d{9}$/.test(phone.replace(/\s+/g, ""))) {
    toast("لطفاً یک شماره موبایل معتبر (مثلاً 09123456789) وارد کنید", "err");
    return;
  }

  const res = await sendOtp(phone);
  if (res.success) {
    startResendTimer();
    otpCode.value = "11111";
  }
};

const handleVerifyOtp = async () => {
  const code = otpCode.value.trim();
  if (!code) {
    toast("لطفاً کد ۵ رقمی را وارد کنید", "err");
    return;
  }
  await loginWithOtp(otpPhone.value || mobileInput.value.trim(), code);
};

const handleResendOtp = async () => {
  if (resendTimer.value > 0) return;
  await handleSendOtp();
};

const handleFillTestCode = () => {
  otpCode.value = "11111";
  toast("کد تست ۱۱۱۱۱ درج شد ✓", "ok");
};

const handleLoginPassword = async () => {
  const id = loginIdentifier.value.trim();
  const pass = loginPass.value;

  if (!id) {
    toast("لطفاً نام کاربری یا شماره موبایل را وارد کنید", "err");
    return;
  }
  if (!pass) {
    toast("لطفاً رمز عبور را وارد کنید", "err");
    return;
  }

  await loginWithPassword(id, pass);
};

const handleRegister = async () => {
  const id = regIdentifier.value.trim();
  const pass = regPass.value;
  const cpass = regConfirmPass.value;

  if (!id) {
    toast("لطفاً نام کاربری یا شماره موبایل را وارد کنید", "err");
    return;
  }
  if (!pass || pass.length < 6) {
    toast("رمز عبور باید حداقل ۶ کاراکتر باشد", "err");
    return;
  }
  if (pass !== cpass) {
    toast("تکرار رمز عبور با رمز اصلی مطابقت ندارد", "err");
    return;
  }

  await register({
    usernameOrMobile: id,
    password: pass,
    fullName: regFullName.value.trim() || undefined,
  });
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="authModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          @click="closeAuth"
        />

        <!-- Modal Container (Mobile-First Minimal Architecture) -->
        <div
          class="relative w-full max-w-[420px] max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0C0C10]/95 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all"
        >
          <!-- Top Bar -->
          <div class="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <div class="flex items-center gap-2">
              <VapeLogo variant="icon" height="28" />
              <div class="flex items-baseline gap-1.5">
                <span class="text-sm font-bold tracking-tight text-white">ویپ‌لب</span>
                <span class="text-[10px] font-mono font-medium text-neon">VAPELAB</span>
              </div>
            </div>

            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] text-sub hover:bg-white/10 hover:text-white transition-colors"
              aria-label="بستن پنجره"
              @click="closeAuth"
            >
              <CloseIcon :size="16" />
            </button>
          </div>

          <!-- Notification / Reason Banner -->
          <div
            v-if="authReason"
            class="mt-3.5 rounded-xl bg-neon/[0.08] border border-neon/20 px-3 py-2 text-xs text-neon text-center font-medium flex items-center justify-center gap-1.5"
          >
            <InfoIcon :size="15" class="shrink-0 text-neon" />
            <span>{{ authReason }}</span>
          </div>

          <!-- Mode Title & Subtitle -->
          <div class="mt-4 text-center">
            <h3 class="text-base font-bold text-white">
              <template v-if="authMode === 'register'">
                ایجاد حساب کاربری جدید
              </template>
              <template v-else-if="authTab === 'otp'">
                ورود یا ثبت‌نام با پیامک
              </template>
              <template v-else>
                ورود با کلمه عبور
              </template>
            </h3>
            <p class="mt-1 text-xs text-sub/70">
              {{
                authMode === "register"
                  ? "اطلاعات زیر را برای ایجاد حساب تکمیل کنید"
                  : "برای دسترسی به سفارشات و پنل کاربری وارد شوید"
              }}
            </p>
          </div>

          <!-- Minimal Tab Switcher (Only in login mode) -->
          <div
            v-if="authMode === 'login'"
            class="mt-4 grid grid-cols-2 rounded-xl bg-white/[0.04] p-1 border border-white/[0.08]"
          >
            <button
              type="button"
              class="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all"
              :class="
                authTab === 'otp'
                  ? 'bg-neon text-ink font-semibold shadow-sm'
                  : 'text-sub hover:text-white'
              "
              @click="setAuthTab('otp')"
            >
              <SmartphoneIcon :size="15" />
              <span>ورود پیامکی (OTP)</span>
            </button>

            <button
              type="button"
              class="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all"
              :class="
                authTab === 'password'
                  ? 'bg-neon text-ink font-semibold shadow-sm'
                  : 'text-sub hover:text-white'
              "
              @click="setAuthTab('password')"
            >
              <KeyIcon :size="15" />
              <span>کلمه عبور</span>
            </button>
          </div>

          <!-- Error Alert -->
          <div
            v-if="authError"
            class="mt-3 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-xs text-rose-400 text-center font-medium"
          >
            {{ authError }}
          </div>

          <!-- ══════════════════ TAB 1: OTP FLOW ══════════════════ -->
          <div v-if="authMode === 'login' && authTab === 'otp'" class="mt-4 space-y-4">
            <!-- Step 1: Input Mobile Phone -->
            <div v-if="otpStep === 'phone'" class="space-y-4">
              <div>
                <label class="block mb-1.5 text-xs font-medium text-sub">
                  شماره تلفن همراه
                </label>
                <div class="relative">
                  <input
                    v-model="mobileInput"
                    type="tel"
                    dir="ltr"
                    inputmode="numeric"
                    placeholder="09123456789"
                    maxlength="14"
                    class="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-sub/30 outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30 transition-all font-mono"
                    @keyup.enter="handleSendOtp"
                  />
                  <span class="absolute left-3 top-2.5 text-xs text-sub/60 font-mono">IR</span>
                </div>
                <p class="mt-1.5 text-[11px] text-sub/60 leading-relaxed">
                  کد تأیید یکبارمصرف ۵ رقمی از طریق پیامک ارسال می‌شود.
                </p>
              </div>

              <!-- Test bypass tip -->
              <div class="rounded-xl border border-neon/20 bg-neon/[0.04] p-2.5 text-[11px] text-neon/90 flex items-start gap-2">
                <InfoIcon :size="15" class="shrink-0 text-neon mt-0.5" />
                <div class="leading-relaxed">
                  <strong class="font-bold">تست بدون هزینه پیامک:</strong>
                  <span> بعد از ارسال، می‌توانید مستقیماً کد تست <code class="font-mono font-bold text-white bg-black/40 px-1.5 py-0.5 rounded border border-white/10">11111</code> را وارد کنید.</span>
                </div>
              </div>

              <button
                type="button"
                :disabled="loading || !mobileInput.trim()"
                class="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-l from-neon to-[#35e89d] py-2.5 text-sm font-bold text-ink hover:opacity-95 disabled:opacity-50 transition-all shadow-[0_4px_16px_rgba(47,230,149,0.2)]"
                @click="handleSendOtp"
              >
                <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                <span>{{ loading ? "در حال ارسال..." : "ارسال کد تأیید" }}</span>
              </button>
            </div>

            <!-- Step 2: Input 5-digit OTP -->
            <div v-else class="space-y-4">
              <div class="flex items-center justify-between text-xs text-sub">
                <div class="flex items-center gap-1.5">
                  <SmartphoneIcon :size="14" class="text-neon" />
                  <span>ارسال به <strong class="font-mono text-white">{{ otpPhone || mobileInput }}</strong></span>
                </div>
                <button
                  type="button"
                  class="flex items-center gap-1 text-neon hover:underline text-[11px]"
                  @click="otpStep = 'phone'"
                >
                  <EditIcon :size="12" />
                  <span>تغییر شماره</span>
                </button>
              </div>

              <div>
                <label class="block mb-1.5 text-xs font-medium text-sub">
                  کد ۵ رقمی ارسال‌شده
                </label>
                <input
                  v-model="otpCode"
                  type="text"
                  dir="ltr"
                  inputmode="numeric"
                  placeholder="11111"
                  maxlength="5"
                  class="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-center text-xl font-bold tracking-[0.4em] text-neon placeholder-neon/20 outline-none focus:border-neon focus:ring-2 focus:ring-neon/30 transition-all font-mono"
                  @keyup.enter="handleVerifyOtp"
                />
              </div>

              <!-- Quick test code button -->
              <div class="flex items-center justify-between gap-2">
                <button
                  type="button"
                  class="flex items-center gap-1 text-[11px] text-neon bg-neon/[0.08] hover:bg-neon/[0.15] border border-neon/20 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                  @click="handleFillTestCode"
                >
                  <BoltIcon :size="13" />
                  <span>درج کد تست (۱۱۱۱۱)</span>
                </button>

                <div class="text-[11px] text-sub/70">
                  <span v-if="resendTimer > 0">
                    ارسال مجدد تا {{ resendTimer }} ثانیه
                  </span>
                  <button
                    v-else
                    type="button"
                    class="text-neon hover:underline"
                    @click="handleResendOtp"
                  >
                    ارسال مجدد کد
                  </button>
                </div>
              </div>

              <button
                type="button"
                :disabled="loading || otpCode.trim().length < 5"
                class="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-l from-neon to-[#35e89d] py-2.5 text-sm font-bold text-ink hover:opacity-95 disabled:opacity-50 transition-all shadow-[0_4px_16px_rgba(47,230,149,0.2)]"
                @click="handleVerifyOtp"
              >
                <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                <span>{{ loading ? "در حال اعتبارسنجی..." : "تأیید و ورود" }}</span>
              </button>
            </div>
          </div>

          <!-- ══════════════════ TAB 2: PASSWORD LOGIN ══════════════════ -->
          <div
            v-else-if="authMode === 'login' && authTab === 'password'"
            class="mt-4 space-y-4"
          >
            <div>
              <label class="block mb-1.5 text-xs font-medium text-sub">
                نام کاربری یا شماره موبایل
              </label>
              <input
                v-model="loginIdentifier"
                type="text"
                dir="ltr"
                placeholder="09123456789 یا username"
                class="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-sub/30 outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30 transition-all font-mono"
              />
            </div>

            <div>
              <label class="block mb-1.5 text-xs font-medium text-sub">
                کلمه عبور
              </label>
              <div class="relative">
                <input
                  v-model="loginPass"
                  :type="showLoginPass ? 'text' : 'password'"
                  dir="ltr"
                  placeholder="••••••••"
                  class="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-sub/30 outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30 transition-all font-mono"
                  @keyup.enter="handleLoginPassword"
                />
                <button
                  type="button"
                  class="absolute left-3 top-2.5 text-sub/60 hover:text-white transition-colors"
                  :aria-label="showLoginPass ? 'پنهان کردن رمز' : 'نمایش رمز'"
                  @click="showLoginPass = !showLoginPass"
                >
                  <EyeOffIcon v-if="showLoginPass" :size="16" />
                  <EyeIcon v-else :size="16" />
                </button>
              </div>
            </div>

            <button
              type="button"
              :disabled="loading || !loginIdentifier.trim() || !loginPass"
              class="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-l from-neon to-[#35e89d] py-2.5 text-sm font-bold text-ink hover:opacity-95 disabled:opacity-50 transition-all shadow-[0_4px_16px_rgba(47,230,149,0.2)]"
              @click="handleLoginPassword"
            >
              <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
              <span>{{ loading ? "در حال ورود..." : "ورود به حساب" }}</span>
            </button>

            <!-- Switch to Register -->
            <div class="text-center pt-2 text-xs text-sub/80 flex items-center justify-center gap-1.5">
              <span>حساب کاربری ندارید؟</span>
              <button
                type="button"
                class="font-semibold text-neon hover:underline flex items-center gap-1"
                @click="setAuthMode('register')"
              >
                <UserPlusIcon :size="13" />
                <span>ثبت‌نام با کلمه عبور</span>
              </button>
            </div>
          </div>

          <!-- ══════════════════ REGISTER FORM ══════════════════ -->
          <div v-else-if="authMode === 'register'" class="mt-4 space-y-3">
            <div>
              <label class="block mb-1 text-xs font-medium text-sub">
                نام و نام خانوادگی (اختیاری)
              </label>
              <input
                v-model="regFullName"
                type="text"
                placeholder="مثال: آرمین شریفی"
                class="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-white placeholder-sub/30 outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30 transition-all"
              />
            </div>

            <div>
              <label class="block mb-1 text-xs font-medium text-sub">
                نام کاربری یا شماره موبایل <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="regIdentifier"
                type="text"
                dir="ltr"
                placeholder="09123456789 یا my_username"
                class="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-white placeholder-sub/30 outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30 transition-all font-mono"
              />
            </div>

            <div>
              <label class="block mb-1 text-xs font-medium text-sub">
                کلمه عبور (حداقل ۶ کاراکتر) <span class="text-rose-400">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="regPass"
                  :type="showRegPass ? 'text' : 'password'"
                  dir="ltr"
                  placeholder="حداقل ۶ کاراکتر"
                  class="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-white placeholder-sub/30 outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30 transition-all font-mono"
                />
                <button
                  type="button"
                  class="absolute left-3 top-2 text-sub/60 hover:text-white transition-colors"
                  :aria-label="showRegPass ? 'پنهان کردن رمز' : 'نمایش رمز'"
                  @click="showRegPass = !showRegPass"
                >
                  <EyeOffIcon v-if="showRegPass" :size="16" />
                  <EyeIcon v-else :size="16" />
                </button>
              </div>
            </div>

            <div>
              <label class="block mb-1 text-xs font-medium text-sub">
                تکرار کلمه عبور <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="regConfirmPass"
                type="password"
                dir="ltr"
                placeholder="تکرار کلمه عبور"
                class="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-white placeholder-sub/30 outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30 transition-all font-mono"
                @keyup.enter="handleRegister"
              />
            </div>

            <button
              type="button"
              :disabled="loading || !regIdentifier.trim() || !regPass || !regConfirmPass"
              class="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-l from-neon to-[#35e89d] py-2.5 text-sm font-bold text-ink hover:opacity-95 disabled:opacity-50 transition-all shadow-[0_4px_16px_rgba(47,230,149,0.2)]"
              @click="handleRegister"
            >
              <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
              <span>{{ loading ? "در حال ثبت‌نام..." : "ایجاد حساب کاربری" }}</span>
            </button>

            <!-- Switch to Login -->
            <div class="text-center pt-2 text-xs text-sub/80 flex items-center justify-center gap-1.5">
              <span>قبلاً ثبت‌نام کرده‌اید؟</span>
              <button
                type="button"
                class="font-semibold text-neon hover:underline flex items-center gap-1"
                @click="setAuthMode('login')"
              >
                <LockIcon :size="13" />
                <span>ورود به حساب</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
