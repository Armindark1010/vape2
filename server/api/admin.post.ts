import { setStock, setOrderStatus, deleteReview, createCoupon } from "../db/queries";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    switch (body?.action) {
      case "stock": {
        const id = Number(body.id);
        const stock = Number(body.stock);
        if (!id || Number.isNaN(stock)) throw new Error("bad payload");
        await setStock(id, Math.min(999, Math.max(0, stock)));
        return { ok: true };
      }
      case "order-status": {
        const id = Number(body.id);
        const allowed = ["pending", "processing", "shipped", "delivered", "refunded"];
        if (!id || !allowed.includes(body.status)) throw new Error("bad payload");
        await setOrderStatus(id, body.status);
        return { ok: true };
      }
      case "review-delete": {
        const id = Number(body.id);
        if (!id) throw new Error("bad payload");
        await deleteReview(id);
        return { ok: true };
      }
      case "coupon-create": {
        const code = String(body.code ?? "").toUpperCase().trim();
        const percent = Number(body.percent);
        if (!/^[A-Z0-9]{3,16}$/.test(code) || Number.isNaN(percent) || percent <= 0 || percent > 90) {
          throw createError({ statusCode: 400, message: "Code must be 3–16 letters/digits; percent 1–90." });
        }
        await createCoupon({
          code,
          description: body.description ? String(body.description) : `${percent}% off orders`,
          percent,
          minSubtotal: Number(body.minSubtotal) || 0,
        });
        return { ok: true };
      }
      default:
        throw createError({ statusCode: 400, message: "Unknown action." });
    }
  } catch (e: any) {
    if (e?.statusCode) throw e;
    console.error("admin mutation error", e);
    throw createError({ statusCode: 500, message: "Action failed." });
  }
});
