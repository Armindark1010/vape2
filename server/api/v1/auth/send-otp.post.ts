import { sendMemoryOtp } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { phoneNumber } = body || {};

  if (!phoneNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: "شماره موبایل الزامی است",
    });
  }

  // 1. First attempt to forward to NestJS Backend (if running on port 4000)
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:4000";
  try {
    const res = await $fetch(`${backendUrl}/api/v1/auth/send-otp`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 1200,
    });
    return res;
  } catch (err: any) {
    if (err?.statusCode && err.statusCode !== 502 && err.statusCode !== 503 && err.statusCode !== 504 && err?.data) {
      throw createError({
        statusCode: err.statusCode,
        statusMessage: err.data?.message || err.statusMessage || "خطا در ارسال پیامک",
        data: err.data,
      });
    }

    // 2. Seamless Fallback: Standalone In-Memory OTP
    return sendMemoryOtp(String(phoneNumber));
  }
});
