import { trackOrder } from "../../db/queries";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const q = (query.q as string || query.number as string || "").trim();

  if (!q) {
    throw createError({
      statusCode: 400,
      message: "لطفاً شماره سفارش، شماره تماس یا ایمیل خود را وارد کنید.",
    });
  }

  const order = await trackOrder(q);
  if (!order) {
    throw createError({
      statusCode: 404,
      message: "سفارشی با این مشخصات یافت نشد. لطفاً شماره سفارش یا شماره موبایل را بررسی کنید.",
    });
  }

  return {
    ok: true,
    order,
  };
});
