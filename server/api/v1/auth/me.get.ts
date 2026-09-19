import { parseToken } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "توکن احراز هویت الزامی است",
    });
  }

  const token = authHeader.slice(7).trim();

  // 1. First attempt to forward to NestJS Backend (if running on port 4000)
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:4000";
  try {
    const res = await $fetch(`${backendUrl}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 1200,
    });
    return res;
  } catch (err: any) {
    if (err?.statusCode && err.statusCode !== 502 && err.statusCode !== 503 && err.statusCode !== 504 && err?.data) {
      throw createError({
        statusCode: err.statusCode,
        statusMessage: err.data?.message || err.statusMessage || "دسترسی غیرمجاز",
      });
    }

    // 2. Seamless Fallback: Standalone Token Parse
    const parsed = parseToken(token);
    if (!parsed) {
      throw createError({
        statusCode: 401,
        statusMessage: "توکن نامعتبر یا منقضی شده است",
      });
    }

    return {
      id: parsed.id,
      username: parsed.identifier,
      phoneNumber: parsed.identifier,
      role: "CUSTOMER",
    };
  }
});
