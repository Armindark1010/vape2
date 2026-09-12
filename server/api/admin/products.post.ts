import { db } from "../../db/index";
import { products, categories, brands } from "../../db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { action, id, data } = body || {};

  try {
    if (action === "delete") {
      if (!id) throw new Error("شناسه محصول الزامی است");
      if (db) {
        await db.delete(products).where(eq(products.id, Number(id)));
      }
      return { ok: true, deletedId: id };
    }

    if (action === "update") {
      if (!id || !data) throw new Error("اطلاعات ویرایش الزامی است");
      if (db) {
        await db
          .update(products)
          .set({
            name: data.name,
            tagline: data.tagline,
            description: data.description,
            price: Number(data.price),
            discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
            stock: Number(data.stock),
            featured: Boolean(data.featured),
            bestSeller: Boolean(data.bestSeller),
          })
          .where(eq(products.id, Number(id)));
      }
      return { ok: true, id, ...data };
    }

    if (action === "create") {
      if (!data?.name || !data?.price) throw new Error("نام و قیمت محصول الزامی است");
      if (db) {
        const [inserted] = await db
          .insert(products)
          .values({
            slug: data.slug || `vapora-${Date.now()}`,
            name: data.name,
            tagline: data.tagline || "",
            description: data.description || "",
            price: Number(data.price),
            discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
            stock: Number(data.stock) || 0,
            featured: Boolean(data.featured),
            bestSeller: Boolean(data.bestSeller),
            newArrival: true,
            images: data.images || [],
          })
          .returning();
        return { ok: true, product: inserted };
      }
      return { ok: true, product: { id: Date.now(), ...data } };
    }

    throw createError({
      statusCode: 400,
      statusMessage: "عملیات نامعتبر است",
    });
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || "خطا در پردازش عملیات محصول در دیتابیس",
    });
  }
});
