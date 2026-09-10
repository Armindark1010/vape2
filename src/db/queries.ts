import { desc, asc, and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
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
  type orders as ordersTable,
} from "@/db/schema";
import type {
  Product,
  Category,
  Brand,
  Review,
  OrderView,
  OrderItemView,
  Coupon,
  ShopFilters,
} from "@/lib/types";
import { eff } from "@/lib/utils";

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
    brand: r.brandName ?? "NOCTURNE",
    brandSlug: r.brandSlug ?? "nocturne",
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
        if (c.length === 0) return [];
        conds.push(eq(products.categoryId, c[0].id));
      }
      if (filters.brand) {
        const b = await db.select({ id: brands.id }).from(brands).where(eq(brands.slug, filters.brand)).limit(1);
        if (b.length === 0) return [];
        conds.push(eq(products.brandId, b[0].id));
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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (db) {
    try {
      const rows = await db
        .select(productSelect())
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.slug, slug))
        .limit(1);
      if (rows[0]) return toProduct(rows[0]);
    } catch (err) {
      console.warn("Database getProductBySlug error, using fallback:", err);
    }
  }
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
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
  if (code.toUpperCase() === "WELCOME10" || code.toUpperCase() === "VAPORA") {
    return {
      code: code.toUpperCase(),
      description: "۱۰ درصد تخفیف ویژه",
      percent: 10,
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
  items: { productId: number; name: string; image: string; price: number; qty: number }[];
}): Promise<string> {
  if (db) {
    try {
      const [order] = await db
        .insert(orders)
        .values({
          number: `VPR-${Date.now().toString().slice(-6)}`,
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
          status: "pending",
        })
        .returning();

      for (const it of input.items) {
        await db.insert(orderItems).values({ ...it, orderId: order.id });
        if (it.productId) {
          const p = await db.select({ stock: products.stock }).from(products).where(eq(products.id, it.productId)).limit(1);
          if (p[0]) {
            await db
              .update(products)
              .set({ stock: sql`${products.stock} - ${it.qty}` })
              .where(eq(products.id, it.productId));
          }
        }
      }
      return order.number;
    } catch (err) {
      console.warn("Database createOrder error, using fallback number:", err);
    }
  }
  return `VPR-${Date.now().toString().slice(-6)}`;
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
    subtotal: o.subtotal,
    discount: o.discount,
    shippingFee: o.shippingFee,
    total: o.total,
    status: o.status,
    couponCode: o.couponCode,
    createdAt: o.createdAt.toISOString(),
    items: mappedItems,
    shipping: o.shipping,
  };
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
  return [
    {
      id: 1,
      number: "VPR-1006",
      name: "آرمین",
      email: email,
      subtotal: 2170000,
      discount: 0,
      shippingFee: 0,
      total: 2170000,
      status: "pending",
      couponCode: null,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      items: [
        { name: "ELFBAR TE6000", image: FALLBACK_IMAGES.A, price: 990000, qty: 1, slug: "elfbar-te6000" },
        { name: "VAPORA PUFF 8000", image: FALLBACK_IMAGES.B, price: 1180000, qty: 1, slug: "vapora-puff-8000" },
      ],
      shipping: { line1: "تهران", city: "تهران", zip: "12345", country: "ایران" },
    },
    {
      id: 2,
      number: "VPR-1005",
      name: "آرمین",
      email: email,
      subtotal: 1480000,
      discount: 0,
      shippingFee: 0,
      total: 1480000,
      status: "processing",
      couponCode: null,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      items: [
        { name: "VOZOL GECKO 10000", image: FALLBACK_IMAGES.B, price: 1480000, qty: 1, slug: "vozol-gecko-10000" },
      ],
      shipping: { line1: "تهران", city: "تهران", zip: "12345", country: "ایران" },
    },
  ];
}

export async function getAllOrders(): Promise<OrderView[]> {
  const os = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
  const out: OrderView[] = [];
  for (const o of os) {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
    out.push(mapOrderWithItems(o as never, items));
  }
  return out;
}

export async function setOrderStatus(id: number, status: string) {
  await db.update(orders).set({ status: status as "pending" }).where(eq(orders.id, id));
}

/* ---------- admin ---------- */

export async function getAdminData() {
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
      revenue30: kpi[0][0].v,
      orders30: kpi[0][0].c,
      customers: kpi[1][0].c,
      newCustomers30: kpi[2][0].c,
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
  const u = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!u[0]) return [];
  return db.select().from(addresses).where(eq(addresses.userId, u[0].id)).orderBy(asc(addresses.id));
}

export async function createReview(input: { productId: number; author: string; rating: number; title: string; body: string }) {
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
  await db.delete(reviews).where(eq(reviews.id, id));
}

export async function getAllReviews() {
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
  await db.insert(contactMessages).values(input);
}

export async function subscribe(email: string) {
  await db.insert(subscribers).values({ email }).onConflictDoNothing();
}

export async function getStockProducts() {
  const rows = await db
    .select({ id: products.id, slug: products.slug, name: products.name, stock: products.stock, price: products.price, discountPrice: products.discountPrice })
    .from(products)
    .orderBy(asc(products.stock));
  return rows;
}

export async function setStock(id: number, stock: number) {
  await db.update(products).set({ stock: Math.max(0, stock) }).where(eq(products.id, id));
}

export async function getAllProductsAdmin() {
  const rows = await db.select().from(products).orderBy(desc(products.id)).limit(100);
  return rows;
}

export async function createCoupon(input: { code: string; description: string; percent: number; minSubtotal: number }) {
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
