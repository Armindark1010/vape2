/* ==========================================================================
   📌 مدل محصول و فیلترهای فروشگاه ویپ (Product & Filters Model - product.model.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt این ساختار در `app/types/index.ts` تعریف می‌شد و در کامپوننت‌های
   ProductCard و Shop استفاده می‌شد.
   ========================================================================== */

export interface Product {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  createdAt: string;
}

export interface ProductFilter {
  query?: string;
  category?: string;
  brand?: string;
  stockStatus?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'stock';
  page: number;
  limit: number;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
