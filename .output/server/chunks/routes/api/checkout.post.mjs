import { c as defineEventHandler, r as readBody, e as createError } from '../../_/nitro.mjs';
import { inArray } from 'drizzle-orm';
import { d as db } from '../../_/index.mjs';
import { p as products, g as getProducts, v as validateCoupon, f as createOrder } from '../../_/queries.mjs';
import { F as FREE_SHIPPING, a as FLAT_SHIPPING } from '../../_/vape.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'drizzle-orm/node-postgres';
import 'pg';
import 'drizzle-orm/pg-core';

const checkout_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  try {
    const body = await readBody(event);
    const items = (_a = body == null ? void 0 : body.items) != null ? _a : [];
    const customer = body == null ? void 0 : body.customer;
    if (!Array.isArray(items) || items.length === 0) {
      throw createError({ statusCode: 400, message: "Your cart is empty." });
    }
    if (!(customer == null ? void 0 : customer.name) || !(customer == null ? void 0 : customer.email) || !(customer == null ? void 0 : customer.line1) || !(customer == null ? void 0 : customer.city) || !(customer == null ? void 0 : customer.zip)) {
      throw createError({ statusCode: 400, message: "Please complete all required shipping fields." });
    }
    const ids = items.map((i) => Number(i.id));
    let byId = /* @__PURE__ */ new Map();
    if (db) {
      try {
        const rows = await db.select().from(products).where(inArray(products.id, ids));
        byId = new Map(rows.map((r) => [r.id, r]));
      } catch {
      }
    }
    if (byId.size === 0) {
      const all = await getProducts({}, 100);
      byId = new Map(all.map((p) => [p.id, p]));
    }
    let subtotal = 0;
    const orderItems = [];
    for (const it of items) {
      const p = byId.get(Number(it.id));
      const qty = Math.max(1, Math.min(10, Number(it.qty) || 1));
      if (!p) throw createError({ statusCode: 400, message: "An item in your cart is no longer available." });
      if (p.stock < qty) {
        throw createError({
          statusCode: 409,
          message: `Only ${p.stock} \xD7 ${p.name} left in stock. Please adjust your cart.`
        });
      }
      const price = (_b = p.discountPrice) != null ? _b : p.price;
      subtotal += price * qty;
      orderItems.push({ productId: p.id, name: p.name, image: (_d = ((_c = p.images) != null ? _c : [])[0]) != null ? _d : "", price, qty });
    }
    let discount = 0;
    let couponCode = null;
    if (body == null ? void 0 : body.couponCode) {
      const coupon = await validateCoupon(String(body.couponCode));
      if (coupon && coupon.minSubtotal <= subtotal && coupon.percent != null) {
        discount = Math.round(subtotal * coupon.percent / 100);
        couponCode = coupon.code;
      }
    }
    const shippingFee = subtotal - discount >= FREE_SHIPPING ? 0 : FLAT_SHIPPING;
    const total = subtotal - discount + shippingFee;
    const number = await createOrder({
      name: String(customer.name),
      email: String(customer.email),
      phone: customer.phone ? String(customer.phone) : null,
      shipping: {
        line1: String(customer.line1),
        line2: customer.line2 ? String(customer.line2) : void 0,
        city: String(customer.city),
        zip: String(customer.zip),
        country: customer.country ? String(customer.country) : "Iran"
      },
      couponCode,
      subtotal,
      discount,
      shippingFee,
      total,
      items: orderItems
    });
    return { ok: true, number, total };
  } catch (e) {
    if (e == null ? void 0 : e.statusCode) throw e;
    console.error("checkout error", e);
    throw createError({ statusCode: 500, message: (_e = e == null ? void 0 : e.message) != null ? _e : "Something went wrong placing the order." });
  }
});

export { checkout_post as default };
//# sourceMappingURL=checkout.post.mjs.map
