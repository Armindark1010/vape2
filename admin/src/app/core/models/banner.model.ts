/* ==========================================================================
   📌 مدل داده‌های بنر و اسلایدر (Banner Model - banner.model.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این اینترفیس معادل `types/index.ts -> Banner` است.
   در انگولار تایپ‌سیف بودن مدل‌ها باعث می‌شود کدهای کامپوننت و سرویس بدون خطا کامپایل شوند.
   ========================================================================== */

export interface Banner {
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
  position: 'hero' | 'middle' | 'sidebar' | string;
  sortOrder: number;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type BannerFormData = Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>;
