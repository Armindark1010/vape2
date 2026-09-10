import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { createOrder, validateCoupon } from "@/db/queries";
import { FREE_SHIPPING, FLAT_SHIPPING } from "@/lib/vape";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: { id: number; qty: number }[] = body?.items ?? [];
    const customer = body?.customer;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }
    if (!customer?.name || !customer?.email || !customer?.line1 || !customer?.city || !customer?.zip) {
      return NextResponse.json({ error: "Please complete all required shipping fields." }, { status: 400 });
    }

    const ids = items.map((i) => Number(i.id));
    const rows = await db.select().from(products).where(inArray(products.id, ids));
    const byId = new Map(rows.map((r) => [r.id, r]));

    let subtotal = 0;
    const orderItems = [];
    for (const it of items) {
      const p = byId.get(Number(it.id));
      const qty = Math.max(1, Math.min(10, Number(it.qty) || 1));
      if (!p) return NextResponse.json({ error: "An item in your cart is no longer available." }, { status: 400 });
      if (p.stock < qty) {
        return NextResponse.json(
          { error: `Only ${p.stock} × ${p.name} left in stock. Please adjust your cart.` },
          { status: 409 }
        );
      }
      const price = p.discountPrice ?? p.price;
      subtotal += price * qty;
      orderItems.push({ productId: p.id, name: p.name, image: (p.images ?? [])[0] ?? "", price, qty });
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

    const number = await createOrder({
      name: String(customer.name),
      email: String(customer.email),
      phone: customer.phone ? String(customer.phone) : null,
      shipping: {
        line1: String(customer.line1),
        line2: customer.line2 ? String(customer.line2) : undefined,
        city: String(customer.city),
        zip: String(customer.zip),
        country: customer.country ? String(customer.country) : "United States",
      },
      couponCode,
      subtotal,
      discount,
      shippingFee,
      total,
      items: orderItems,
    });

    return NextResponse.json({ ok: true, number, total });
  } catch (e) {
    console.error("checkout error", e);
    return NextResponse.json({ error: "Something went wrong placing the order." }, { status: 500 });
  }
}
