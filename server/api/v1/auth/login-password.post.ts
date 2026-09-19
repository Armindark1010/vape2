import { loginMemoryUser } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { usernameOrMobile, password } = body || {};

  if (!usernameOrMobile || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "نام کاربری یا شماره موبایل و رمز عبور الزامی است",
    });
  }

  // 1. First attempt to forward to NestJS Backend (if running on port 4000)
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:4000";
  try {
    const res = await $fetch(`${backendUrl}/api/v1/auth/login-password`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 1200,
    });
    return res;
  } catch (err: any) {
    // If backend is active and returned 401/400
    if (err?.statusCode && err.statusCode !== 502 && err.statusCode !== 503 && err.statusCode !== 504 && err?.data) {
      throw createError({
        statusCode: err.statusCode,
        statusMessage: err.data?.message || err.statusMessage || "نام کاربری یا رمز عبور اشتباه است",
        data: err.data,
      });
    }

    // 2. Seamless Fallback: Standalone In-Memory Database
    try {
      return loginMemoryUser({
        usernameOrMobile: String(usernameOrMobile),
        password: String(password),
      });
    } catch (memErr: any) {
      throw createError({
        statusCode: 401,
        statusMessage: memErr.message || "نام کاربری یا رمز عبور اشتباه است",
      });
    }
  }
});
