import { ref, computed } from "vue";
import type { AuthUser } from "~/types";
import { useVape } from "./useVape";

const user = ref<AuthUser | null>(null);
const token = ref<string | null>(null);
const authModalOpen = ref(false);
const authMode = ref<"login" | "register">("login");
const authReason = ref<string | null>(null);
const pendingAction = ref<(() => void) | null>(null);
const loading = ref(false);
const authError = ref<string | null>(null);
const hydrated = ref(false);

export function useAuth() {
  const { toast } = useVape();

  const init = () => {
    if (typeof window === "undefined" || hydrated.value) return;
    try {
      const savedUser = localStorage.getItem("vapora.auth.user");
      const savedToken = localStorage.getItem("vapora.auth.token");
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

  const isLoggedIn = computed(() => !!user.value);

  const openAuth = (
    mode: "login" | "register" = "login",
    reason?: string,
    onSuccess?: () => void
  ) => {
    authMode.value = mode;
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
  };

  /**
   * Helper: اگر کاربر لاگین بود اکشن را اجرا می‌کند؛
   * اگر لاگین نبود، مودال لاگین را باز می‌کند و پس از لاگین موفق، خودکار اکشن را انجام می‌دهد.
   */
  const requireAuth = (
    action: () => void,
    reason = "برای ادامه لطفاً وارد حساب کاربری شوید"
  ) => {
    if (isLoggedIn.value) {
      action();
    } else {
      openAuth("login", reason, action);
    }
  };

  const handleSuccess = (userData: AuthUser, userToken: string, successMsg: string) => {
    user.value = userData;
    token.value = userToken;
    if (typeof window !== "undefined") {
      localStorage.setItem("vapora.auth.user", JSON.stringify(userData));
      localStorage.setItem("vapora.auth.token", userToken);
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

  const login = async (credentials: { username: string; password: string }) => {
    loading.value = true;
    authError.value = null;
    try {
      const res = await $fetch<{ user: AuthUser; token: string }>("/api/auth/login", {
        method: "POST",
        body: credentials,
      });
      handleSuccess(res.user, res.token, `خوش آمدید، ${res.user.name || res.user.username} 👋`);
      return true;
    } catch (err: any) {
      authError.value = err?.data?.statusMessage || err?.data?.message || "نام کاربری یا رمز عبور اشتباه است";
      toast(authError.value || "خطا در ورود", "err");
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload: {
    name: string;
    username: string;
    email: string;
    phone?: string;
    password: string;
  }) => {
    loading.value = true;
    authError.value = null;
    try {
      const res = await $fetch<{ user: AuthUser; token: string }>("/api/auth/register", {
        method: "POST",
        body: payload,
      });
      handleSuccess(res.user, res.token, `ثبت‌نام شما با موفقیت انجام شد 🎉`);
      return true;
    } catch (err: any) {
      authError.value = err?.data?.statusMessage || err?.data?.message || "خطا در ثبت‌نام؛ لطفاً اطلاعات را بررسی کنید";
      toast(authError.value || "خطا در ثبت‌نام", "err");
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("vapora.auth.user");
      localStorage.removeItem("vapora.auth.token");
    }
    toast("از حساب کاربری خارج شدید");
  };

  return {
    user,
    token,
    isLoggedIn,
    authModalOpen,
    authMode,
    authReason,
    loading,
    authError,
    openAuth,
    closeAuth,
    requireAuth,
    login,
    register,
    logout,
    init,
  };
}
