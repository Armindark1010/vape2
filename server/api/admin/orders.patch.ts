import { db } from "../../db/index";
import { orders } from "../../db/schema";
import { eq } from "drizzle-orm";
import { setOrderStatus } from "../../db/queries";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, status } = body || {};

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

  if (db) {
    try {
      await setOrderStatus(Number(id), status);
      const updated = await db.select().from(orders).where(eq(orders.id, Number(id))).limit(1);
      if (updated[0]) {
        return { ok: true, order: updated[0] };
      }
    } catch (err) {
      console.warn("Database updateOrderStatus error:", err);
    }
  }

  return { ok: true, id, status, updatedAt: new Date().toISOString() };
});
