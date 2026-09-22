import { inArray } from "drizzle-orm";
import { db } from "../db";
import { products } from "../db/schema";
import { createOrder, validateCoupon, getProducts } from "../db/queries";
import { FREE_SHIPPING, FLAT_SHIPPING } from "~/utils/vape";
import { commitReservation } from "../utils/reservation";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const items: { id: number; qty: number; variantId?: string; color?: string }[] = body?.items ?? [];
    const customer = body?.customer;
    const reservationId = body?.reservationId ? String(body.reservationId) : null;

    if (!Array.isArray(items) || items.length === 0) {
      throw createError({ statusCode: 400, message: "Your cart is empty." });
    }
    if (!customer?.name || !customer?.email || !customer?.line1 || !customer?.city || !customer?.zip) {
      throw createError({ statusCode: 400, message: "Please complete all required shipping fields." });
    }

    const ids = items.map((i) => Number(i.id));
    let byId = new Map<number, any>();

    if (db) {
      try {
        const rows = await db.select().from(products).where(inArray(products.id, ids));
        byId = new Map(rows.map((r) => [r.id, r]));
      } catch {
        /* fallback below */
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
      if (!p) throw createError({ statusCode: 400, message: "کالای انتخابی دیگر موجود نیست." });

      let currentStock = p.stock;
      let variantName = it.color || "";
      if (it.variantId && p.variants && Array.isArray(p.variants)) {
        const v = p.variants.find((x: any) => x.id === it.variantId || x.color === it.color);
        if (v) {
          currentStock = v.stock;
          variantName = v.color || v.name;
        }
      }

      if (currentStock < qty) {
        throw createError({
          statusCode: 409,
          message: `تنها ${currentStock} عدد از «${p.name}${variantName ? ` (${variantName})` : ''}» در انبار باقی مانده است. لطفاً سبد خود را اصلاح کنید.`,
        });
      }
      const price = p.discountPrice ?? p.price;
      subtotal += price * qty;
      orderItems.push({
        productId: p.id,
        name: variantName ? `${p.name} (${variantName})` : p.name,
        variantId: it.variantId || null,
        color: it.color || null,
        image: (p.images ?? [])[0] ?? "",
        price,
        qty,
      });
    }

    let discount = 0;
    let couponCode: string | null = null;
    if (body?.couponCode) {
      const coupon = await validateCoupon(String(body.couponCode));
      if (coupon && coupon.minSubtotal <= subtotal && coupon.percent != null) {
        discount = Math.round((subtotal * coupon.percent) / 100);
        couponCode = coupon.code;
      }
    }

    const shippingFee = subtotal - discount >= FREE_SHIPPING ? 0 : FLAT_SHIPPING;
    const total = subtotal - discount + shippingFee;

    const paymentMethod = body?.paymentMethod === "cod" ? "cod" : "online";
    const isCod = paymentMethod === "cod";

    const number = await createOrder({
      name: String(customer.name),
      email: String(customer.email),
      phone: customer.phone ? String(customer.phone) : null,
      shipping: {
        line1: String(customer.line1),
        line2: customer.line2 ? String(customer.line2) : undefined,
        city: String(customer.city),
        zip: String(customer.zip),
        country: customer.country ? String(customer.country) : "Iran",
      },
      couponCode,
      subtotal,
      discount,
      shippingFee,
      total,
      status: isCod ? "processing" : "pending",
      paymentStatus: "unpaid",
      paymentGateway: isCod ? "cod" : "shaparak_sim",
      courier: isCod
        ? "پیک اکسپرس تهران (پرداخت در محل)"
        : (customer.city === "تهران" ? "پیک ویژه اکسپرس تهران" : "پست پیشتاز هوایی"),
      items: orderItems,
    });

    return {
      ok: true,
      number,
      total,
      paymentMethod,
      paymentUrl: isCod ? `/order/${number}?status=cod` : `/payment/gateway?order=${number}`,
    };
  } catch (e: any) {
    if (e?.statusCode) throw e;
    console.error("checkout error", e);
    throw createError({ statusCode: 500, message: e?.message ?? "Something went wrong placing the order." });
  }
});
