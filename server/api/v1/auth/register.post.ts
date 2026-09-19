import { registerMemoryUser } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { usernameOrMobile, password, fullName } = body || {};

  if (!usernameOrMobile || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "نام کاربری یا شماره موبایل و رمز عبور الزامی است",
    });
  }

  // 1. First attempt to forward to NestJS Backend (if running on port 4000)
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:4000";
  try {
    const res = await $fetch(`${backendUrl}/api/v1/auth/register`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 1200,
    });
    return res;
  } catch (err: any) {
    // If backend is active and returned a business logic validation error (400, 401, 409), return it
    if (err?.statusCode && err.statusCode !== 502 && err.statusCode !== 503 && err.statusCode !== 504 && err?.data) {
      throw createError({
        statusCode: err.statusCode,
        statusMessage: err.data?.message || err.statusMessage || "خطا در ثبت‌نام",
        data: err.data,
      });
    }

    // 2. Seamless Fallback: Standalone In-Memory Database
    try {
      return registerMemoryUser({
        usernameOrMobile: String(usernameOrMobile),
        password: String(password),
        fullName: fullName ? String(fullName) : undefined,
      });
    } catch (memErr: any) {
      throw createError({
        statusCode: 400,
        statusMessage: memErr.message || "این کاربر قبلاً ثبت شده است",
      });
    }
  }
});
