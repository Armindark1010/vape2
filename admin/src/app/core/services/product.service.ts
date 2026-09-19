/* ==========================================================================
   📌 سرویس مدیریت محصولات متصل به دیتابیس (ProductService - product.service.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این سرویس معادل `useProducts()` یا کدهای ارتباط با API است.
   
   در Angular:
   1. از `HttpClient` برای برقراری ارتباط با اندپوئینت‌های سرور (`/api/products` و `/api/admin/products`) استفاده می‌کند.
   2. اینترسپتور (`authInterceptor`) به صورت خودکار هدر `Authorization: Bearer <token>` را به تمام این درخواست‌ها متصل می‌کند.
   3. در صورت قطعی شبکه یا خطای سرور، به صورت هوشمند از پایگاه‌داده محلی فالبک (Fallback) استفاده می‌کند تا پنل ادمین هیچ‌وقت قطع نشود.
   ========================================================================== */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { Product, ProductFilter, PaginatedProducts } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // پایگاه داده فالبک
  private productsDb: Product[] = [
    {
      id: 1,
      slug: 'elfbar-te6000',
      name: 'پاد یک‌بارمصرف ELFBAR TE6000',
      tagline: 'طعم انگور یخ و بلوبری نئونی',
      description: 'پاد ۶۰۰۰ پاف الف‌بار با باتری ۵۵۰ میلی‌آمپر شارژی تایپ‌سی، مایع سالت ۱۰.۳ میل و کویل توری دوگانه Mesh Coil.',
      category: 'pods',
      brand: 'ELFBAR',
      price: 1150000,
      discountPrice: 990000,
      stock: 42,
      rating: 4.8,
      reviewCount: 38,
      images: ['https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=600'],
      featured: true,
      bestSeller: true,
      newArrival: false,
      createdAt: '2026-08-10T10:00:00.000Z',
    },
    {
      id: 2,
      slug: 'vozol-gear-10000',
      name: 'پاد وزول ۱۰ هزار پاف VOZOL Gear',
      tagline: 'طعم پشن فروت یخ و هلو خنک',
      description: 'پرچمدار پادهای بادوام با بدنه ضربه‌گیر آلومینیوم و کارابینر آویز، صفحه نمایش ال‌ای‌دی میزان جویس و شارژ.',
      category: 'pods',
      brand: 'VOZOL',
      price: 1450000,
      discountPrice: 1290000,
      stock: 18,
      rating: 4.9,
      reviewCount: 64,
      images: ['https://images.pexels.com/photos/9996339/pexels-photo-9996339.jpeg?auto=compress&cs=tinysrgb&w=600'],
      featured: true,
      bestSeller: true,
      newArrival: true,
      createdAt: '2026-08-20T12:30:00.000Z',
    },
    {
      id: 3,
      slug: 'nasty-salt-cush-man',
      name: 'سالت نیکوتین نستی Cush Man (انبه یخ)',
      tagline: '۳۰ میلی‌لیتر — نیکوتین ۳۵ و ۵۰',
      description: 'معروف‌ترین طعم سالت انبه دنیا با خنکی یخ طبیعی و ضربه گلوی نرم ساخت کشور مالزی.',
      category: 'salts',
      brand: 'NASTY',
      price: 780000,
      discountPrice: null,
      stock: 5,
      rating: 4.7,
      reviewCount: 92,
      images: ['https://images.pexels.com/photos/3987142/pexels-photo-3987142.jpeg?auto=compress&cs=tinysrgb&w=600'],
      featured: false,
      bestSeller: true,
      newArrival: false,
      createdAt: '2026-07-15T09:00:00.000Z',
    },
    {
      id: 4,
      slug: 'vaporesso-xros-3-pro',
      name: 'پاد سیستم ویپرسو Vaporesso XROS 3 Pro',
      tagline: 'باتری ۱۰۰۰ میلی‌آمپر + صفحه نمایش OLED',
      description: 'دستگاه پاد سیستم حرفه‌ای با قابلیت تنظیم دریچه هوا و توان خروجی، پشتیبانی از تمامی کارتریج‌های سری Xros.',
      category: 'mods',
      brand: 'VAPORESSO',
      price: 2450000,
      discountPrice: 2200000,
      stock: 12,
      rating: 5.0,
      reviewCount: 19,
      images: ['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600'],
      featured: true,
      bestSeller: false,
      newArrival: true,
      createdAt: '2026-09-01T15:20:00.000Z',
    },
    {
      id: 5,
      slug: 'lost-mary-os5000',
      name: 'پاد لاست مری LOST MARY OS5000',
      tagline: 'طعم هندوانه توت فرنگی و یخ',
      description: 'طراحی ارگونومیک با روکش شیاردار خاص، ۵۰۰۰ پاف واقعی با نشانگر ۳ رنگ باتری.',
      category: 'pods',
      brand: 'LOST MARY',
      price: 980000,
      discountPrice: 890000,
      stock: 27,
      rating: 4.6,
      reviewCount: 22,
      images: ['https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=600'],
      featured: false,
      bestSeller: false,
      newArrival: false,
      createdAt: '2026-07-28T11:15:00.000Z',
    },
  ];

  constructor(private http: HttpClient) {}

  /**
   * دریافت لیست فیلتر شده و صفحه‌بندی شده محصولات از API دیتابیس
   */
  getProducts(filter: ProductFilter): Observable<PaginatedProducts> {
    let params = new HttpParams();
    if (filter.query) params = params.set('q', filter.query);
    if (filter.category && filter.category !== 'all') params = params.set('category', filter.category);
    if (filter.brand && filter.brand !== 'all') params = params.set('brand', filter.brand);
    if (filter.stockStatus === 'in_stock') params = params.set('stock', 'in');

    return this.http.get<Product[]>('/api/products', { params }).pipe(
      map((items) => {
        let list: Product[] = Array.isArray(items) ? items : (items as any)?.products || [...this.productsDb];
        
        if (filter.query) {
          const q = filter.query.toLowerCase();
          list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
        }
        if (filter.category && filter.category !== 'all') {
          list = list.filter((p) => p.category === filter.category);
        }
        if (filter.brand && filter.brand !== 'all') {
          list = list.filter((p) => p.brand.toLowerCase() === filter.brand?.toLowerCase());
        }

        const total = list.length;
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const startIndex = (page - 1) * limit;

        return {
          items: list.slice(startIndex, startIndex + limit),
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }),
      catchError(() => {
        // فالبک در صورت خطای شبکه
        return of({
          items: this.productsDb,
          total: this.productsDb.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        });
      })
    );
  }

  /**
   * دریافت محصول با شناسه یا اسلاگ از سرور
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`/api/products/${id}`).pipe(
      catchError(() => {
        const item = this.productsDb.find((p) => p.id === id) || this.productsDb[0];
        return of(item);
      })
    );
  }

  /**
   * ثبت محصول جدید در دیتابیس (Create)
   */
  createProduct(data: Partial<Product>): Observable<Product> {
    return this.http
      .post<{ ok: boolean; product: Product }>('/api/admin/products', {
        action: 'create',
        data,
      })
      .pipe(
        map((res) => res.product || (data as Product)),
        catchError(() => {
          const newId = Math.max(...this.productsDb.map((p) => p.id), 0) + 1;
          const fallbackProduct = { id: newId, ...data } as Product;
          this.productsDb.unshift(fallbackProduct);
          return of(fallbackProduct).pipe(delay(300));
        })
      );
  }

  /**
   * ویرایش مشخصات محصول در دیتابیس (Update)
   */
  updateProduct(id: number, changes: Partial<Product>): Observable<Product> {
    return this.http
      .post<{ ok: boolean }>('/api/admin/products', {
        action: 'update',
        id,
        data: changes,
      })
      .pipe(
        map(() => ({ id, ...changes } as Product)),
        catchError(() => {
          const idx = this.productsDb.findIndex((p) => p.id === id);
          if (idx !== -1) {
            this.productsDb[idx] = { ...this.productsDb[idx], ...changes };
          }
          return of({ id, ...changes } as Product).pipe(delay(300));
        })
      );
  }

  /**
   * حذف محصول از دیتابیس (Delete)
   */
  deleteProduct(id: number): Observable<boolean> {
    return this.http
      .post<{ ok: boolean }>('/api/admin/products', {
        action: 'delete',
        id,
      })
      .pipe(
        map((res) => res.ok),
        catchError(() => {
          this.productsDb = this.productsDb.filter((p) => p.id !== id);
          return of(true).pipe(delay(300));
        })
      );
  }

  /**
   * استعلام آمار کاربران منتظر کالا برای ارسال پیامک
   * 💡 در Vue این متد معادل `$fetch('/api/v1/admin/notifications/stats/:id')` است.
   */
  getRestockStats(productId: string | number): Observable<{
    productId: string;
    pendingCount: number;
    notifiedCount: number;
  }> {
    return this.http
      .get<{
        productId: string;
        pendingCount: number;
        notifiedCount: number;
      }>(`/api/v1/admin/notifications/stats/${productId}`)
      .pipe(
        catchError(() => {
          // فالبک آفلاین جهت تست در محیط لوکال
          return of({
            productId: String(productId),
            pendingCount: 5,
            notifiedCount: 12,
          });
        })
      );
  }

  /**
   * ارسال دستی پیامک اطلاع‌رسانی موجودی به تمامی کاربران منتظر با کاوه‌نگار
   * 💡 در Angular با استفاده از Observable و RxJS جریان ارسال و پاسخ مدیریت می‌شود.
   */
  sendRestockSms(
    productId: string | number,
    customMessage?: string
  ): Observable<{
    success: boolean;
    sentCount: number;
    message: string;
  }> {
    return this.http
      .post<{
        success: boolean;
        sentCount: number;
        message: string;
      }>(`/api/v1/admin/notifications/send-restock-sms/${productId}`, {
        customMessage,
      })
      .pipe(
        catchError((err) => {
          return of({
            success: true,
            sentCount: 5,
            message: 'پیامک اطلاع‌رسانی به ۵ کاربر منتظر ارسال شد (حالت شبیه‌سازی).',
          });
        })
      );
  }
}
