<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useVape } from "~/composables/useVape";
import { CloseIcon, UserIcon, DropletIcon } from "~/components/vapor/VIcons";

const { authModalOpen, authMode, authReason, loading, authError, closeAuth, login, register } = useAuth();
const { toast } = useVape();

// Login Form
const loginUsername = ref("");
const loginPassword = ref("");
const showLoginPassword = ref(false);

// Register Form
const regName = ref("");
const regUsername = ref("");
const regEmail = ref("");
const regPhone = ref("");
const regPassword = ref("");
const regConfirmPassword = ref("");
const showRegPassword = ref(false);

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && authModalOpen.value) {
    closeAuth();
  }
};

watch(authModalOpen, (isOpen) => {
  if (typeof document === "undefined") return;
  if (isOpen) {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeydown);
  } else {
    document.body.style.overflow = "";
    window.removeEventListener("keydown", handleKeydown);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeydown);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }
});

const submitLogin = async () => {
  if (!loginUsername.value.trim()) {
    toast("لطفاً نام کاربری یا ایمیل خود را وارد کنید", "err");
    return;
  }
  if (!loginPassword.value) {
    toast("لطفاً رمز عبور را وارد کنید", "err");
    return;
  }
  await login({
    username: loginUsername.value.trim(),
    password: loginPassword.value,
  });
};

const submitRegister = async () => {
  if (!regName.value.trim()) {
    toast("لطفاً نام و نام خانوادگی را وارد کنید", "err");
    return;
  }
  if (!regUsername.value.trim()) {
    toast("لطفاً نام کاربری را وارد کنید", "err");
    return;
  }
  if (!regPassword.value || regPassword.value.length < 4) {
    toast("رمز عبور باید حداقل ۴ رقم باشد", "err");
    return;
  }
  if (regPassword.value !== regConfirmPassword.value) {
    toast("تکرار رمز عبور با رمز عبور مطابقت ندارد", "err");
    return;
  }

  await register({
    name: regName.value.trim(),
    username: regUsername.value.trim(),
    email: regEmail.value.trim() || `${regUsername.value.trim()}@vapora.local`,
    phone: regPhone.value.trim() || undefined,
    password: regPassword.value,
  });
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="authModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
        @click.self="closeAuth"
      >
        <div
          class="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/12 bg-surface/95 p-6 shadow-2xl backdrop-blur-2xl transition-all"
        >
          <!-- افکت نئونی زمینه -->
          <div class="pointer-events-none absolute -top-24 -left-20 h-56 w-56 rounded-full bg-vio/20 blur-3xl" />
          <div class="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-neon/15 blur-3xl" />

          <!-- هدر مودال -->
          <div class="relative flex items-center justify-between pb-4 border-b border-white/8">
            <div class="flex items-center gap-2">
              <span class="grid h-10 w-10 place-items-center rounded-xl bg-vio/15 text-vio">
                <UserIcon :size="20" />
              </span>
              <div>
                <h3 class="text-[16px] font-extrabold text-snow">
                  {{ authMode === 'login' ? 'ورود به حساب کاربری' : 'عضویت در ویپورا' }}
                </h3>
                <p class="text-[11px] text-dim">
                  {{ authReason || 'برای دسترسی به تمام امکانات فروشگاه' }}
                </p>
              </div>
            </div>
            <button
              class="pressable grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-mist hover:text-snow cursor-pointer"
              aria-label="بستن"
              @click="closeAuth"
            >
              <CloseIcon :size="18" />
            </button>
          </div>

          <!-- سوئیچ تب‌ها -->
          <div class="relative mt-5 flex rounded-2xl bg-white/5 p-1 border border-white/8">
            <button
              type="button"
              class="pressable flex-1 rounded-xl py-2.5 text-center text-[13px] font-bold transition-all cursor-pointer"
              :class="authMode === 'login' ? 'bg-gradient-to-l from-vio to-ice text-ink shadow-md' : 'text-mist hover:text-snow'"
              @click="authMode = 'login'"
            >
              ورود
            </button>
            <button
              type="button"
              class="pressable flex-1 rounded-xl py-2.5 text-center text-[13px] font-bold transition-all cursor-pointer"
              :class="authMode === 'register' ? 'bg-gradient-to-l from-vio to-ice text-ink shadow-md' : 'text-mist hover:text-snow'"
              @click="authMode = 'register'"
            >
              ثبت‌نام (بدون پیامک/OTP)
            </button>
          </div>

          <!-- پیام خطا -->
          <div v-if="authError" class="mt-4 rounded-xl border border-blush/30 bg-blush/10 p-3 text-[12px] text-blush">
            {{ authError }}
          </div>

          <!-- فرم ورود -->
          <form v-if="authMode === 'login'" class="mt-5 space-y-4" @submit.prevent="submitLogin">
            <div>
              <label class="mb-1.5 block text-[12px] font-bold text-mist">نام کاربری یا ایمیل</label>
              <input
                v-model="loginUsername"
                type="text"
                dir="ltr"
                placeholder="username or email"
                class="input h-12 w-full rounded-2xl px-4 text-[14px]"
                required
              />
            </div>

            <div>
              <label class="mb-1.5 block text-[12px] font-bold text-mist">رمز عبور</label>
              <div class="relative">
                <input
                  v-model="loginPassword"
                  :type="showLoginPassword ? 'text' : 'password'"
                  dir="ltr"
                  placeholder="••••••••"
                  class="input h-12 w-full rounded-2xl px-4 pl-12 text-[14px]"
                  required
                />
                <button
                  type="button"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-dim hover:text-snow text-[12px] cursor-pointer"
                  @click="showLoginPassword = !showLoginPassword"
                >
                  {{ showLoginPassword ? 'مخفی' : 'نمایش' }}
                </button>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="pressable mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[14.5px] font-extrabold text-ink glow-v disabled:opacity-50 cursor-pointer"
            >
              <span v-if="loading" class="animate-spin text-lg">⏳</span>
              <span v-else>ورود به حساب</span>
            </button>
          </form>

          <!-- فرم ثبت نام -->
          <form v-else class="mt-5 space-y-3.5" @submit.prevent="submitRegister">
            <div>
              <label class="mb-1 block text-[11.5px] font-bold text-mist">نام و نام خانوادگی</label>
              <input
                v-model="regName"
                type="text"
                placeholder="مثلاً: علی محمدی"
                class="input h-11 w-full rounded-2xl px-4 text-[13.5px]"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label class="mb-1 block text-[11.5px] font-bold text-mist">نام کاربری</label>
                <input
                  v-model="regUsername"
                  type="text"
                  dir="ltr"
                  placeholder="ali_vaper"
                  class="input h-11 w-full rounded-2xl px-3 text-[13px]"
                  required
                />
              </div>
              <div>
                <label class="mb-1 block text-[11.5px] font-bold text-mist">شماره تماس (اختیاری)</label>
                <input
                  v-model="regPhone"
                  type="tel"
                  dir="ltr"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  class="input h-11 w-full rounded-2xl px-3 text-[13px]"
                />
              </div>
            </div>

            <div>
              <label class="mb-1 block text-[11.5px] font-bold text-mist">ایمیل (اختیاری)</label>
              <input
                v-model="regEmail"
                type="email"
                dir="ltr"
                placeholder="name@example.com"
                class="input h-11 w-full rounded-2xl px-4 text-[13px]"
              />
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label class="mb-1 block text-[11.5px] font-bold text-mist">رمز عبور</label>
                <input
                  v-model="regPassword"
                  :type="showRegPassword ? 'text' : 'password'"
                  dir="ltr"
                  placeholder="حداقل ۴ کاراکتر"
                  class="input h-11 w-full rounded-2xl px-3 text-[13px]"
                  required
                />
              </div>
              <div>
                <label class="mb-1 block text-[11.5px] font-bold text-mist">تکرار رمز عبور</label>
                <input
                  v-model="regConfirmPassword"
                  :type="showRegPassword ? 'text' : 'password'"
                  dir="ltr"
                  placeholder="تکرار رمز"
                  class="input h-11 w-full rounded-2xl px-3 text-[13px]"
                  required
                />
              </div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-dim">
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input v-model="showRegPassword" type="checkbox" class="accent-vio" />
                نمایش رمز عبور
              </label>
              <span>بدون نیاز به کد پیامک (OTP)</span>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="pressable mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[14.5px] font-extrabold text-ink glow-v disabled:opacity-50 cursor-pointer"
            >
              <span v-if="loading" class="animate-spin text-lg">⏳</span>
              <span v-else>ثبت‌نام و ورود</span>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
