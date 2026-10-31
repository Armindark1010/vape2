import { setOrderStatus } from "../../db/queries";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, status, trackingCode, courier } = body || {};

  if (!id || !status) {
    throw createError({
      statusCode: 400,
      statusMessage: "شناسه سفارش و وضعیت جدید الزامی است",
    });
  }

  const allowedStatuses = ["pending", "processing", "shipped", "delivered", "refunded"];
  if (!allowedStatuses.includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: "وضعیت ارسال نامعتبر است",
    });
  }

  const updated = await setOrderStatus(id, status, { trackingCode, courier });

  return {
    ok: true,
    order: updated,
    id,
    status,
    updatedAt: new Date().toISOString(),
  };
});
