import { db } from "../../db/index";
import { orders, orderItems } from "../../db/schema";
import { desc, eq } from "drizzle-orm";
import { FALLBACK_ORDERS_SESSION } from "../../db/queries";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const status = query.status as string | undefined;

  if (db) {
    try {
      let q = db.select().from(orders);
      if (status && status !== "all") {
        q = q.where(eq(orders.status, status as any)) as any;
      }
      const os = await q.orderBy(desc(orders.createdAt)).limit(100);
      const out = [];
      for (const o of os) {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
        out.push({
          id: o.id,
          orderNumber: o.number,
          customer: {
            name: o.name,
            email: o.email,
            phone: o.phone || "---",
            address: o.shipping?.line1 || "تهران",
            city: o.shipping?.city || "تهران",
            postalCode: o.shipping?.zip || "12345",
          },
          items: items.map((it) => ({
            id: it.id,
            productId: it.productId || it.id,
            productName: it.name,
            image: it.image || "",
            price: it.price,
            quantity: it.qty,
          })),
          subtotal: o.subtotal,
          discount: o.discount,
          shippingFee: o.shippingFee,
          total: o.total,
          status: o.status,
          paymentMethod: o.paymentGateway === "cod" ? "پرداخت در محل (کارتخوان)" : "درگاه پرداخت آنلاین شتاب",
          createdAt: o.createdAt.toISOString(),
          updatedAt: o.createdAt.toISOString(),
        });
      }
      return out;
    } catch (dbErr) {
      console.warn("Database admin orders query fallback:", dbErr);
    }
  }


  // داده‌های پویا از حافظه جلسه (شامل سفارش‌های جدید ثبت‌شده در فرانت‌اند)
  let sessionOrders = [...FALLBACK_ORDERS_SESSION];
  if (status && status !== "all") {
    sessionOrders = sessionOrders.filter((o) => o.status === status);
  }

  return sessionOrders.map((o) => ({
    id: o.id,
    orderNumber: o.number,
    customer: {
      name: o.name,
      email: o.email,
      phone: o.phone || "---",
      address: o.shipping?.line1 || "تهران",
      city: o.shipping?.city || "تهران",
      postalCode: o.shipping?.zip || "12345",
    },
    items: o.items.map((it, idx) => ({
      id: idx + 1,
      productId: (it as any).variantId || idx + 1,
      productName: it.name,
      image: it.image || "",
      price: it.price,
      quantity: it.qty,
      flavor: (it as any).color || undefined,
    })),
    subtotal: o.subtotal,
    discount: o.discount,
    shippingFee: o.shippingFee,
    total: o.total,
    status: o.status,
    paymentMethod: o.paymentGateway === "cod" ? "پرداخت در محل (کارتخوان)" : "درگاه پرداخت آنلاین شتاب",
    createdAt: o.createdAt,
    updatedAt: o.createdAt,
  }));
});
