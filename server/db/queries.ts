import { desc, asc, and, or, eq, gte, lte, sql, inArray } from "drizzle-orm";
import { db } from "./index";
import {
  products,
  brands,
  categories,
  reviews,
  orders,
  orderItems,
  coupons,
  users,
  addresses,
  subscribers,
  contactMessages,
  banners,
  type orders as ordersTable,
} from "./schema";
import type {
  Product,
  Category,
  Brand,
  Review,
  OrderView,
  OrderItemView,
  Address,
  Coupon,
  ShopFilters,
  Banner,
} from "~/types";

import { eff } from "~/utils/format";

/* ---------- products ---------- */

const productSelect = () => ({
  id: products.id,
  slug: products.slug,
  name: products.name,
  tagline: products.tagline,
  description: products.description,
  specs: products.specs,
  price: products.price,
  discountPrice: products.discountPrice,
  rating: products.rating,
  reviewCount: products.reviewCount,
  stock: products.stock,
  brandId: products.brandId,
  categoryId: products.categoryId,
  images: products.images,
  featured: products.featured,
  newArrival: products.newArrival,
  bestSeller: products.bestSeller,
  createdAt: products.createdAt,
  brandName: brands.name,
  brandSlug: brands.slug,
  categoryName: categories.name,
  categorySlug: categories.slug,
});

function toProduct(r: {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  specs: Record<string, string> | null;
  price: number;
  discountPrice: number | null;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[] | null;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  createdAt: Date;
  brandName: string | null;
  brandSlug: string | null;
  categoryName: string | null;
  categorySlug: string | null;
}): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    specs: r.specs ?? {},
    price: r.price,
    discountPrice: r.discountPrice,
    rating: r.rating / 10,
    reviewCount: r.reviewCount,
    stock: r.stock,
    brand: r.brandName ?? "VAPORA",
    brandSlug: r.brandSlug ?? "vapora",
    category: r.categoryName ?? "Other",
    categorySlug: r.categorySlug ?? "other",
    images: r.images ?? [],
    featured: r.featured,
    newArrival: r.newArrival,
    bestSeller: r.bestSeller,
    createdAt: r.createdAt.toISOString(),
  };
}

import {
  FALLBACK_PRODUCTS,
  FALLBACK_CATEGORIES,
  FALLBACK_BRANDS,
  FALLBACK_REVIEWS,
  FALLBACK_IMAGES,
} from "./fallbackData";

export async function getProducts(filters: ShopFilters = {}, limit = 48): Promise<Product[]> {
  if (db) {
    try {
      const conds: ReturnType<typeof sql>[] = [];
      if (filters.category) {
        const c = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, filters.category)).limit(1);
        const cat = c[0];
        if (!cat) return [];
        conds.push(eq(products.categoryId, cat.id));
      }
      if (filters.brand) {
        const b = await db.select({ id: brands.id }).from(brands).where(eq(brands.slug, filters.brand)).limit(1);
        const br = b[0];
        if (!br) return [];
        conds.push(eq(products.brandId, br.id));
      }
      if (filters.min != null) conds.push(gte(products.price, filters.min));
      if (filters.max != null) conds.push(lte(products.price, filters.max));
      if (filters.rating != null) conds.push(gte(products.rating, filters.rating * 10));
      if (filters.stock === "in") conds.push(gte(products.stock, 1));
      if (filters.q) {
        const q = `%${filters.q}%`;
        conds.push(sql`(${products.name} ilike ${q} or ${products.tagline} ilike ${q} or ${brands.name} ilike ${q} or ${categories.name} ilike ${q})`);
      }

      const where = conds.length ? and(...conds) : undefined;
      const sortSql =
        filters.sort === "price-asc"
          ? asc(sql`coalesce(${products.discountPrice}, ${products.price})`)
          : filters.sort === "price-desc"
            ? desc(sql`coalesce(${products.discountPrice}, ${products.price})`)
            : filters.sort === "newest"
              ? desc(products.createdAt)
              : filters.sort === "rating"
                ? desc(products.rating)
                : filters.sort === "popular"
                  ? sql`(${products.bestSeller} desc, ${products.reviewCount} desc)`
                  : desc(products.id);

      const rows = await db
        .select(productSelect())
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(where)
        .orderBy(sortSql)
        .limit(limit);

      if (rows.length > 0) return rows.map(toProduct);
    } catch (err) {
      console.warn("Database getProducts error, using fallback catalog:", err);
    }
  }

  let list = [...FALLBACK_PRODUCTS];
  if (filters.category) list = list.filter((p) => p.categorySlug === filters.category);
  if (filters.brand) list = list.filter((p) => p.brandSlug === filters.brand);
  if (filters.min != null) list = list.filter((p) => (p.discountPrice ?? p.price) >= filters.min!);
  if (filters.max != null) list = list.filter((p) => (p.discountPrice ?? p.price) <= filters.max!);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.tagline?.toLowerCase().includes(q));
  }
  if (filters.sort === "price-asc") list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
  else if (filters.sort === "price-desc") list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
  else if (filters.sort === "newest") list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  else if (filters.sort === "rating") list.sort((a, b) => b.rating - a.rating);

  return list.slice(0, limit);
}

export async function getProductBySlug(slugOrId: string | number): Promise<Product | null> {
  const isNumeric = typeof slugOrId === "number" || (!isNaN(Number(slugOrId)) && !isNaN(parseFloat(String(slugOrId))));
  const numId = isNumeric ? Number(slugOrId) : null;
  const slugStr = String(slugOrId);

  if (db) {
    try {
      const condition = numId !== null
        ? sql`(${products.id} = ${numId} or ${products.slug} = ${slugStr})`
        : eq(products.slug, slugStr);

      const rows = await db
        .select(productSelect())
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(condition)
        .limit(1);
      if (rows[0]) return toProduct(rows[0]);
    } catch (err) {
      console.warn("Database getProductBySlug error, using fallback:", err);
    }
  }
  return FALLBACK_PRODUCTS.find((p) => p.slug === slugStr || (numId !== null && p.id === numId)) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (db) {
    try {
      const c = await db
        .select(productSelect())
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(and(eq(categories.slug, product.categorySlug), sql`${products.id} != ${product.id}`))
        .limit(limit);
      if (c.length >= limit) return c.map(toProduct);
      const rest = await getProducts({}, limit * 2);
      const have = new Set(c.map((r) => r.id).concat(product.id));
      return rest.filter((p) => !have.has(p.id)).slice(0, limit).concat(c.map(toProduct)).slice(0, limit);
    } catch (err) {
      console.warn("Database getRelatedProducts error, using fallback:", err);
    }
  }
  return FALLBACK_PRODUCTS.filter((p) => p.slug !== product.slug && p.categorySlug === product.categorySlug).slice(0, limit);
}

export async function getReviews(productId: number): Promise<Review[]> {
  if (db) {
    try {
      const rows = await db
        .select({
          id: reviews.id,
          author: reviews.author,
          rating: reviews.rating,
          title: reviews.title,
          body: reviews.body,
          createdAt: reviews.createdAt,
        })
        .from(reviews)
        .where(eq(reviews.productId, productId))
        .orderBy(desc(reviews.createdAt))
        .limit(20);
      if (rows.length > 0) return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
    } catch (err) {
      console.warn("Database getReviews error, using fallback:", err);
    }
  }
  return FALLBACK_REVIEWS;
}

export async function getSearchIndex() {
  if (db) {
    try {
      const rows = await db.select(productSelect()).from(products).leftJoin(brands, eq(products.brandId, brands.id)).leftJoin(categories, eq(products.categoryId, categories.id));
      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          category: r.categoryName ?? "",
          categorySlug: r.categorySlug ?? "",
          brand: r.brandName ?? "",
          price: r.discountPrice ?? r.price,
          compareAt: r.discountPrice != null ? r.price : null,
          rating: r.rating / 10,
          image: r.images?.[0] ?? "",
          tagline: r.tagline ?? "",
        }));
      }
    } catch (err) {
      console.warn("Database getSearchIndex error, using fallback:", err);
    }
  }
  return FALLBACK_PRODUCTS.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    categorySlug: p.categorySlug,
    brand: p.brand,
    price: p.discountPrice ?? p.price,
    compareAt: p.discountPrice != null ? p.price : null,
    rating: p.rating,
    image: p.images[0] ?? "",
    tagline: p.tagline ?? "",
  }));
}

/* ---------- taxonomy ---------- */

export async function getCategories(): Promise<Category[]> {
  if (db) {
    try {
      const rows = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          image: categories.image,
          count: sql<number>`count(${products.id})::int`,
        })
        .from(categories)
        .leftJoin(products, eq(categories.id, products.categoryId))
        .groupBy(categories.id)
        .orderBy(asc(categories.id));
      if (rows.length > 0) return rows.map((r) => ({ ...r }));
    } catch (err) {
      console.warn("Database getCategories error, using fallback:", err);
    }
  }
  return FALLBACK_CATEGORIES;
}

export async function getBrands(): Promise<Brand[]> {
  if (db) {
    try {
      const rows = await db
        .select({
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
          description: brands.description,
          count: sql<number>`count(${products.id})::int`,
        })
        .from(brands)
        .leftJoin(products, eq(brands.id, products.brandId))
        .groupBy(brands.id)
        .orderBy(asc(brands.id));
      if (rows.length > 0) return rows.map((r) => ({ ...r }));
    } catch (err) {
      console.warn("Database getBrands error, using fallback:", err);
    }
  }
  return FALLBACK_BRANDS;
}

/* ---------- coupons ---------- */

export async function validateCoupon(code: string): Promise<Coupon | null> {
  if (db) {
    try {
      const rows = await db
        .select()
        .from(coupons)
        .where(and(eq(coupons.code, code.toUpperCase()), eq(coupons.active, true)))
        .limit(1);
      const r = rows[0];
      if (r) {
        if (r.validUntil && new Date(r.validUntil).getTime() < Date.now()) return null;
        return {
          code: r.code,
          description: r.description,
          percent: r.percent,
          fixed: r.fixed,
          minSubtotal: r.minSubtotal,
        };
      }
    } catch (err) {
      console.warn("Database validateCoupon error, using fallback:", err);
    }
  }
  if (code.toUpperCase() === "WELCOME10" || code.toUpperCase() === "VAPORA" || code.toUpperCase() === "VAPORA15") {
    return {
      code: code.toUpperCase(),
      description: code.toUpperCase() === "VAPORA15" ? "۱۵ درصد تخفیف ویژه" : "۱۰ درصد تخفیف ویژه",
      percent: code.toUpperCase() === "VAPORA15" ? 15 : 10,
      fixed: null,
      minSubtotal: 0,
    };
  }
  return null;
}

export async function getCoupons() {
  if (db) {
    try {
      return await db.select().from(coupons).orderBy(asc(coupons.id));
    } catch {
      /* fallback */
    }
  }
  return [];
}

/* ---------- orders ---------- */

/* ---------- in-memory orders cache for dev/fallback persistence ---------- */

export const FALLBACK_ORDERS_SESSION: OrderView[] = [
  {
    id: 1006,
    number: "VPR-1006",
    name: "آرمین دارک",
    email: "armin@vapelab.local",
    phone: "09121234567",
    subtotal: 2170000,
    discount: 0,
    shippingFee: 0,
    total: 2170000,
    status: "processing",
    paymentStatus: "paid",
    paymentRef: "RRN-9481023841",
    paymentGateway: "shaparak_sim",
    paymentDate: new Date(Date.now() - 3600000).toISOString(),
    trackingCode: "TRK-IRPOST-92847192",
    courier: "پیک ویژه اکسپرس ویپ‌لب (تحویل ۲ ساعته تهران)",
    couponCode: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    items: [
      { name: "ELFBAR TE6000", image: FALLBACK_IMAGES.A, price: 990000, qty: 1, slug: "elfbar-te6000" },
      { name: "VAPORA PUFF 8000", image: FALLBACK_IMAGES.B, price: 1180000, qty: 1, slug: "vapora-puff-8000" },
    ],
    shipping: { line1: "تهران، خیابان ولیعصر، برج سپهر، واحد ۱۲", city: "تهران", zip: "19839", country: "ایران" },
  },
  {
    id: 1005,
    number: "VPR-1005",
    name: "آرمین دارک",
    email: "armin@vapelab.local",
    phone: "09121234567",
    subtotal: 1480000,
    discount: 0,
    shippingFee: 0,
    total: 1480000,
    status: "delivered",
    paymentStatus: "paid",
    paymentRef: "RRN-4820194829",
    paymentGateway: "shaparak_sim",
    paymentDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    trackingCode: "TRK-POST-194820573",
    courier: "پست پیشتاز جمهوری اسلامی ایران",
    couponCode: null,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    items: [
      { name: "VOZOL GECKO 10000", image: FALLBACK_IMAGES.B, price: 1480000, qty: 1, slug: "vozol-gecko-10000" },
    ],
    shipping: { line1: "تهران، خیابان سعادت آباد، سرو غربی، پلاک ۲۴", city: "تهران", zip: "19987", country: "ایران" },
  },
];

/* ---------- orders ---------- */

export async function createOrder(input: {
  name: string;
  email: string;
  phone?: string | null;
  userId?: number | null;
  shipping: { line1: string; line2?: string; city: string; zip: string; country: string };
  couponCode?: string | null;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status?: "pending" | "processing" | "shipped" | "delivered" | "refunded";
  paymentStatus?: string;
  paymentGateway?: string;
  courier?: string;
  items: { productId: number; name: string; image: string; price: number; qty: number; variantId?: string | null; color?: string | null }[];
}): Promise<string> {
  const orderNumber = `VPR-${Date.now().toString().slice(-6)}`;

  // Always update in-memory fallback stock
  for (const it of input.items) {
    const p = FALLBACK_PRODUCTS.find((x) => x.id === it.productId);
    if (p) {
      p.stock = Math.max(0, p.stock - it.qty);
      if (p.variants && (it.variantId || it.color)) {
        const v = p.variants.find((x) => x.id === it.variantId || x.color === it.color);
        if (v) {
          v.stock = Math.max(0, v.stock - it.qty);
        }
      }
    }
  }

  if (db) {
    try {
      const [order] = await db
        .insert(orders)
        .values({
          number: orderNumber,
          userId: input.userId ?? null,
          name: input.name,
          email: input.email,
          phone: input.phone ?? null,
          shipping: input.shipping,
          couponCode: input.couponCode ?? null,
          subtotal: input.subtotal,
          discount: input.discount,
          shippingFee: input.shippingFee,
          total: input.total,
          status: input.status ?? "pending",
          paymentStatus: input.paymentStatus ?? "unpaid",
          paymentGateway: input.paymentGateway ?? null,
          courier: input.courier ?? null,
        })
        .returning();

      if (!order) {
        throw new Error("Failed to create order");
      }

      for (const it of input.items) {
        await db.insert(orderItems).values({ ...it, orderId: order.id });
        if (it.productId) {
          const p = await db.select({ stock: products.stock, variants: products.variants }).from(products).where(eq(products.id, it.productId)).limit(1);
          const pr = p[0];
          if (pr) {
            let updatedVariants = pr.variants;
            if (Array.isArray(updatedVariants) && (it.variantId || it.color)) {
              updatedVariants = updatedVariants.map((v) => {
                if (v.id === it.variantId || v.color === it.color) {
                  return { ...v, stock: Math.max(0, v.stock - it.qty) };
                }
                return v;
              });
            }
            await db
              .update(products)
              .set({
                stock: sql`${products.stock} - ${it.qty}`,
                variants: updatedVariants,
              })
              .where(eq(products.id, it.productId));
          }
        }
      }

      // Also track in session cache
      FALLBACK_ORDERS_SESSION.unshift({
        id: order.id,
        number: order.number,
        name: order.name,
        email: order.email,
        phone: order.phone,
        subtotal: order.subtotal,
        discount: order.discount,
        shippingFee: order.shippingFee,
        total: order.total,
        status: (order.status as any) ?? "pending",
        paymentStatus: (input.paymentStatus as any) ?? "unpaid",
        paymentGateway: input.paymentGateway ?? null,
        courier: input.courier ?? null,
        couponCode: order.couponCode,
        createdAt: order.createdAt.toISOString(),
        items: input.items.map((i) => ({
          name: i.name,
          image: i.image,
          price: i.price,
          qty: i.qty,
          variantId: i.variantId,
          color: i.color,
        })),
        shipping: order.shipping,
      });

      return order.number;
    } catch (err) {
      console.warn("Database createOrder error, using fallback number:", err);
    }
  }

  // Fallback in-memory save
  const newSessionOrder: OrderView = {
    id: Date.now(),
    number: orderNumber,
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    subtotal: input.subtotal,
    discount: input.discount,
    shippingFee: input.shippingFee,
    total: input.total,
    status: (input.status as any) ?? "pending",
    paymentStatus: (input.paymentStatus as any) ?? "unpaid",
    paymentGateway: input.paymentGateway ?? null,
    courier: input.courier ?? null,
    couponCode: input.couponCode ?? null,
    createdAt: new Date().toISOString(),
    items: input.items.map((i) => ({
      name: i.name,
      image: i.image,
      price: i.price,
      qty: i.qty,
      variantId: i.variantId,
      color: i.color,
    })),
    shipping: input.shipping,
  };
  FALLBACK_ORDERS_SESSION.unshift(newSessionOrder);
  return orderNumber;
}

function mapOrderWithItems(
  o: (typeof ordersTable.$inferSelect) & { _items?: (typeof orderItems.$inferSelect)[] },
  items: (typeof orderItems.$inferSelect)[]
): OrderView {
  const mappedItems: OrderItemView[] = items.map((i) => ({
    name: i.name,
    image: i.image,
    price: i.price,
    qty: i.qty,
    slug: null,
  }));
  return {
    id: o.id,
    number: o.number,
    name: o.name,
    email: o.email,
    phone: o.phone,
    subtotal: o.subtotal,
    discount: o.discount,
    shippingFee: o.shippingFee,
    total: o.total,
    status: o.status,
    paymentStatus: (o.paymentStatus as "unpaid" | "paid" | "failed") || "unpaid",
    paymentRef: o.paymentRef,
    paymentGateway: o.paymentGateway,
    paymentDate: o.paymentDate ? o.paymentDate.toISOString() : null,
    trackingCode: o.trackingCode,
    courier: o.courier,
    couponCode: o.couponCode,
    createdAt: o.createdAt.toISOString(),
    items: mappedItems,
    shipping: o.shipping,
  };
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderView | null> {
  const norm = orderNumber.trim().toUpperCase();
  if (db) {
    try {
      const rows = await db.select().from(orders).where(eq(orders.number, norm)).limit(1);
      if (rows[0]) {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, rows[0].id));
        return mapOrderWithItems(rows[0] as never, items);
      }
    } catch (err) {
      console.warn("Database getOrderByNumber error:", err);
    }
  }
  const match = FALLBACK_ORDERS_SESSION.find((o) => o.number.toUpperCase() === norm);
  return match ?? null;
}

export async function updateOrderPayment(
  orderNumber: string,
  data: {
    paymentStatus: "paid" | "failed";
    paymentRef?: string;
    paymentGateway?: string;
    trackingCode?: string;
    courier?: string;
  }
): Promise<OrderView | null> {
  const norm = orderNumber.trim().toUpperCase();
  const now = new Date();
  const newStatus = data.paymentStatus === "paid" ? "processing" : "pending";

  if (db) {
    try {
      const rows = await db.select().from(orders).where(eq(orders.number, norm)).limit(1);
      if (rows[0]) {
        await db
          .update(orders)
          .set({
            status: newStatus,
            paymentStatus: data.paymentStatus,
            paymentRef: data.paymentRef ?? null,
            paymentGateway: data.paymentGateway ?? "shaparak_sim",
            paymentDate: now,
            trackingCode: data.trackingCode ?? null,
            courier: data.courier ?? null,
          })
          .where(eq(orders.id, rows[0].id));

        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, rows[0].id));
        return mapOrderWithItems({ ...rows[0], status: newStatus, ...data, paymentDate: now } as never, items);
      }
    } catch (err) {
      console.warn("Database updateOrderPayment error:", err);
    }
  }

  // Update in session cache
  const idx = FALLBACK_ORDERS_SESSION.findIndex((o) => o.number.toUpperCase() === norm);
  if (idx !== -1 && FALLBACK_ORDERS_SESSION[idx]) {
    const existing = FALLBACK_ORDERS_SESSION[idx]!;
    existing.status = newStatus;
    existing.paymentStatus = data.paymentStatus;
    existing.paymentRef = data.paymentRef ?? existing.paymentRef ?? null;
    existing.paymentGateway = data.paymentGateway ?? "shaparak_sim";
    existing.paymentDate = now.toISOString();
    if (data.trackingCode) existing.trackingCode = data.trackingCode;
    if (data.courier) existing.courier = data.courier;
    return existing;
  }
  return null;
}

export async function trackOrder(query: string): Promise<OrderView | null> {
  const q = query.trim();
  if (!q) return null;

  // 1. Try by exact order number
  const byNum = await getOrderByNumber(q);
  if (byNum) return byNum;

  // 2. Try by phone or email in db
  if (db) {
    try {
      const rows = await db
        .select()
        .from(orders)
        .where(sql`${orders.phone} = ${q} OR ${orders.email} = ${q}`)
        .orderBy(desc(orders.createdAt))
        .limit(1);
      if (rows[0]) {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, rows[0].id));
        return mapOrderWithItems(rows[0] as never, items);
      }
    } catch (err) {
      console.warn("Database trackOrder error:", err);
    }
  }

  // 3. Try by phone or email in session cache
  const match = FALLBACK_ORDERS_SESSION.find((o) => (o.phone && o.phone.includes(q)) || (o.email && o.email.toLowerCase() === q.toLowerCase()));
  return match ?? null;
}

export async function getOrdersByEmail(email: string): Promise<OrderView[]> {
  if (db) {
    try {
      const os = await db.select().from(orders).where(eq(orders.email, email)).orderBy(desc(orders.createdAt)).limit(50);
      const out: OrderView[] = [];
      for (const o of os) {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
        out.push(mapOrderWithItems(o as never, items));
      }
      if (out.length > 0) return out;
    } catch (err) {
      console.warn("Database getOrdersByEmail error, using fallback:", err);
    }
  }
  const sessionUserOrders = FALLBACK_ORDERS_SESSION.filter((o) => o.email.toLowerCase() === email.toLowerCase());
  return sessionUserOrders.length > 0 ? sessionUserOrders : FALLBACK_ORDERS_SESSION;
}

export async function getOrdersForUser(criteria: { email?: string; phone?: string; numbers?: string[] }): Promise<OrderView[]> {
  const email = criteria.email?.trim().toLowerCase();
  const phone = criteria.phone?.trim();
  const numbers = criteria.numbers?.filter(Boolean) || [];

  if (db) {
    try {
      const conditions = [];
      if (email) conditions.push(eq(orders.email, email));
      if (phone) conditions.push(eq(orders.phone, phone));
      if (numbers.length > 0) conditions.push(inArray(orders.number, numbers));

      if (conditions.length > 0) {
        const os = await db.select().from(orders).where(or(...conditions)).orderBy(desc(orders.createdAt)).limit(50);
        const out: OrderView[] = [];
        for (const o of os) {
          const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
          out.push(mapOrderWithItems(o as never, items));
        }
        if (out.length > 0) return out;
      }
    } catch (err) {
      console.warn("Database getOrdersForUser error, using fallback:", err);
    }
  }

  // Fallback in-memory
  const matched = FALLBACK_ORDERS_SESSION.filter((o) => {
    if (email && o.email?.toLowerCase() === email) return true;
    if (phone && o.phone && o.phone.replace(/\s+/g, "") === phone.replace(/\s+/g, "")) return true;
    if (numbers.includes(o.number)) return true;
    return false;
  });

  return matched;
}

export async function getAllOrders(): Promise<OrderView[]> {
  if (db) {
    const os = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
    const out: OrderView[] = [];
    for (const o of os) {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
      out.push(mapOrderWithItems(o as never, items));
    }
    return out;
  }
  return FALLBACK_ORDERS_SESSION;
}

export async function setOrderStatus(
  orderIdOrNumber: number | string,
  status: string,
  extra?: { trackingCode?: string; courier?: string }
): Promise<OrderView | null> {
  const isNum = typeof orderIdOrNumber === "number" || !isNaN(Number(orderIdOrNumber));
  const id = isNum ? Number(orderIdOrNumber) : null;
  const numStr = String(orderIdOrNumber).trim().toUpperCase();

  if (db) {
    try {
      const condition = id ? eq(orders.id, id) : eq(orders.number, numStr);
      const updateData: any = { status: status as any };
      if (extra?.trackingCode) updateData.trackingCode = extra.trackingCode;
      if (extra?.courier) updateData.courier = extra.courier;

      await db.update(orders).set(updateData).where(condition);
      const rows = await db.select().from(orders).where(condition).limit(1);
      if (rows[0]) {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, rows[0].id));
        return mapOrderWithItems(rows[0] as never, items);
      }
    } catch (err) {
      console.warn("Database setOrderStatus error:", err);
    }
  }

  const match = FALLBACK_ORDERS_SESSION.find(
    (o) => (id && o.id === id) || o.number.toUpperCase() === numStr
  );
  if (match) {
    match.status = status;
    if (extra?.trackingCode) match.trackingCode = extra.trackingCode;
    if (extra?.courier) match.courier = extra.courier;
    return match;
  }
  return null;
}

/* ---------- addresses ---------- */

export const FALLBACK_ADDRESSES_SESSION: Address[] = [
  {
    id: 1,
    userId: 1,
    title: "منزل (تهران)",
    recipientName: "آرمان رضایی",
    recipientPhone: "09123456789",
    city: "تهران",
    line1: "سعادت‌آباد، خیابان سرو غربی، کوچه ارغوان، پلاک ۱۲، واحد ۴",
    line2: "زنگ چهارم",
    zip: "1998765432",
    country: "Iran",
    isDefault: true,
  },
  {
    id: 2,
    userId: 1,
    title: "محل کار (کرج)",
    recipientName: "آرمان رضایی",
    recipientPhone: "09123456789",
    city: "کرج",
    line1: "جهانشهر، بلوار مولانا، نبش کوچه یاس، ساختمان پارس، طبقه ۳",
    line2: "واحد ۸",
    zip: "3145678901",
    country: "Iran",
    isDefault: false,
  },
];

export async function getUserAddresses(userId?: number | null, phone?: string | null): Promise<Address[]> {
  if (db && userId) {
    try {
      const rows = await db.select().from(addresses).where(eq(addresses.userId, userId)).orderBy(desc(addresses.isDefault), desc(addresses.id));
      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          userId: r.userId,
          title: r.title,
          recipientName: r.recipientName || "",
          recipientPhone: r.recipientPhone || "",
          line1: r.line1,
          line2: r.line2,
          city: r.city,
          zip: r.zip,
          country: r.country,
          isDefault: r.isDefault,
          createdAt: r.createdAt ? r.createdAt.toISOString() : undefined,
        }));
      }
    } catch (err) {
      console.warn("Database getUserAddresses error, using fallback:", err);
    }
  }

  return FALLBACK_ADDRESSES_SESSION;
}

export async function addAddress(input: {
  userId?: number | null;
  title?: string;
  recipientName: string;
  recipientPhone: string;
  line1: string;
  line2?: string | null;
  city: string;
  zip?: string;
  country?: string;
  isDefault?: boolean;
}): Promise<Address> {
  const newId = Date.now();
  const isDefault = !!input.isDefault;

  if (isDefault) {
    FALLBACK_ADDRESSES_SESSION.forEach((a) => (a.isDefault = false));
  }

  const newAddr: Address = {
    id: newId,
    userId: input.userId ?? null,
    title: input.title || "منزل",
    recipientName: input.recipientName,
    recipientPhone: input.recipientPhone,
    line1: input.line1,
    line2: input.line2 || null,
    city: input.city || "تهران",
    zip: input.zip || "",
    country: input.country || "Iran",
    isDefault: isDefault || FALLBACK_ADDRESSES_SESSION.length === 0,
    createdAt: new Date().toISOString(),
  };

  if (db && input.userId) {
    try {
      if (isDefault) {
        await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, input.userId));
      }
      const [inserted] = await db
        .insert(addresses)
        .values({
          userId: input.userId,
          title: newAddr.title,
          recipientName: newAddr.recipientName,
          recipientPhone: newAddr.recipientPhone,
          line1: newAddr.line1,
          line2: newAddr.line2,
          city: newAddr.city,
          zip: newAddr.zip,
          country: newAddr.country,
          isDefault: newAddr.isDefault,
        })
        .returning();
      if (inserted) {
        newAddr.id = inserted.id;
      }
    } catch (err) {
      console.warn("Database addAddress error, using fallback:", err);
    }
  }

  FALLBACK_ADDRESSES_SESSION.unshift(newAddr);
  return newAddr;
}

export async function deleteAddress(id: number, userId?: number | null): Promise<boolean> {
  if (db) {
    try {
      await db.delete(addresses).where(eq(addresses.id, id));
    } catch (err) {
      console.warn("Database deleteAddress error:", err);
    }
  }

  const idx = FALLBACK_ADDRESSES_SESSION.findIndex((a) => a.id === id);
  if (idx !== -1) {
    FALLBACK_ADDRESSES_SESSION.splice(idx, 1);
    return true;
  }
  return false;
}

export async function setDefaultAddress(id: number, userId?: number | null): Promise<boolean> {
  if (db && userId) {
    try {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));
      await db.update(addresses).set({ isDefault: true }).where(eq(addresses.id, id));
    } catch (err) {
      console.warn("Database setDefaultAddress error:", err);
    }
  }

  FALLBACK_ADDRESSES_SESSION.forEach((a) => {
    a.isDefault = a.id === id;
  });
  return true;
}

/* ---------- admin ---------- */

export async function getAdminData() {
  if (!db) {
    return {
      revenue: [],
      ordersSeries: [],
      recentOrders: [],
      topProducts: [],
      lowStock: [],
      byStatus: [],
      kpi: { revenue30: 0, orders30: 0, customers: 0, newCustomers30: 0 },
      customers: [],
    };
  }
  const since30 = new Date(Date.now() - 30 * 86_400_000);

  const [monthRev, monthOrders, recent, top, low, byStatusRow, kpi, customers] = await Promise.all([
    db
      .select({
        m: sql<string>`to_char(date_trunc('month', ${orders.createdAt}), 'YYYY-MM')`,
        total: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
      })
      .from(orders)
      .where(sql`${orders.createdAt} >= ${new Date(Date.now() - 175 * 86_400_000)}`)
      .groupBy(sql`1`)
      .orderBy(sql`1`),
    db
      .select({
        m: sql<string>`to_char(date_trunc('month', ${orders.createdAt}), 'YYYY-MM')`,
        n: sql<number>`count(*)::int`,
      })
      .from(orders)
      .where(sql`${orders.createdAt} >= ${new Date(Date.now() - 175 * 86_400_000)}`)
      .groupBy(sql`1`)
      .orderBy(sql`1`),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(8),
    db
      .select({
        name: orderItems.name,
        image: orderItems.image,
        qty: sql<number>`sum(${orderItems.qty})::int`,
        revenue: sql<number>`sum(${orderItems.price} * ${orderItems.qty})::int`,
      })
      .from(orderItems)
      .groupBy(orderItems.name, orderItems.image)
      .orderBy(desc(sql`3`), desc(sql`4`))
      .limit(6),
    db.select({ id: products.id, name: products.name, stock: products.stock, slug: products.slug }).from(products).where(lte(products.stock, 10)).orderBy(asc(products.stock)).limit(8),
    db
      .select({
        status: orders.status,
        n: sql<number>`count(*)::int`,
      })
      .from(orders)
      .groupBy(orders.status),
    Promise.all([
      db.select({ v: sql<number>`coalesce(sum(${orders.total}), 0)::int`, c: sql<number>`count(*)::int` }).from(orders).where(gte(orders.createdAt, since30)),
      db.select({ c: sql<number>`count(distinct ${orders.email})::int` }).from(orders),
      db.select({ c: sql<number>`count(distinct ${orders.email})::int` }).from(orders).where(gte(orders.createdAt, since30)),
    ]),
    db
      .select({
        email: orders.email,
        name: sql<string>`max(${orders.name})`,
        n: sql<number>`count(*)::int`,
        spent: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
        last: sql<Date>`max(${orders.createdAt})`,
      })
      .from(orders)
      .groupBy(orders.email)
      .orderBy(desc(sql`4`))
      .limit(10),
  ]);

  const recentOrders: OrderView[] = [];
  for (const o of recent) {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
    recentOrders.push(mapOrderWithItems(o as never, items));
  }

  return {
    revenue: monthRev.map((r) => ({ m: r.m, total: r.total })),
    ordersSeries: monthOrders.map((r) => ({ m: r.m, n: r.n })),
    recentOrders,
    topProducts: top,
    lowStock: low,
    byStatus: byStatusRow,
    kpi: {
      revenue30: kpi[0]?.[0]?.v ?? 0,
      orders30: kpi[0]?.[0]?.c ?? 0,
      customers: kpi[1]?.[0]?.c ?? 0,
      newCustomers30: kpi[2]?.[0]?.c ?? 0,
    },
    customers: customers.map((c) => ({
      email: c.email,
      name: c.name,
      orders: c.n,
      spent: c.spent,
      last: new Date(c.last).toISOString(),
    })),
  };
}

/* ---------- account / misc ---------- */

export async function getAddressesByEmail(email: string) {
  if (!db) return [];
  const u = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!u[0]) return [];
  return db.select().from(addresses).where(eq(addresses.userId, u[0].id)).orderBy(asc(addresses.id));
}

export async function createReview(input: { productId: number; author: string; rating: number; title: string; body: string }) {
  if (!db) return null;
  const [r] = await db
    .insert(reviews)
    .values({
      productId: input.productId,
      author: input.author.slice(0, 60),
      rating: Math.min(5, Math.max(1, input.rating)),
      title: input.title.slice(0, 90),
      body: input.body.slice(0, 2000),
    })
    .returning();
  const p = await db.select({ reviewCount: products.reviewCount }).from(products).where(eq(products.id, input.productId)).limit(1);
  if (p[0]) {
    await db.update(products).set({ reviewCount: p[0].reviewCount + 1 }).where(eq(products.id, input.productId));
  }
  return r;
}

export async function deleteReview(id: number) {
  if (db) {
    await db.delete(reviews).where(eq(reviews.id, id));
  }
}

export async function getAllReviews() {
  if (!db) return [];
  const rows = await db
    .select({
      id: reviews.id,
      author: reviews.author,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      createdAt: reviews.createdAt,
      productId: reviews.productId,
      productName: products.name,
    })
    .from(reviews)
    .leftJoin(products, eq(reviews.productId, products.id))
    .orderBy(desc(reviews.createdAt))
    .limit(60);
  return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
}

export async function createContact(input: { name: string; email: string; subject: string; message: string }) {
  if (db) {
    await db.insert(contactMessages).values(input);
  }
}

export async function subscribe(email: string) {
  if (db) {
    await db.insert(subscribers).values({ email }).onConflictDoNothing();
  }
}

export async function getStockProducts() {
  if (!db) return [];
  const rows = await db
    .select({ id: products.id, slug: products.slug, name: products.name, stock: products.stock, price: products.price, discountPrice: products.discountPrice })
    .from(products)
    .orderBy(asc(products.stock));
  return rows;
}

export async function setStock(id: number, stock: number) {
  if (db) {
    await db.update(products).set({ stock: Math.max(0, stock) }).where(eq(products.id, id));
  }
}

export async function getAllProductsAdmin() {
  if (!db) return [];
  const rows = await db.select().from(products).orderBy(desc(products.id)).limit(100);
  return rows;
}

export async function createCoupon(input: { code: string; description: string; percent: number; minSubtotal: number }) {
  if (db) {
    await db.insert(coupons).values({
      code: input.code.toUpperCase(),
      description: input.description,
      percent: input.percent,
      fixed: null,
      minSubtotal: input.minSubtotal,
      active: true,
      validUntil: "2027-12-31",
    });
  }
}

export function productToCart(p: Product) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: eff(p.price, p.discountPrice),
    compareAt: p.discountPrice != null ? p.price : null,
    image: p.images[0] ?? "",
    qty: 1,
    stock: p.stock,
  };
}

/* ---------- banners ---------- */

export const FALLBACK_BANNERS: Banner[] = [
  {
    id: 1,
    title: "دودِ نرم، طعمِ ناب",
    subtitle: "تنوع بی‌نظیر جدیدترین پادهای ۱۰۰۰۰ پافی و سالت‌های ارجینال با هولوگرام اصالت",
    badge: "⚡ پیشنهاد ویژه این هفته",
    image: "https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=1400",
    mobileImage: "https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "/shop?sort=popular",
    buttonText: "مشاهده و خرید آنلاین",
    bgGradient: "from-vio to-ice",
    textColor: "light",
    position: "hero",
    sortOrder: 1,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "تخفیف ویژه سالت‌های نستی مالزی",
    subtitle: "تا ۱۵٪ تخفیف روی محبوب‌ترین طعم‌های Cush Man، انگور خنک و تنباکو کارامل",
    badge: "🔥 جشنواره تابستانه",
    image: "https://images.pexels.com/photos/14472703/pexels-photo-14472703.jpeg?auto=compress&cs=tinysrgb&w=1400",
    mobileImage: "https://images.pexels.com/photos/14472703/pexels-photo-14472703.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "/shop?category=salts",
    buttonText: "مشاهده طعم‌های سالت",
    bgGradient: "from-amber to-rose",
    textColor: "light",
    position: "hero",
    sortOrder: 2,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "پاد سیستم ویپرسو XROS 3 Pro",
    subtitle: "طراحی ارگونومیک، چیپست هوشمند و باتری فوق‌العاده بادوام برای استفاده روزمره",
    badge: "✨ جدیدترین ورود بازار",
    image: "https://images.pexels.com/photos/17962161/pexels-photo-17962161.jpeg?auto=compress&cs=tinysrgb&w=1400",
    mobileImage: "https://images.pexels.com/photos/17962161/pexels-photo-17962161.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "/product/vaporesso-xros-3-pro",
    buttonText: "بررسی مشخصات و قیمت",
    bgGradient: "from-neon to-ice",
    textColor: "light",
    position: "hero",
    sortOrder: 3,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "تا ۱۵٪ تخفیف روی همه سالت‌ها",
    subtitle: "کد تخفیف VAPELAB15 — در صفحه پرداخت وارد کنید و از ارسال اکسپرس بهره‌مند شوید",
    badge: "کد تخفیف اختصاصی",
    image: "https://images.pexels.com/photos/12345382/pexels-photo-12345382.jpeg?auto=compress&cs=tinysrgb&w=1200",
    mobileImage: "https://images.pexels.com/photos/12345382/pexels-photo-12345382.jpeg?auto=compress&cs=tinysrgb&w=800",
    link: "/shop?category=salts",
    buttonText: "خرید سالت با تخفیف",
    bgGradient: "from-neon to-ice",
    textColor: "light",
    position: "middle",
    sortOrder: 1,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getBanners(options?: { position?: string; activeOnly?: boolean }): Promise<Banner[]> {
  const activeOnly = options?.activeOnly ?? true;
  const position = options?.position;

  if (db) {
    try {
      let conditions = [];
      if (activeOnly) {
        conditions.push(eq(banners.active, true));
      }
      if (position) {
        conditions.push(eq(banners.position, position));
      }

      let q = db.select().from(banners);
      if (conditions.length > 0) {
        q = q.where(and(...conditions)) as any;
      }
      const rows = await q.orderBy(asc(banners.sortOrder), asc(banners.id));
      if (rows && rows.length > 0) {
        return rows.map((b) => ({
          id: b.id,
          title: b.title,
          subtitle: b.subtitle,
          badge: b.badge,
          image: b.image,
          mobileImage: b.mobileImage,
          link: b.link,
          buttonText: b.buttonText,
          bgGradient: b.bgGradient,
          textColor: b.textColor,
          position: b.position,
          sortOrder: b.sortOrder,
          active: b.active,
          startDate: b.startDate ? b.startDate.toISOString() : null,
          endDate: b.endDate ? b.endDate.toISOString() : null,
          createdAt: b.createdAt.toISOString(),
          updatedAt: b.updatedAt.toISOString(),
        }));
      }
    } catch (err) {
      console.warn("Database getBanners error, fallback:", err);
    }
  }

  let list = [...FALLBACK_BANNERS];
  if (activeOnly) {
    list = list.filter((b) => b.active);
  }
  if (position) {
    list = list.filter((b) => b.position === position);
  }
  return list.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getAdminBanners(): Promise<Banner[]> {
  return await getBanners({ activeOnly: false });
}

export async function createBanner(input: {
  title: string;
  subtitle?: string;
  badge?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
  bgGradient?: string;
  textColor?: string;
  position?: string;
  sortOrder?: number;
  active?: boolean;
}): Promise<Banner> {
  const now = new Date();
  if (db) {
    try {
      const [inserted] = await db
        .insert(banners)
        .values({
          title: input.title,
          subtitle: input.subtitle ?? null,
          badge: input.badge ?? null,
          image: input.image,
          mobileImage: input.mobileImage ?? null,
          link: input.link || "/shop",
          buttonText: input.buttonText || "مشاهده و خرید",
          bgGradient: input.bgGradient || "from-vio to-ice",
          textColor: input.textColor || "light",
          position: input.position || "hero",
          sortOrder: input.sortOrder ?? 0,
          active: input.active ?? true,
        })
        .returning();

      if (inserted) {
        return {
          id: inserted.id,
          title: inserted.title,
          subtitle: inserted.subtitle,
          badge: inserted.badge,
          image: inserted.image,
          mobileImage: inserted.mobileImage,
          link: inserted.link,
          buttonText: inserted.buttonText,
          bgGradient: inserted.bgGradient,
          textColor: inserted.textColor,
          position: inserted.position,
          sortOrder: inserted.sortOrder,
          active: inserted.active,
          startDate: inserted.startDate ? inserted.startDate.toISOString() : null,
          endDate: inserted.endDate ? inserted.endDate.toISOString() : null,
          createdAt: inserted.createdAt.toISOString(),
          updatedAt: inserted.updatedAt.toISOString(),
        };
      }
    } catch (err) {
      console.warn("Database createBanner error:", err);
    }
  }

  const newBanner: Banner = {
    id: Date.now(),
    title: input.title,
    subtitle: input.subtitle ?? null,
    badge: input.badge ?? null,
    image: input.image,
    mobileImage: input.mobileImage ?? null,
    link: input.link || "/shop",
    buttonText: input.buttonText || "مشاهده و خرید",
    bgGradient: input.bgGradient || "from-vio to-ice",
    textColor: input.textColor || "light",
    position: input.position || "hero",
    sortOrder: input.sortOrder ?? 0,
    active: input.active ?? true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  FALLBACK_BANNERS.push(newBanner);
  return newBanner;
}

export async function updateBanner(
  id: number,
  input: Partial<{
    title: string;
    subtitle?: string;
    badge?: string;
    image: string;
    mobileImage?: string;
    link: string;
    buttonText: string;
    bgGradient: string;
    textColor: string;
    position: string;
    sortOrder: number;
    active: boolean;
  }>
): Promise<Banner | null> {
  const now = new Date();
  if (db) {
    try {
      const updateData: any = { ...input, updatedAt: now };
      await db.update(banners).set(updateData).where(eq(banners.id, id));
      const [row] = await db.select().from(banners).where(eq(banners.id, id)).limit(1);
      if (row) {
        return {
          id: row.id,
          title: row.title,
          subtitle: row.subtitle,
          badge: row.badge,
          image: row.image,
          mobileImage: row.mobileImage,
          link: row.link,
          buttonText: row.buttonText,
          bgGradient: row.bgGradient,
          textColor: row.textColor,
          position: row.position,
          sortOrder: row.sortOrder,
          active: row.active,
          startDate: row.startDate ? row.startDate.toISOString() : null,
          endDate: row.endDate ? row.endDate.toISOString() : null,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        };
      }
    } catch (err) {
      console.warn("Database updateBanner error:", err);
    }
  }

  const idx = FALLBACK_BANNERS.findIndex((b) => b.id === id);
  if (idx !== -1 && FALLBACK_BANNERS[idx]) {
    FALLBACK_BANNERS[idx] = { ...FALLBACK_BANNERS[idx]!, ...input, updatedAt: now.toISOString() };
    return FALLBACK_BANNERS[idx]!;
  }
  return null;
}

export async function deleteBanner(id: number): Promise<boolean> {
  if (db) {
    try {
      await db.delete(banners).where(eq(banners.id, id));
      return true;
    } catch (err) {
      console.warn("Database deleteBanner error:", err);
    }
  }

  const idx = FALLBACK_BANNERS.findIndex((b) => b.id === id);
  if (idx !== -1) {
    FALLBACK_BANNERS.splice(idx, 1);
    return true;
  }
  return false;
}

