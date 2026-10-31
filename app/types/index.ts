export type ProductVariant = {
  id: string;
  name: string;
  color?: string;
  hex?: string;
  stock: number;
  image?: string;
};

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
  variants?: ProductVariant[];
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
  price: number;
  compareAt: number | null;
  image: string;
  qty: number;
  stock: number;
  variantId?: string | null;
  color?: string | null;
};

export type VItem = {
  k: string; // unique key incl. variantId/color/flavor/nicotine
  id: number;
  slug: string;
  name: string;
  img: string;
  price: number;
  oldPrice: number | null;
  qty: number;
  stock: number;
  variantId?: string | null;
  color?: string | null;
  flavor?: string | null;
  nicotine?: string | null;
};

export type VToast = {
  id: number;
  msg: string;
  kind: "ok" | "err";
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
  variantId?: string | null;
  color?: string | null;
};

export type OrderView = {
  id: number;
  number: string;
  name: string;
  email: string;
  phone?: string | null;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: string;
  paymentStatus?: "unpaid" | "paid" | "failed";
  paymentRef?: string | null;
  paymentGateway?: string | null;
  paymentDate?: string | null;
  trackingCode?: string | null;
  courier?: string | null;
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

export type AuthUser = {
  id: string | number;
  name?: string | null;
  fullName?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  role?: string;
  isAdmin?: boolean;
  createdAt?: string;
};

export type Address = {
  id: number;
  userId?: number | null;
  title: string;
  recipientName: string;
  recipientPhone: string;
  city: string;
  line1: string;
  line2?: string | null;
  zip: string;
  country?: string;
  isDefault: boolean;
  createdAt?: string;
};

export type Banner = {
  id: number;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  image: string;
  mobileImage?: string | null;
  link: string;
  buttonText: string;
  bgGradient?: string | null;
  textColor?: string | null;
  position: string;
  sortOrder: number;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
};


