import { createOrRenewReservation, type ReservationItem } from "../../../utils/reservation";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const items: ReservationItem[] = (body?.items ?? []).map((it: any) => ({
      productId: Number(it.productId ?? it.id),
      qty: Number(it.qty) || 1,
    }));
    const existingReservationId = body?.reservationId ? String(body.reservationId) : undefined;
    const holdMinutes = Number(body?.holdMinutes) || 15;

    if (!items.length) {
      throw createError({ statusCode: 400, message: "سبد خرید خالی است." });
    }

    const result = await createOrRenewReservation(items, existingReservationId, holdMinutes);

    if (!result.ok) {
      throw createError({
        statusCode: 409,
        statusMessage: "Stock Reservation Conflict",
        data: result,
        message: result.error || "موجودی کالاها برای رزرو کافی نیست.",
      });
    }

    return result;
  } catch (err: any) {
    if (err?.statusCode) throw err;
    console.error("Cart reserve error:", err);
    throw createError({
      statusCode: 500,
      message: err?.message || "خطا در رزرو موجودی کالاها",
    });
  }
});
