import { registerMemoryUser } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, username, email, phone, password } = body || {};

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: "لطفاً نام و نام خانوادگی خود را کامل وارد کنید",
    });
  }

  if (!username || typeof username !== "string" || username.trim().length < 3) {
    throw createError({
      statusCode: 400,
      statusMessage: "نام کاربری باید حداقل ۳ کاراکتر باشد",
    });
  }

  if (!password || typeof password !== "string" || password.length < 4) {
    throw createError({
      statusCode: 400,
      statusMessage: "رمز عبور باید حداقل ۴ کاراکتر باشد",
    });
  }

  const userEmail = email && typeof email === "string" && email.includes("@")
    ? email.trim()
    : `${username.trim()}@vapora.local`;

  try {
    const result = registerMemoryUser({
      name: name.trim(),
      username: username.trim(),
      email: userEmail,
      phone: phone ? String(phone).trim() : undefined,
      password: String(password),
    });

    return result;
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err?.message || "خطا در ثبت‌نام",
    });
  }
});
