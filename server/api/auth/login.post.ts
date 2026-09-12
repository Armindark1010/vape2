import { loginMemoryUser } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body || {};

  if (!username || typeof username !== "string" || !password || typeof password !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "لطفاً نام کاربری و رمز عبور را وارد کنید",
    });
  }

  try {
    const result = loginMemoryUser({
      username: username.trim(),
      password: String(password),
    });

    return result;
  } catch (err: any) {
    throw createError({
      statusCode: 401,
      statusMessage: err?.message || "نام کاربری یا رمز عبور اشتباه است",
    });
  }
});
