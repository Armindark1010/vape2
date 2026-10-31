import { getOrderByNumber } from "../../db/queries";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const orderNumber = String(body?.orderNumber || "").trim();

  if (!orderNumber) {
    throw createError({ statusCode: 400, message: "شماره سفارش الزامی است." });
  }

  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    throw createError({ statusCode: 404, message: "سفارش مورد نظر یافت نشد." });
  }

  // Real Zarinpal integration if merchant ID is provided in runtime env
  const zarinpalMerchant = process.env.ZARINPAL_MERCHANT_ID;
  if (zarinpalMerchant && zarinpalMerchant !== "sandbox" && !body?.forceSimulator) {
    try {
      const response = await $fetch<{ data?: { authority: string; code: number } }>(
        "https://api.zarinpal.com/pg/v4/payment/request.json",
        {
          method: "POST",
          body: {
            merchant_id: zarinpalMerchant,
            amount: order.total,
            description: `پرداخت سفارش ${order.number} - فروشگاه ویپ‌لب`,
            callback_url: `${getRequestURL(event).origin}/payment/callback?order=${order.number}`,
            metadata: {
              mobile: order.phone || undefined,
              email: order.email,
            },
          },
        }
      );
      if (response?.data?.authority) {
        return {
          ok: true,
          gatewayUrl: `https://www.zarinpal.com/pg/StartPay/${response.data.authority}`,
          isRealGateway: true,
        };
      }
    } catch (err) {
      console.warn("Zarinpal direct gateway error, falling back to smart simulator:", err);
    }
  }

  // Default: VAPELAB Shaparak Smart Simulator Gateway
  return {
    ok: true,
    gatewayUrl: `/payment/gateway?order=${order.number}`,
    isRealGateway: false,
  };
});
