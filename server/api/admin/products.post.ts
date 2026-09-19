import { db } from "../../db/index";
import { products, categories, brands } from "../../db/schema";
import { eq } from "drizzle-orm";
import { FALLBACK_PRODUCTS } from "../../db/fallbackData";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { action, id, data } = body || {};

  try {
    if (action === "delete") {
      if (!id) throw new Error("شناسه محصول الزامی است");
      if (db) {
        try {
          await db.delete(products).where(eq(products.id, Number(id)));
        } catch {}
      }
      const idx = FALLBACK_PRODUCTS.findIndex((p) => p.id === Number(id));
      if (idx !== -1) FALLBACK_PRODUCTS.splice(idx, 1);
      return { ok: true, deletedId: id };
    }

    if (action === "update") {
      if (!id || !data) throw new Error("اطلاعات ویرایش الزامی است");
      if (db) {
        try {
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
        } catch {}
      }
      const target = FALLBACK_PRODUCTS.find((p) => p.id === Number(id));
      if (target) {
        if (data.name !== undefined) target.name = data.name;
        if (data.tagline !== undefined) target.tagline = data.tagline;
        if (data.description !== undefined) target.description = data.description;
        if (data.price !== undefined) target.price = Number(data.price);
        if (data.discountPrice !== undefined) target.discountPrice = data.discountPrice ? Number(data.discountPrice) : null;
        if (data.stock !== undefined) target.stock = Number(data.stock);
        if (data.featured !== undefined) target.featured = Boolean(data.featured);
        if (data.bestSeller !== undefined) target.bestSeller = Boolean(data.bestSeller);
      }
      return { ok: true, id, ...data };
    }

    if (action === "create") {
      if (!data?.name || !data?.price) throw new Error("نام و قیمت محصول الزامی است");
      if (db) {
        try {
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
          if (inserted) return { ok: true, product: inserted };
        } catch {}
      }
      const newProduct = {
        id: Math.max(0, ...FALLBACK_PRODUCTS.map((p) => p.id)) + 1,
        slug: data.slug || `vapora-${Date.now()}`,
        name: data.name,
        tagline: data.tagline || "",
        description: data.description || "",
        specs: data.specs || {},
        price: Number(data.price),
        discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
        rating: 5.0,
        reviewCount: 0,
        stock: Number(data.stock) || 0,
        brand: data.brand || "VAPELAB",
        brandSlug: (data.brand || "vapelab").toLowerCase(),
        category: data.category || "پاد یک‌بارمصرف",
        categorySlug: "pods",
        images: data.images || [],
        featured: Boolean(data.featured),
        newArrival: true,
        bestSeller: Boolean(data.bestSeller),
        createdAt: new Date().toISOString(),
      };
      FALLBACK_PRODUCTS.unshift(newProduct as any);
      return { ok: true, product: newProduct };
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
