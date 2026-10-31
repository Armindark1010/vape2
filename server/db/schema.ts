import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";

export const orderStatus = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "refunded",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("منزل"),
  recipientName: text("recipient_name"),
  recipientPhone: text("recipient_phone"),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull().default("تهران"),
  zip: text("zip").notNull().default(""),
  country: text("country").notNull().default("Iran"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  featured: boolean("featured").notNull().default(true),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description").notNull(),
  specs: jsonb("specs").$type<Record<string, string>>(),
  price: integer("price").notNull(), // cents / tomans
  discountPrice: integer("discount_price"),
  rating: integer("rating").notNull().default(0), // tenths of a star (e.g. 48 = 4.8)
  reviewCount: integer("review_count").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  variants: jsonb("variants").$type<
    { id: string; name: string; color?: string; hex?: string; stock: number; image?: string }[]
  >(),
  brandId: integer("brand_id").references(() => brands.id),
  categoryId: integer("category_id").references(() => categories.id),
  images: jsonb("images").$type<string[]>(),
  featured: boolean("featured").notNull().default(false),
  newArrival: boolean("new_arrival").notNull().default(false),
  bestSeller: boolean("best_seller").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  author: text("author").notNull(),
  rating: integer("rating").notNull(),
  title: text("title"),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  shipping: jsonb("shipping").$type<{
    line1: string;
    line2?: string;
    city: string;
    zip: string;
    country: string;
  }>(),
  couponCode: text("coupon_code"),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  shippingFee: integer("shipping_fee").notNull().default(0),
  total: integer("total").notNull(),
  status: orderStatus("status").notNull().default("pending"),
  paymentStatus: text("payment_status").notNull().default("unpaid"),
  paymentRef: text("payment_ref"),
  paymentGateway: text("payment_gateway"),
  paymentDate: timestamp("payment_date"),
  trackingCode: text("tracking_code"),
  courier: text("courier"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id),
  name: text("name").notNull(),
  variantId: text("variant_id"),
  color: text("color"),
  image: text("image"),
  price: integer("price").notNull(),
  qty: integer("qty").notNull(),
});

export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  percent: integer("percent"),
  fixed: integer("fixed"),
  minSubtotal: integer("min_subtotal").notNull().default(0),
  active: boolean("active").notNull().default(true),
  validUntil: date("valid_until"),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  badge: text("badge"),
  image: text("image").notNull(),
  mobileImage: text("mobile_image"),
  link: text("link").notNull().default("/shop"),
  buttonText: text("button_text").notNull().default("مشاهده و خرید"),
  bgGradient: text("bg_gradient").default("from-vio to-ice"),
  textColor: text("text_color").default("light"),
  position: text("position").notNull().default("hero"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

