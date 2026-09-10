export type Product = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  specs: Record<string, string>;
  price: number;
  discountPrice: number | null;
  rating: number; // 0..5
  reviewCount: number;
  stock: number;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  images: string[];
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  createdAt: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  count: number;
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  count: number;
};

export type Review = {
  id: number;
  author: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: string;
};

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  price: number; // effective price in cents
  compareAt: number | null;
  image: string;
  qty: number;
  stock: number;
};

export type Coupon = {
  code: string;
  description: string;
  percent: number | null;
  fixed: number | null;
  minSubtotal: number;
};

export type OrderItemView = {
  name: string;
  image: string | null;
  price: number;
  qty: number;
  slug?: string | null;
};

export type OrderView = {
  id: number;
  number: string;
  name: string;
  email: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: string;
  couponCode: string | null;
  createdAt: string;
  items: OrderItemView[];
  shipping: {
    line1: string;
    line2?: string;
    city: string;
    zip: string;
    country: string;
  } | null;
};

export type ShopFilters = {
  category?: string;
  brand?: string;
  min?: number;
  max?: number;
  rating?: number;
  stock?: "in";
  sort?: string;
  q?: string;
};
