import { ref, computed } from "vue";
import type { AuthUser } from "~/types";
import { useVape } from "./useVape";

// Global singleton reactive state
const user = ref<AuthUser | null>(null);
const token = ref<string | null>(null);
const authModalOpen = ref(false);
const authMode = ref<"login" | "register">("login");
const authTab = ref<"otp" | "password">("otp");
const otpStep = ref<"phone" | "code">("phone");
const otpPhone = ref("");
const authReason = ref<string | null>(null);
const pendingAction = ref<(() => void) | null>(null);
const loading = ref(false);
const authError = ref<string | null>(null);
const hydrated = ref(false);

const STORAGE_USER_KEY = "vapelab.auth.user";
const STORAGE_TOKEN_KEY = "vapelab.auth.token";

export function useAuth() {
  const { toast } = useVape();

  const init = () => {
    if (typeof window === "undefined" || hydrated.value) return;
    try {
      // Check current or legacy storage keys
      const savedUser =
        localStorage.getItem(STORAGE_USER_KEY) ||
        localStorage.getItem("vapora.auth.user");
      const savedToken =
        localStorage.getItem(STORAGE_TOKEN_KEY) ||
        localStorage.getItem("vapora.auth.token");

      if (savedUser) {
        user.value = JSON.parse(savedUser) as AuthUser;
      }
      if (savedToken) {
        token.value = savedToken;
      }
    } catch {
      /* ignore parse errors */
    } finally {
      hydrated.value = true;
    }
  };

  if (typeof window !== "undefined") {
    init();
  }

  const isLoggedIn = computed(() => !!user.value && !!token.value);

  const openAuth = (
    mode: "login" | "register" = "login",
    reason?: string,
    onSuccess?: () => void,
    defaultTab: "otp" | "password" = "otp"
  ) => {
    authMode.value = mode;
    authTab.value = defaultTab;
    otpStep.value = "phone";
    authReason.value = reason || null;
    authError.value = null;
    if (onSuccess) {
      pendingAction.value = onSuccess;
    }
    authModalOpen.value = true;
  };

  const closeAuth = () => {
    authModalOpen.value = false;
    authReason.value = null;
    authError.value = null;
    otpStep.value = "phone";
  };

  const setAuthTab = (tab: "otp" | "password") => {
    authTab.value = tab;
    authError.value = null;
  };

  const setAuthMode = (mode: "login" | "register") => {
    authMode.value = mode;
    authError.value = null;
  };

  /**
   * Helper: اگر کاربر لاگین بود اکشن را اجرا می‌کند؛
   * در غیر این صورت مودال ورود را باز کرده و پس از ورود، خودکار اکشن را انجام می‌دهد.
   */
  const requireAuth = (
    action: () => void,
    reason = "برای ادامه لطفاً وارد حساب کاربری شوید"
  ) => {
    if (isLoggedIn.value) {
      action();
    } else {
      openAuth("login", reason, action, "otp");
    }
  };

  const handleSuccess = (userData: AuthUser, userToken: string, successMsg: string) => {
    user.value = userData;
    token.value = userToken;

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
      localStorage.setItem(STORAGE_TOKEN_KEY, userToken);
      // Clean legacy key
      localStorage.removeItem("vapora.auth.user");
      localStorage.removeItem("vapora.auth.token");
    }

    toast(successMsg, "ok");
    closeAuth();

    // اجرای خودکار عملیات معلق
    if (pendingAction.value) {
      const act = pendingAction.value;
      pendingAction.value = null;
      setTimeout(() => act(), 150);
    }
  };

  /**
   * 1. Send OTP to mobile phone
   */
  const sendOtp = async (phoneNumber: string) => {
    loading.value = true;
    authError.value = null;
    try {
      const res = await $fetch<{
        success: boolean;
        message: string;
        phoneNumber: string;
        debugCode?: string;
      }>("/api/v1/auth/send-otp", {
        method: "POST",
        body: { phoneNumber },
      });

      otpPhone.value = res.phoneNumber || phoneNumber;
      otpStep.value = "code";

      if (res.debugCode) {
        toast(`کد تایید ارسال شد (کد تست: ${res.debugCode})`, "ok");
      } else {
        toast(res.message || "کد تأیید ارسال شد", "ok");
      }
      return { success: true, debugCode: res.debugCode };
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.statusMessage ||
        "خطا در ارسال پیامک تأیید. لطفاً شماره موبایل را بررسی کنید";
      authError.value = Array.isArray(msg) ? msg.join("، ") : msg;
      toast(authError.value || "خطا در ارسال پیامک", "err");
      return { success: false, error: authError.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * 2. Verify OTP code (Supports test code "11111")
   */
  const loginWithOtp = async (phoneNumber: string, code: string) => {
    loading.value = true;
    authError.value = null;
    try {
      const res = await $fetch<{
        accessToken: string;
        user: AuthUser;
      }>("/api/v1/auth/verify-otp", {
        method: "POST",
        body: { phoneNumber, code },
      });

      const displayName =
        res.user.fullName ||
        res.user.name ||
        res.user.username ||
        res.user.phoneNumber ||
        "کاربر عزیز";

      handleSuccess(
        res.user,
        res.accessToken,
        `خوش آمدید، ${displayName} 👋`
      );
      return true;
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.statusMessage ||
        "کد وارد شده نامعتبر یا منقضی شده است";
      authError.value = Array.isArray(msg) ? msg.join("، ") : msg;
      toast(authError.value || "کد تایید اشتباه است", "err");
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 3. Login with username or mobile and password
   */
  const loginWithPassword = async (
    usernameOrMobile: string,
    password: string
  ) => {
    loading.value = true;
    authError.value = null;
    try {
      const res = await $fetch<{
        accessToken: string;
        user: AuthUser;
      }>("/api/v1/auth/login-password", {
        method: "POST",
        body: { usernameOrMobile, password },
      });

      const displayName =
        res.user.fullName ||
        res.user.name ||
        res.user.username ||
        res.user.phoneNumber ||
        usernameOrMobile;

      handleSuccess(
        res.user,
        res.accessToken,
        `خوش آمدید، ${displayName} 👋`
      );
      return true;
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.statusMessage ||
        "نام کاربری یا رمز عبور اشتباه است";
      authError.value = Array.isArray(msg) ? msg.join("، ") : msg;
      toast(authError.value || "خطا در ورود", "err");
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 4. Register new user with username or mobile and password
   */
  const register = async (payload: {
    usernameOrMobile: string;
    password: string;
    fullName?: string;
  }) => {
    loading.value = true;
    authError.value = null;
    try {
      const res = await $fetch<{
        accessToken: string;
        user: AuthUser;
      }>("/api/v1/auth/register", {
        method: "POST",
        body: payload,
      });

      handleSuccess(
        res.user,
        res.accessToken,
        "ثبت‌نام شما در ویپ‌لب با موفقیت انجام شد 🎉"
      );
      return true;
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.statusMessage ||
        "خطا در ثبت‌نام کاربر";
      authError.value = Array.isArray(msg) ? msg.join("، ") : msg;
      toast(authError.value || "خطا در ثبت‌نام", "err");
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Backward-compatible login method
   */
  const login = async (credentials: { username: string; password: string }) => {
    return loginWithPassword(credentials.username, credentials.password);
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    }
    toast("با موفقیت خارج شدید", "ok");
  };

  return {
    user,
    token,
    isLoggedIn,
    authModalOpen,
    authMode,
    authTab,
    otpStep,
    otpPhone,
    authReason,
    loading,
    authError,
    openAuth,
    closeAuth,
    setAuthTab,
    setAuthMode,
    requireAuth,
    sendOtp,
    verifyOtp: loginWithOtp,
    loginWithOtp,
    loginWithPassword,
    register,
    login,
    logout,
  };
}
