import { c as defineEventHandler, r as readBody, e as createError } from '../../_/nitro.mjs';
import { c as createCoupon, d as deleteReview, s as setOrderStatus, a as setStock } from '../../_/queries.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'drizzle-orm';
import '../../_/index.mjs';
import 'drizzle-orm/node-postgres';
import 'pg';
import 'drizzle-orm/pg-core';

const admin_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    switch (body == null ? void 0 : body.action) {
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
        const code = String((_a = body.code) != null ? _a : "").toUpperCase().trim();
        const percent = Number(body.percent);
        if (!/^[A-Z0-9]{3,16}$/.test(code) || Number.isNaN(percent) || percent <= 0 || percent > 90) {
          throw createError({ statusCode: 400, message: "Code must be 3\u201316 letters/digits; percent 1\u201390." });
        }
        await createCoupon({
          code,
          description: body.description ? String(body.description) : `${percent}% off orders`,
          percent,
          minSubtotal: Number(body.minSubtotal) || 0
        });
        return { ok: true };
      }
      default:
        throw createError({ statusCode: 400, message: "Unknown action." });
    }
  } catch (e) {
    if (e == null ? void 0 : e.statusCode) throw e;
    console.error("admin mutation error", e);
    throw createError({ statusCode: 500, message: "Action failed." });
  }
});

export { admin_post as default };
//# sourceMappingURL=admin.post.mjs.map
