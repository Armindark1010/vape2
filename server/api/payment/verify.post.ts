import { getOrderByNumber, updateOrderPayment } from "../../db/queries";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const orderNumber = String(body?.orderNumber || "").trim();
  const status = body?.status === "failed" ? "failed" : "success";

  if (!orderNumber) {
    throw createError({ statusCode: 400, message: "شماره سفارش الزامی است." });
  }

  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    throw createError({ statusCode: 404, message: "سفارش مورد نظر یافت نشد." });
  }

  if (status === "failed") {
    const updated = await updateOrderPayment(orderNumber, {
      paymentStatus: "failed",
      paymentGateway: body?.gateway || "shaparak_sim",
    });
    return {
      ok: false,
      message: "تراکنش توسط کاربر لغو شد یا با خطای بانکی مواجه گردید.",
      order: updated,
      redirectUrl: `/order/${order.number}?status=failed`,
    };
  }

  // Success payment scenario
  const isTehran = (order.shipping?.city || "").includes("تهران");
  const courier = isTehran
    ? "پیک ویژه اکسپرس ویپ‌لب (تحویل ۲ ساعته در شهر تهران)"
    : "پست پیشتاز هوایی جمهوری اسلامی ایران";

  const paymentRef =
    body?.refId ||
    `RRN-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  const trackingCode =
    order.trackingCode ||
    `TRK-${isTehran ? "EXP" : "POST"}-${Math.floor(10000000 + Math.random() * 90000000)}`;

  const updated = await updateOrderPayment(orderNumber, {
    paymentStatus: "paid",
    paymentRef,
    paymentGateway: body?.gateway || "shaparak_sim",
    trackingCode,
    courier,
  });

  return {
    ok: true,
    message: "پرداخت با موفقیت انجام و سفارش تایید شد.",
    order: updated,
    redirectUrl: `/order/${order.number}?status=success`,
  };
});
