import { eq, gte, lte, sql, and, asc, desc } from 'drizzle-orm';
import { d as db } from './index.mjs';
import { pgTable, timestamp, boolean, jsonb, integer, text, serial, date, pgEnum } from 'drizzle-orm/pg-core';

const orderStatus = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "refunded"
]);
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  label: text("label").notNull().default("Home"),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull().default("United States")
});
const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description")
});
const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  featured: boolean("featured").notNull().default(true)
});
const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description").notNull(),
  specs: jsonb("specs").$type(),
  price: integer("price").notNull(),
  // cents / tomans
  discountPrice: integer("discount_price"),
  rating: integer("rating").notNull().default(0),
  // tenths of a star (e.g. 48 = 4.8)
  reviewCount: integer("review_count").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  brandId: integer("brand_id").references(() => brands.id),
  categoryId: integer("category_id").references(() => categories.id),
  images: jsonb("images").$type(),
  featured: boolean("featured").notNull().default(false),
  newArrival: boolean("new_arrival").notNull().default(false),
  bestSeller: boolean("best_seller").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  author: text("author").notNull(),
  rating: integer("rating").notNull(),
  title: text("title"),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  shipping: jsonb("shipping").$type(),
  couponCode: text("coupon_code"),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  shippingFee: integer("shipping_fee").notNull().default(0),
  total: integer("total").notNull(),
  status: orderStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id),
  name: text("name").notNull(),
  image: text("image"),
  price: integer("price").notNull(),
  qty: integer("qty").notNull()
});
pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  percent: integer("percent"),
  fixed: integer("fixed"),
  minSubtotal: integer("min_subtotal").notNull().default(0),
  active: boolean("active").notNull().default(true),
  validUntil: date("valid_until")
});
const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

const px = (id, w = 800) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const FALLBACK_IMAGES = {
  A: px(19344605),
  B: px(17962162),
  C: px(17962161),
  D: px(14472703),
  E: px(11587603),
  F: px(12345382),
  G: px(13870347),
  I: px(17962164)};
const FALLBACK_CATEGORIES = [
  { id: 1, name: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641", slug: "pods", description: "\u067E\u0627\u062F\u0647\u0627\u06CC \u0622\u0645\u0627\u062F\u0647 \u0645\u0635\u0631\u0641 \u0628\u0627 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC \u0645\u062A\u0646\u0648\u0639 \u2014 \u0628\u062F\u0648\u0646 \u0646\u06CC\u0627\u0632 \u0628\u0647 \u06A9\u0648\u06CC\u0644 \u0648 \u0633\u0627\u0644\u062A \u062C\u062F\u0627", image: FALLBACK_IMAGES.A, count: 6 },
  { id: 2, name: "\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646", slug: "salts", description: "\u0646\u0645\u06A9 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u0627\u0635\u0644 \u0628\u0627 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u06F2\u06F0 \u062A\u0627 \u06F5\u06F0 \u2014 \u062D\u0633 \u0646\u0631\u0645 \u0648 \u0634\u0628\u06CC\u0647 \u0633\u06CC\u06AF\u0627\u0631", image: FALLBACK_IMAGES.F, count: 3 },
  { id: 3, name: "\u0645\u0648\u062F \u0648 \u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645", slug: "mods", description: "\u062F\u0633\u062A\u06AF\u0627\u0647\u200C\u0647\u0627\u06CC \u0642\u0627\u0628\u0644 \u0634\u0627\u0631\u0698 \u0628\u0627 \u06A9\u0648\u06CC\u0644 \u0642\u0627\u0628\u0644 \u062A\u0639\u0648\u06CC\u0636 \u0628\u0631\u0627\u06CC \u0645\u0635\u0631\u0641 \u0631\u0648\u0632\u0627\u0646\u0647 \u0648 \u0627\u0642\u062A\u0635\u0627\u062F\u06CC", image: FALLBACK_IMAGES.C, count: 3 },
  { id: 4, name: "\u0644\u0648\u0627\u0632\u0645 \u062C\u0627\u0646\u0628\u06CC", slug: "gear", description: "\u06A9\u0648\u06CC\u0644\u060C \u0686\u0627\u0631\u062C\u0631\u060C \u06A9\u06CC\u0633 \u0648 \u0627\u0628\u0632\u0627\u0631 \u062A\u0645\u06CC\u0632\u06A9\u0627\u0631\u06CC \u0628\u0631\u0627\u06CC \u0646\u06AF\u0647\u062F\u0627\u0631\u06CC \u062D\u0631\u0641\u0647\u200C\u0627\u06CC", image: FALLBACK_IMAGES.I, count: 4 }
];
const FALLBACK_BRANDS = [
  { id: 1, name: "ELFBAR", slug: "elfbar", description: "\u067E\u0631\u0641\u0631\u0648\u0634\u200C\u062A\u0631\u06CC\u0646 \u0628\u0631\u0646\u062F \u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641 \u062C\u0647\u0627\u0646", count: 2 },
  { id: 2, name: "VOZOL", slug: "vozol", description: "\u067E\u0627\u062F\u0647\u0627\u06CC \u0642\u062F\u0631\u062A\u0645\u0646\u062F \u0628\u0627 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC \u062E\u0627\u0635", count: 2 },
  { id: 3, name: "LOST MARY", slug: "lostmary", description: "\u0637\u0631\u0627\u062D\u06CC \u0645\u062F\u0631\u0646 \u0648 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC \u0645\u06CC\u0648\u0647\u200C\u0627\u06CC \u062C\u0630\u0627\u0628", count: 1 },
  { id: 4, name: "IGET", slug: "iget", description: "\u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0644\u0627\u0633\u06CC\u06A9 \u0648\u0627\u067E\u0631\u0647\u0627\u06CC \u062D\u0631\u0641\u0647\u200C\u0627\u06CC", count: 1 },
  { id: 5, name: "AIR BAR", slug: "airbar", description: "\u067E\u0627\u062F\u0647\u0627\u06CC \u0633\u0628\u06A9 \u0648 \u062E\u0648\u0634\u200C\u062F\u0633\u062A", count: 1 },
  { id: 6, name: "VAPORESSO", slug: "vaporesso", description: "\u0645\u0648\u062F \u0648 \u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645 \u0628\u0627 \u062A\u06A9\u0646\u0648\u0644\u0648\u0698\u06CC \u0631\u0648\u0632", count: 3 },
  { id: 7, name: "NASTY", slug: "nasty", description: "\u0633\u0627\u0644\u062A\u200C\u0647\u0627\u06CC \u0645\u0637\u0631\u062D \u0645\u0627\u0644\u0632\u06CC\u0627\u06CC\u06CC", count: 1 },
  { id: 8, name: "VAPORA", slug: "vapora", description: "\u0628\u0631\u0646\u062F \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u0648\u06CC\u067E\u0648\u0631\u0627", count: 5 }
];
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    slug: "elfbar-te6000",
    name: "ELFBAR TE6000",
    tagline: "\u06F6\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \xB7 \u0637\u0639\u0645 \u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E \u{1F347}",
    description: "\u0627\u0644 \u0627\u0641 \u0628\u0627\u0631 TE6000 \u0628\u0627 \u06F6\u06F0\u06F0\u06F0 \u067E\u0627\u0641\u060C \u06F1\u06F5 \u0645\u06CC\u0644\u06CC\u200C\u0644\u06CC\u062A\u0631 \u062C\u0648\u062E \u0648 \u0628\u0627\u062A\u0631\u06CC \u06F6\u06F0\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u0622\u0645\u067E\u0631\u06CC\u060C \u0645\u062D\u0628\u0648\u0628\u200C\u062A\u0631\u06CC\u0646 \u0627\u0646\u062A\u062E\u0627\u0628 \u0648\u0627\u067E\u0631\u0647\u0627\u06CC \u0627\u06CC\u0631\u0627\u0646\u06CC \u0627\u0633\u062A. \u0637\u0639\u0645 \u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E \u0628\u0627 \u0633\u0631\u062F\u06CC \u0645\u062A\u0639\u0627\u062F\u0644\u060C \u06A9\u0634\u06CC\u062F\u0646\u0634 \u0631\u0627 \u0628\u0647 \u06CC\u06A9 \u0639\u0627\u062F\u062A \u062E\u0648\u0634\u200C\u0637\u0639\u0645 \u062A\u0628\u062F\u06CC\u0644 \u0645\u06CC\u200C\u06A9\u0646\u062F. \u062F\u0627\u0631\u0627\u06CC \u0647\u0648\u0644\u0648\u06AF\u0631\u0627\u0645 \u0627\u0635\u0627\u0644\u062A \u0648 \u06A9\u062F \u0627\u0633\u062A\u0639\u0644\u0627\u0645.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E \u{1F347}", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647 \u06CC\u062E\u06CC \u{1F349}", "\u0628\u0644\u0648\u0628\u0631\u06CC \u0631\u0627\u0632\u0628\u0631\u06CC", "\u062A\u0648\u062A\u200C\u0641\u0631\u0646\u06AF\u06CC \u06A9\u06CC\u0648\u06CC", "\u0633\u06CC\u0628 \u0633\u0628\u0632 \u{1F34F}", "\u0644\u06CC\u0686\u06CC"],
        nicotine: ["20", "50"],
        puffs: "\u06F6\u06F0\u06F0\u06F0 \u067E\u0627\u0641"
      }),
      "\u0645\u0642\u062F\u0627\u0631 \u062C\u0648\u062E": "15 ml",
      \u0628\u0627\u062A\u0631\u06CC: "600 mAh",
      \u0634\u0627\u0631\u0698: "Type-C",
      "\u0646\u0648\u0639 \u0637\u0639\u0645": "\u0645\u06CC\u0648\u0647\u200C\u0627\u06CC \u06CC\u062E\u06CC"
    },
    price: 115e4,
    discountPrice: 99e4,
    rating: 4.8,
    reviewCount: 214,
    stock: 46,
    brand: "ELFBAR",
    brandSlug: "elfbar",
    category: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641",
    categorySlug: "pods",
    images: [FALLBACK_IMAGES.A, FALLBACK_IMAGES.B],
    featured: true,
    newArrival: false,
    bestSeller: true,
    createdAt: new Date(Date.now() - 120 * 864e5).toISOString()
  },
  {
    id: 2,
    slug: "vozol-gecko-10000",
    name: "VOZOL GECKO 10000",
    tagline: "\u06F1\u06F0\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \xB7 \u0646\u0645\u0627\u06CC\u0634\u06AF\u0631 \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 \u26A1",
    description: "\u063A\u0648\u0644 \u062C\u062F\u06CC\u062F \u0648\u0648\u0632\u0648\u0644 \u0628\u0627 \u06F1\u06F0\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \u0648 \u0646\u0645\u0627\u06CC\u0634\u06AF\u0631 \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 \u06A9\u0647 \u0645\u06CC\u0632\u0627\u0646 \u062C\u0648\u062E \u0648 \u0628\u0627\u062A\u0631\u06CC \u0631\u0627 \u0646\u0634\u0627\u0646 \u0645\u06CC\u200C\u062F\u0647\u062F. \u062C\u0631\u06CC\u0627\u0646 \u0647\u0648\u0627 \u0642\u0627\u0628\u0644 \u062A\u0646\u0638\u06CC\u0645 \u0627\u0633\u062A \u0648 \u0637\u0639\u0645\u200C\u0647\u0627 \u062A\u0627 \u0622\u062E\u0631\u06CC\u0646 \u067E\u0627\u0641 \u06CC\u06A9\u062F\u0633\u062A \u0645\u06CC\u200C\u0645\u0627\u0646\u0646\u062F.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0628\u0644\u0648\u0628\u0631\u06CC \u0622\u06CC\u0633 \u{1FAD0}", "\u0627\u0646\u0628\u0647 \u{1F96D}", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647 \u0633\u0631\u062F", "\u06AF\u0631\u06CC\u067E\u200C\u0641\u0631\u0648\u062A", "\u06A9\u0648\u0644\u0627 \u06CC\u062E\u06CC"],
        nicotine: ["20", "50"],
        puffs: "\u06F1\u06F0\u06F0\u06F0\u06F0 \u067E\u0627\u0641"
      }),
      "\u0645\u0642\u062F\u0627\u0631 \u062C\u0648\u062E": "22 ml",
      \u0628\u0627\u062A\u0631\u06CC: "850 mAh",
      \u0646\u0645\u0627\u06CC\u0634\u06AF\u0631: "\u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 OLED"
    },
    price: 148e4,
    discountPrice: null,
    rating: 4.5,
    reviewCount: 87,
    stock: 30,
    brand: "VOZOL",
    brandSlug: "vozol",
    category: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641",
    categorySlug: "pods",
    images: [FALLBACK_IMAGES.B, FALLBACK_IMAGES.A],
    featured: false,
    newArrival: true,
    bestSeller: false,
    createdAt: new Date(Date.now() - 8 * 864e5).toISOString()
  },
  {
    id: 3,
    slug: "lostmary-os5000",
    name: "LOST MARY OS5000",
    tagline: "\u06F5\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \xB7 \u0637\u0631\u0627\u062D\u06CC \u0645\u062F\u0631\u0646 \u2728",
    description: "\u0644\u0627\u0633\u062A \u0645\u0627\u0631\u06CC \u0628\u0627 \u0628\u062F\u0646\u0647\u200C\u06CC \u0645\u0627\u062A \u0648 \u0627\u0631\u06AF\u0648\u0646\u0648\u0645\u06CC\u06A9\u060C \u06F5\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \u0645\u0627\u0646\u062F\u06AF\u0627\u0631\u06CC \u062F\u0627\u0631\u062F \u0648 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC\u0634 \u0628\u06CC\u0646\u200C\u0627\u0644\u0645\u0644\u0644\u06CC \u0647\u0633\u062A\u0646\u062F. \u0633\u0627\u06CC\u0632 \u06A9\u0648\u0686\u06A9 \u0648 \u0648\u0632\u0646 \u0633\u0628\u06A9\u0634 \u0628\u0631\u0627\u06CC \u0647\u0645\u0631\u0627\u0647\u200C\u062F\u0627\u0634\u062A\u0646 \u0631\u0648\u0632\u0627\u0646\u0647 \u0639\u0627\u0644\u06CC \u0627\u0633\u062A.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0647\u0644\u0648 \u{1F351}", "\u062A\u0648\u062A\u200C\u0641\u0631\u0646\u06AF\u06CC \u{1F353}", "\u0622\u0628\u200C\u0645\u06CC\u0648\u0647 \u0642\u0631\u0645\u0632", "\u0627\u0646\u06AF\u0648\u0631"],
        nicotine: ["20", "50"],
        puffs: "\u06F5\u06F0\u06F0\u06F0 \u067E\u0627\u0641"
      }),
      "\u0645\u0642\u062F\u0627\u0631 \u062C\u0648\u062E": "13 ml",
      \u0628\u0627\u062A\u0631\u06CC: "500 mAh"
    },
    price: 102e4,
    discountPrice: null,
    rating: 4.7,
    reviewCount: 142,
    stock: 55,
    brand: "LOST MARY",
    brandSlug: "lostmary",
    category: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641",
    categorySlug: "pods",
    images: [FALLBACK_IMAGES.C, FALLBACK_IMAGES.A],
    featured: false,
    newArrival: false,
    bestSeller: true,
    createdAt: new Date(Date.now() - 200 * 864e5).toISOString()
  },
  {
    id: 4,
    slug: "iget-xxl-5000",
    name: "IGET XXL 5000",
    tagline: "\u06F5\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \xB7 \u0637\u0639\u0645 \u06A9\u0644\u0627\u0633\u06CC\u06A9",
    description: "\u0622\u06CC\u200C\u06AF\u062A XXL \u0628\u0627 \u06F5\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \u0648 \u0633\u0627\u06CC\u0632 \u0628\u0632\u0631\u06AF\u060C \u0627\u0646\u062A\u062E\u0627\u0628 \u0642\u062F\u06CC\u0645\u06CC\u200C\u0647\u0627\u06CC \u062F\u0646\u06CC\u0627\u06CC \u0648\u06CC\u067E \u0627\u0633\u062A. \u0628\u062E\u0627\u0631 \u062D\u062C\u06CC\u0645 \u0648 \u06A9\u0634\u0634 \u0628\u0627\u0632\u060C \u062A\u062C\u0631\u0628\u0647\u200C\u0627\u06CC \u0646\u0632\u062F\u06CC\u06A9 \u0628\u0647 \u0645\u0648\u062F\u0647\u0627\u06CC \u062D\u0631\u0641\u0647\u200C\u0627\u06CC \u0645\u06CC\u200C\u062F\u0647\u062F.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0627\u0646\u06AF\u0648\u0631", "\u0628\u0644\u0648\u0628\u0631\u06CC", "\u0646\u0639\u0646\u0627\u0639", "\u062A\u0648\u062A\u200C\u0641\u0631\u0646\u06AF\u06CC"],
        nicotine: ["20", "50"],
        puffs: "\u06F5\u06F0\u06F0\u06F0 \u067E\u0627\u0641"
      }),
      "\u0645\u0642\u062F\u0627\u0631 \u062C\u0648\u062E": "12 ml",
      \u0628\u0627\u062A\u0631\u06CC: "550 mAh"
    },
    price: 89e4,
    discountPrice: null,
    rating: 4.4,
    reviewCount: 96,
    stock: 40,
    brand: "IGET",
    brandSlug: "iget",
    category: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641",
    categorySlug: "pods",
    images: [FALLBACK_IMAGES.D, FALLBACK_IMAGES.E],
    featured: true,
    newArrival: false,
    bestSeller: false,
    createdAt: new Date(Date.now() - 300 * 864e5).toISOString()
  },
  {
    id: 5,
    slug: "airbar-lux-4000",
    name: "AIR BAR LUX 4000",
    tagline: "\u06F4\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \xB7 \u0633\u0628\u06A9 \u0648 \u062E\u0648\u0634\u200C\u062F\u0633\u062A",
    description: "\u0627\u06CC\u0631\u0628\u0627\u0631 \u0633\u0628\u06A9\u200C\u062A\u0631\u06CC\u0646 \u0627\u0646\u062A\u062E\u0627\u0628 \u0631\u0648\u0632\u0645\u0631\u0647 \u0627\u0633\u062A\u061B \u06F4\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \u062F\u0631 \u0628\u062F\u0646\u0647\u200C\u0627\u06CC \u0628\u0627\u0631\u06CC\u06A9 \u06A9\u0647 \u062A\u0648\u06CC \u062C\u06CC\u0628 \u06AF\u0645 \u0645\u06CC\u200C\u0634\u0648\u062F. \u0637\u0639\u0645 \u0646\u0639\u0646\u0627\u0639 \u06CC\u062E\u06CC\u200C\u0627\u0634 \u0645\u0639\u0631\u0648\u0641 \u0627\u0633\u062A.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0646\u0639\u0646\u0627\u0639 \u06CC\u062E\u06CC \u2744\uFE0F", "\u0644\u06CC\u0645\u0648", "\u0627\u0646\u06AF\u0648\u0631", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647"],
        nicotine: ["20", "50"],
        puffs: "\u06F4\u06F0\u06F0\u06F0 \u067E\u0627\u0641"
      }),
      "\u0645\u0642\u062F\u0627\u0631 \u062C\u0648\u062E": "10 ml",
      \u0628\u0627\u062A\u0631\u06CC: "450 mAh"
    },
    price: 74e4,
    discountPrice: null,
    rating: 4.3,
    reviewCount: 61,
    stock: 64,
    brand: "AIR BAR",
    brandSlug: "airbar",
    category: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641",
    categorySlug: "pods",
    images: [FALLBACK_IMAGES.E, FALLBACK_IMAGES.D],
    featured: false,
    newArrival: false,
    bestSeller: false,
    createdAt: new Date(Date.now() - 90 * 864e5).toISOString()
  },
  {
    id: 6,
    slug: "vapora-puff-8000",
    name: "VAPORA PUFF 8000",
    tagline: "\u06F8\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \xB7 \u0628\u0631\u0646\u062F \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0648\u06CC\u067E\u0648\u0631\u0627 \u{1F3F7}\uFE0F",
    description: "\u067E\u0627\u062F \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u0648\u06CC\u067E\u0648\u0631\u0627 \u0628\u0627 \u06F8\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \u0648 \u0628\u0647\u062A\u0631\u06CC\u0646 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC \u067E\u0631\u0641\u0631\u0648\u0634 \u0628\u0627\u0632\u0627\u0631\u060C \u0628\u0627 \u0642\u06CC\u0645\u062A\u06CC \u0645\u0646\u0635\u0641\u0627\u0646\u0647\u200C\u062A\u0631 \u0648 \u0647\u0645\u0627\u0646 \u06A9\u06CC\u0641\u06CC\u062A \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E", "\u0628\u0644\u0648\u0628\u0631\u06CC \u0622\u06CC\u0633", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647 \u0633\u0631\u062F", "\u0627\u0646\u0628\u0647"],
        nicotine: ["20", "50"],
        puffs: "\u06F8\u06F0\u06F0\u06F0 \u067E\u0627\u0641"
      }),
      "\u0645\u0642\u062F\u0627\u0631 \u062C\u0648\u062E": "16 ml",
      \u0628\u0627\u062A\u0631\u06CC: "650 mAh"
    },
    price: 119e4,
    discountPrice: 105e4,
    rating: 4.6,
    reviewCount: 38,
    stock: 28,
    brand: "VAPORA",
    brandSlug: "vapora",
    category: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641",
    categorySlug: "pods",
    images: [FALLBACK_IMAGES.B, FALLBACK_IMAGES.D],
    featured: false,
    newArrival: true,
    bestSeller: false,
    createdAt: new Date(Date.now() - 4 * 864e5).toISOString()
  },
  {
    id: 7,
    slug: "vapora-salt-30",
    name: "VAPORA SALT 30ml",
    tagline: "\u0633\u0627\u0644\u062A \u06F3\u06F0 \u0645\u06CC\u0644 \xB7 \u0637\u0639\u0645 \u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E",
    description: "\u0633\u0627\u0644\u062A \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0648\u06CC\u067E\u0648\u0631\u0627 \u0628\u0627 \u06F3\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u0644\u06CC\u062A\u0631 \u062D\u062C\u0645 \u0648 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u06F3\u06F5/\u06F5\u06F0. \u062A\u0631\u06A9\u06CC\u0628 \u0627\u0646\u06AF\u0648\u0631 \u0648 \u0633\u0631\u062F\u06CC \u0646\u0639\u0646\u0627\u0639\u060C \u062A\u062C\u0631\u0628\u0647\u200C\u0627\u06CC \u0646\u0631\u0645 \u0648 \u0628\u06CC\u200C\u062E\u0634\u0648\u0646\u062A \u0645\u06CC\u200C\u0633\u0627\u0632\u062F.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E \u{1F347}", "\u0628\u0644\u0648\u0628\u0631\u06CC \u{1FAD0}", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647", "\u062A\u0646\u0628\u0627\u06A9\u0648 \u0648 \u06A9\u0627\u0631\u0627\u0645\u0644", "\u0646\u0639\u0646\u0627\u0639"],
        nicotine: ["35", "50"],
        salt: "\u0646\u0645\u06A9 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646"
      }),
      \u062D\u062C\u0645: "30 ml",
      "\u0646\u0633\u0628\u062A VG/PG": "50/50",
      \u06A9\u0634\u0648\u0631: "\u0645\u0627\u0644\u0632\u06CC"
    },
    price: 385e3,
    discountPrice: null,
    rating: 4.6,
    reviewCount: 173,
    stock: 80,
    brand: "VAPORA",
    brandSlug: "vapora",
    category: "\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646",
    categorySlug: "salts",
    images: [FALLBACK_IMAGES.F, FALLBACK_IMAGES.G],
    featured: false,
    newArrival: false,
    bestSeller: true,
    createdAt: new Date(Date.now() - 150 * 864e5).toISOString()
  },
  {
    id: 8,
    slug: "elfbar-salt-30",
    name: "ELFBAR SALT 30ml",
    tagline: "\u0633\u0627\u0644\u062A \u06F3\u06F0 \u0645\u06CC\u0644 \u0627\u0644 \u0627\u0641 \u0628\u0627\u0631 \xB7 \u0628\u0644\u0648\u0628\u0631\u06CC",
    description: "\u0633\u0627\u0644\u062A \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644 \u0627\u0644 \u0627\u0641 \u0628\u0627\u0631 \u062F\u0631 \u0628\u0637\u0631\u06CC \u06F3\u06F0 \u0645\u06CC\u0644 \u0628\u0627 \u0637\u0639\u0645 \u0628\u0644\u0648\u0628\u0631\u06CC \u0634\u06CC\u0631\u06CC\u0646 \u0648 \u0633\u0631\u062F\u06CC \u0645\u0644\u0627\u06CC\u0645. \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u0646\u0631\u0645 \u0648 \u0628\u0627 \u06A9\u06CC\u0641\u06CC\u062A \u062B\u0627\u0628\u062A.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0628\u0644\u0648\u0628\u0631\u06CC", "\u0627\u0646\u06AF\u0648\u0631", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647", "\u062A\u0648\u062A\u200C\u0641\u0631\u0646\u06AF\u06CC"],
        nicotine: ["35", "50"]
      }),
      \u062D\u062C\u0645: "30 ml",
      \u06A9\u0634\u0648\u0631: "\u0645\u0627\u0644\u0632\u06CC"
    },
    price: 42e4,
    discountPrice: null,
    rating: 4.5,
    reviewCount: 84,
    stock: 60,
    brand: "ELFBAR",
    brandSlug: "elfbar",
    category: "\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646",
    categorySlug: "salts",
    images: [FALLBACK_IMAGES.G, FALLBACK_IMAGES.F],
    featured: false,
    newArrival: false,
    bestSeller: false,
    createdAt: new Date(Date.now() - 150 * 864e5).toISOString()
  },
  {
    id: 9,
    slug: "nasty-salt-30",
    name: "NASTY SALT 30ml",
    tagline: "\u0633\u0627\u0644\u062A \u0646\u0633\u062A\u06CC \xB7 \u0637\u0639\u0645 \u062A\u0631\u0634 \u0648 \u0634\u06CC\u0631\u06CC\u0646 \u{1F36C}",
    description: "\u0646\u0627\u0633\u062A\u06CC \u0628\u0627 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC \u062C\u0633\u0648\u0631\u0627\u0646\u0647\u200C\u0627\u0634 \u0645\u0639\u0631\u0648\u0641 \u0627\u0633\u062A\u061B \u062A\u0631\u06A9\u06CC\u0628 \u062A\u0631\u0634 \u0648 \u0634\u06CC\u0631\u06CC\u0646 \u0628\u0627 \u0633\u0631\u062F\u06CC \u06A9\u0647 \u0637\u0631\u0641\u062F\u0627\u0631\u0627\u0646 \u062E\u0627\u0635 \u062E\u0648\u062F\u0634 \u0631\u0627 \u062F\u0627\u0631\u062F.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u06A9\u0634\u0646\u062F\u0647 \u062A\u0631\u0634 \u{1F36C}", "\u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E", "\u0628\u0644\u0648\u0628\u0631\u06CC"],
        nicotine: ["35", "50"]
      }),
      \u062D\u062C\u0645: "30 ml",
      \u06A9\u0634\u0648\u0631: "\u0645\u0627\u0644\u0632\u06CC"
    },
    price: 465e3,
    discountPrice: null,
    rating: 4.4,
    reviewCount: 51,
    stock: 36,
    brand: "NASTY",
    brandSlug: "nasty",
    category: "\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646",
    categorySlug: "salts",
    images: [FALLBACK_IMAGES.F],
    featured: false,
    newArrival: true,
    bestSeller: false,
    createdAt: new Date(Date.now() - 6 * 864e5).toISOString()
  },
  {
    id: 10,
    slug: "vaporesso-luxe-xr",
    name: "VAPORESSO LUXE XR",
    tagline: "\u0645\u0648\u062F \u06F4\u06F0 \u0648\u0627\u062A \xB7 \u06A9\u0648\u06CC\u0644 GTX \u{1F525}",
    description: "\u0644\u0648\u06A9\u0633 XR \u0628\u0627 \u062A\u0631\u0627\u0634\u0647 AXON \u062A\u0627 \u06F4\u06F0 \u0648\u0627\u062A \u062A\u0648\u0627\u0646\u060C \u0628\u0627\u062A\u0631\u06CC \u06F1\u06F8\u06F0\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u0622\u0645\u067E\u0631\u06CC \u062F\u0627\u062E\u0644\u06CC \u0648 \u06A9\u0648\u06CC\u0644\u200C\u0647\u0627\u06CC GTX\u060C \u06CC\u06A9\u06CC \u0627\u0632 \u0628\u0647\u062A\u0631\u06CC\u0646 \u0645\u0648\u062F\u0647\u0627\u06CC \u062C\u0645\u0639\u200C\u0648\u062C\u0648\u0631 \u0628\u0631\u0627\u06CC \u0645\u0635\u0631\u0641 \u0631\u0648\u0632\u0627\u0646\u0647 \u0627\u0633\u062A.",
    specs: {
      "\u062A\u0648\u0627\u0646 \u062E\u0631\u0648\u062C\u06CC": "5-40 W",
      \u0628\u0627\u062A\u0631\u06CC: "1800 mAh",
      "\u0645\u0642\u062F\u0627\u0631 \u062A\u0627\u0646\u06A9": "4 ml",
      "\u06A9\u0648\u06CC\u0644 \u0633\u0627\u0632\u06AF\u0627\u0631": "GTX 0.6/0.8 ohm",
      \u0634\u0627\u0631\u0698: "Type-C 2A"
    },
    price: 245e4,
    discountPrice: 215e4,
    rating: 4.8,
    reviewCount: 122,
    stock: 14,
    brand: "VAPORESSO",
    brandSlug: "vaporesso",
    category: "\u0645\u0648\u062F \u0648 \u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645",
    categorySlug: "mods",
    images: [FALLBACK_IMAGES.A, FALLBACK_IMAGES.D],
    featured: true,
    newArrival: false,
    bestSeller: true,
    createdAt: new Date(Date.now() - 260 * 864e5).toISOString()
  },
  {
    id: 11,
    slug: "vaporesso-xros3",
    name: "VAPORESSO XROS 3",
    tagline: "\u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645 XROS \xB7 \u06F1\u06F0\u06F0\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u0622\u0645\u067E\u0631",
    description: "\u0627\u06CC\u06A9\u0633\u200C\u0631\u0627\u0633 \u06F3 \u0628\u0627 \u0637\u0631\u0627\u062D\u06CC \u0628\u0627\u0631\u06CC\u06A9 \u0648 \u0628\u0627\u062A\u0631\u06CC \u06F1\u06F0\u06F0\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u0622\u0645\u067E\u0631\u06CC\u060C \u0645\u062D\u0628\u0648\u0628\u200C\u062A\u0631\u06CC\u0646 \u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645 \u062C\u0647\u0627\u0646 \u0627\u0633\u062A. \u06A9\u0648\u06CC\u0644\u200C\u0647\u0627\u06CC \u06F0.\u06F6 \u0648 \u06F0.\u06F8 \u0627\u0647\u0645 \u0628\u0627 \u0637\u0639\u0645 \u0639\u0627\u0644\u06CC.",
    specs: {
      \u0628\u0627\u062A\u0631\u06CC: "1000 mAh",
      "\u0645\u0642\u062F\u0627\u0631 \u062A\u0627\u0646\u06A9": "2 ml",
      "\u06A9\u0648\u06CC\u0644 \u0633\u0627\u0632\u06AF\u0627\u0631": "XROS 0.6/0.8/1.0 ohm",
      \u0634\u0627\u0631\u0698: "Type-C"
    },
    price: 189e4,
    discountPrice: null,
    rating: 4.7,
    reviewCount: 98,
    stock: 22,
    brand: "VAPORESSO",
    brandSlug: "vaporesso",
    category: "\u0645\u0648\u062F \u0648 \u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645",
    categorySlug: "mods",
    images: [FALLBACK_IMAGES.B, FALLBACK_IMAGES.C],
    featured: false,
    newArrival: false,
    bestSeller: false,
    createdAt: new Date(Date.now() - 180 * 864e5).toISOString()
  },
  {
    id: 12,
    slug: "xros-coil-pack",
    name: "XROS Coil Pack",
    tagline: "\u06A9\u0648\u06CC\u0644 \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644 XROS \u2014 \u067E\u06A9 \u06F4 \u0639\u062F\u062F\u06CC",
    description: "\u06A9\u0648\u06CC\u0644\u200C\u0647\u0627\u06CC \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644 \u0648\u0627\u067E\u0631\u0633\u0648 \u0628\u0631\u0627\u06CC \u062F\u0633\u062A\u06AF\u0627\u0647\u200C\u0647\u0627\u06CC XROS. \u067E\u06A9 \u06F4 \u0639\u062F\u062F\u06CC \u0628\u0627 \u0645\u0642\u0627\u0648\u0645\u062A\u200C\u0647\u0627\u06CC \u06F0.\u06F6\u060C \u06F0.\u06F8 \u0648 \u06F1.\u06F0 \u0627\u0647\u0645.",
    specs: {
      "\u0645\u0642\u0627\u0648\u0645\u062A\u200C\u0647\u0627": "0.6 / 0.8 / 1.0 ohm",
      \u062A\u0639\u062F\u0627\u062F: "4 \u0639\u062F\u062F",
      \u0633\u0627\u0632\u06AF\u0627\u0631\u06CC: "XROS 1/2/3/4"
    },
    price: 32e4,
    discountPrice: null,
    rating: 4.5,
    reviewCount: 210,
    stock: 120,
    brand: "VAPORESSO",
    brandSlug: "vaporesso",
    category: "\u0644\u0648\u0627\u0632\u0645 \u062C\u0627\u0646\u0628\u06CC",
    categorySlug: "gear",
    images: [FALLBACK_IMAGES.I, FALLBACK_IMAGES.G],
    featured: false,
    newArrival: false,
    bestSeller: true,
    createdAt: new Date(Date.now() - 300 * 864e5).toISOString()
  }
];
[
  { id: 1, author: "\u0639\u0644\u06CC \u0631.", rating: 5, title: "\u0639\u0627\u0644\u06CC \u0628\u0648\u062F", body: "\u0637\u0639\u0645 \u0648 \u0645\u0627\u0646\u062F\u06AF\u0627\u0631\u06CC \u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u0627\u0633\u062A. \u0627\u0631\u0633\u0627\u0644 \u0647\u0645 \u0633\u0631\u06CC\u0639 \u0628\u0648\u062F.", createdAt: (/* @__PURE__ */ new Date()).toISOString() },
  { id: 2, author: "\u0633\u0627\u0631\u0627 \u0645.", rating: 5, title: "\u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644 \u0648 \u0628\u0627\u06A9\u06CC\u0641\u06CC\u062A", body: "\u0647\u0648\u0644\u0648\u06AF\u0631\u0627\u0645 \u0631\u0648 \u0686\u06A9 \u06A9\u0631\u062F\u0645 \u06A9\u0627\u0645\u0644 \u0645\u0639\u062A\u0628\u0631 \u0628\u0648\u062F.", createdAt: (/* @__PURE__ */ new Date()).toISOString() }
];

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
  categorySlug: categories.slug
});
function toProduct(r) {
  var _a, _b, _c, _d, _e, _f;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    specs: (_a = r.specs) != null ? _a : {},
    price: r.price,
    discountPrice: r.discountPrice,
    rating: r.rating / 10,
    reviewCount: r.reviewCount,
    stock: r.stock,
    brand: (_b = r.brandName) != null ? _b : "VAPORA",
    brandSlug: (_c = r.brandSlug) != null ? _c : "vapora",
    category: (_d = r.categoryName) != null ? _d : "Other",
    categorySlug: (_e = r.categorySlug) != null ? _e : "other",
    images: (_f = r.images) != null ? _f : [],
    featured: r.featured,
    newArrival: r.newArrival,
    bestSeller: r.bestSeller,
    createdAt: r.createdAt.toISOString()
  };
}
async function getProducts(filters = {}, limit = 48) {
  if (db) {
    try {
      const conds = [];
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
      const where = conds.length ? and(...conds) : void 0;
      const sortSql = filters.sort === "price-asc" ? asc(sql`coalesce(${products.discountPrice}, ${products.price})`) : filters.sort === "price-desc" ? desc(sql`coalesce(${products.discountPrice}, ${products.price})`) : filters.sort === "newest" ? desc(products.createdAt) : filters.sort === "rating" ? desc(products.rating) : filters.sort === "popular" ? sql`(${products.bestSeller} desc, ${products.reviewCount} desc)` : desc(products.id);
      const rows = await db.select(productSelect()).from(products).leftJoin(brands, eq(products.brandId, brands.id)).leftJoin(categories, eq(products.categoryId, categories.id)).where(where).orderBy(sortSql).limit(limit);
      if (rows.length > 0) return rows.map(toProduct);
    } catch (err) {
      console.warn("Database getProducts error, using fallback catalog:", err);
    }
  }
  let list = [...FALLBACK_PRODUCTS];
  if (filters.category) list = list.filter((p) => p.categorySlug === filters.category);
  if (filters.brand) list = list.filter((p) => p.brandSlug === filters.brand);
  if (filters.min != null) list = list.filter((p) => {
    var _a;
    return ((_a = p.discountPrice) != null ? _a : p.price) >= filters.min;
  });
  if (filters.max != null) list = list.filter((p) => {
    var _a;
    return ((_a = p.discountPrice) != null ? _a : p.price) <= filters.max;
  });
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter((p) => {
      var _a;
      return p.name.toLowerCase().includes(q) || ((_a = p.tagline) == null ? void 0 : _a.toLowerCase().includes(q));
    });
  }
  if (filters.sort === "price-asc") list.sort((a, b) => {
    var _a, _b;
    return ((_a = a.discountPrice) != null ? _a : a.price) - ((_b = b.discountPrice) != null ? _b : b.price);
  });
  else if (filters.sort === "price-desc") list.sort((a, b) => {
    var _a, _b;
    return ((_a = b.discountPrice) != null ? _a : b.price) - ((_b = a.discountPrice) != null ? _b : a.price);
  });
  else if (filters.sort === "newest") list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  else if (filters.sort === "rating") list.sort((a, b) => b.rating - a.rating);
  return list.slice(0, limit);
}
async function getProductBySlug(slug) {
  var _a;
  if (db) {
    try {
      const rows = await db.select(productSelect()).from(products).leftJoin(brands, eq(products.brandId, brands.id)).leftJoin(categories, eq(products.categoryId, categories.id)).where(eq(products.slug, slug)).limit(1);
      if (rows[0]) return toProduct(rows[0]);
    } catch (err) {
      console.warn("Database getProductBySlug error, using fallback:", err);
    }
  }
  return (_a = FALLBACK_PRODUCTS.find((p) => p.slug === slug)) != null ? _a : null;
}
async function getCategories() {
  if (db) {
    try {
      const rows = await db.select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        image: categories.image,
        count: sql`count(${products.id})::int`
      }).from(categories).leftJoin(products, eq(categories.id, products.categoryId)).groupBy(categories.id).orderBy(asc(categories.id));
      if (rows.length > 0) return rows.map((r) => ({ ...r }));
    } catch (err) {
      console.warn("Database getCategories error, using fallback:", err);
    }
  }
  return FALLBACK_CATEGORIES;
}
async function getBrands() {
  if (db) {
    try {
      const rows = await db.select({
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
        description: brands.description,
        count: sql`count(${products.id})::int`
      }).from(brands).leftJoin(products, eq(brands.id, products.brandId)).groupBy(brands.id).orderBy(asc(brands.id));
      if (rows.length > 0) return rows.map((r) => ({ ...r }));
    } catch (err) {
      console.warn("Database getBrands error, using fallback:", err);
    }
  }
  return FALLBACK_BRANDS;
}
async function validateCoupon(code) {
  if (db) {
    try {
      const rows = await db.select().from(coupons).where(and(eq(coupons.code, code.toUpperCase()), eq(coupons.active, true))).limit(1);
      const r = rows[0];
      if (r) {
        if (r.validUntil && new Date(r.validUntil).getTime() < Date.now()) return null;
        return {
          code: r.code,
          description: r.description,
          percent: r.percent,
          fixed: r.fixed,
          minSubtotal: r.minSubtotal
        };
      }
    } catch (err) {
      console.warn("Database validateCoupon error, using fallback:", err);
    }
  }
  if (code.toUpperCase() === "WELCOME10" || code.toUpperCase() === "VAPORA" || code.toUpperCase() === "VAPORA15") {
    return {
      code: code.toUpperCase(),
      description: code.toUpperCase() === "VAPORA15" ? "\u06F1\u06F5 \u062F\u0631\u0635\u062F \u062A\u062E\u0641\u06CC\u0641 \u0648\u06CC\u0698\u0647" : "\u06F1\u06F0 \u062F\u0631\u0635\u062F \u062A\u062E\u0641\u06CC\u0641 \u0648\u06CC\u0698\u0647",
      percent: code.toUpperCase() === "VAPORA15" ? 15 : 10,
      fixed: null,
      minSubtotal: 0
    };
  }
  return null;
}
async function createOrder(input) {
  var _a, _b, _c;
  if (db) {
    try {
      const [order] = await db.insert(orders).values({
        number: `VPR-${Date.now().toString().slice(-6)}`,
        userId: (_a = input.userId) != null ? _a : null,
        name: input.name,
        email: input.email,
        phone: (_b = input.phone) != null ? _b : null,
        shipping: input.shipping,
        couponCode: (_c = input.couponCode) != null ? _c : null,
        subtotal: input.subtotal,
        discount: input.discount,
        shippingFee: input.shippingFee,
        total: input.total,
        status: "pending"
      }).returning();
      if (!order) {
        throw new Error("Failed to create order");
      }
      for (const it of input.items) {
        await db.insert(orderItems).values({ ...it, orderId: order.id });
        if (it.productId) {
          const p = await db.select({ stock: products.stock }).from(products).where(eq(products.id, it.productId)).limit(1);
          const pr = p[0];
          if (pr) {
            await db.update(products).set({ stock: sql`${products.stock} - ${it.qty}` }).where(eq(products.id, it.productId));
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
function mapOrderWithItems(o, items) {
  const mappedItems = items.map((i) => ({
    name: i.name,
    image: i.image,
    price: i.price,
    qty: i.qty,
    slug: null
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
    shipping: o.shipping
  };
}
async function getOrdersByEmail(email) {
  if (db) {
    try {
      const os = await db.select().from(orders).where(eq(orders.email, email)).orderBy(desc(orders.createdAt)).limit(50);
      const out = [];
      for (const o of os) {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
        out.push(mapOrderWithItems(o, items));
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
      name: "\u0622\u0631\u0645\u06CC\u0646",
      email,
      subtotal: 217e4,
      discount: 0,
      shippingFee: 0,
      total: 217e4,
      status: "pending",
      couponCode: null,
      createdAt: new Date(Date.now() - 864e5).toISOString(),
      items: [
        { name: "ELFBAR TE6000", image: FALLBACK_IMAGES.A, price: 99e4, qty: 1, slug: "elfbar-te6000" },
        { name: "VAPORA PUFF 8000", image: FALLBACK_IMAGES.B, price: 118e4, qty: 1, slug: "vapora-puff-8000" }
      ],
      shipping: { line1: "\u062A\u0647\u0631\u0627\u0646", city: "\u062A\u0647\u0631\u0627\u0646", zip: "12345", country: "\u0627\u06CC\u0631\u0627\u0646" }
    },
    {
      id: 2,
      number: "VPR-1005",
      name: "\u0622\u0631\u0645\u06CC\u0646",
      email,
      subtotal: 148e4,
      discount: 0,
      shippingFee: 0,
      total: 148e4,
      status: "processing",
      couponCode: null,
      createdAt: new Date(Date.now() - 2 * 864e5).toISOString(),
      items: [
        { name: "VOZOL GECKO 10000", image: FALLBACK_IMAGES.B, price: 148e4, qty: 1, slug: "vozol-gecko-10000" }
      ],
      shipping: { line1: "\u062A\u0647\u0631\u0627\u0646", city: "\u062A\u0647\u0631\u0627\u0646", zip: "12345", country: "\u0627\u06CC\u0631\u0627\u0646" }
    }
  ];
}
async function setOrderStatus(id, status) {
  if (db) {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
  }
}
async function createReview(input) {
  if (!db) return null;
  const [r] = await db.insert(reviews).values({
    productId: input.productId,
    author: input.author.slice(0, 60),
    rating: Math.min(5, Math.max(1, input.rating)),
    title: input.title.slice(0, 90),
    body: input.body.slice(0, 2e3)
  }).returning();
  const p = await db.select({ reviewCount: products.reviewCount }).from(products).where(eq(products.id, input.productId)).limit(1);
  if (p[0]) {
    await db.update(products).set({ reviewCount: p[0].reviewCount + 1 }).where(eq(products.id, input.productId));
  }
  return r;
}
async function deleteReview(id) {
  if (db) {
    await db.delete(reviews).where(eq(reviews.id, id));
  }
}
async function createContact(input) {
  if (db) {
    await db.insert(contactMessages).values(input);
  }
}
async function subscribe(email) {
  if (db) {
    await db.insert(subscribers).values({ email }).onConflictDoNothing();
  }
}
async function setStock(id, stock) {
  if (db) {
    await db.update(products).set({ stock: Math.max(0, stock) }).where(eq(products.id, id));
  }
}
async function createCoupon(input) {
  if (db) {
    await db.insert(coupons).values({
      code: input.code.toUpperCase(),
      description: input.description,
      percent: input.percent,
      fixed: null,
      minSubtotal: input.minSubtotal,
      active: true,
      validUntil: "2027-12-31"
    });
  }
}

export { setStock as a, getCategories as b, createCoupon as c, deleteReview as d, getBrands as e, createOrder as f, getProducts as g, createContact as h, subscribe as i, getOrdersByEmail as j, getProductBySlug as k, createReview as l, products as p, setOrderStatus as s, validateCoupon as v };
//# sourceMappingURL=queries.mjs.map
