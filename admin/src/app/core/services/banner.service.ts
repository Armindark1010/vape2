/* ==========================================================================
   📌 سرویس بنرها و اسلایدرهای متصل به دیتابیس (BannerService - banner.service.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این سرویس معادل `useBanners()` و کدهای ارتباط با API بنرهاست.
   در Angular:
   1. دریافت لیست کامل بنرها از `/api/admin/banners`
   2. ایجاد بنر جدید در دیتابیس با متد POST
   3. به‌روزرسانی مشخصات یا وضعیت فعال/غیرفعال بنر با متد PATCH
   4. حذف بنر با متد DELETE
   ========================================================================== */

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Banner, BannerFormData } from '../models/banner.model';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  // سیگنال وضعیت بنرها برای واکنش‌پذیری آنی در UI (Angular Signal = معادل ref() در Vue 3)
  readonly bannersSignal = signal<Banner[]>([]);
  readonly loadingSignal = signal<boolean>(false);

  // دیتابیس فالبک در صورت قطعی موقت ارتباط سرور
  private fallbackBanners: Banner[] = [
    {
      id: 1,
      title: 'دودِ نرم، طعمِ ناب',
      subtitle: 'تنوع بی‌نظیر جدیدترین پادهای ۱۰۰۰۰ پافی و سالت‌های ارجینال با هولوگرام اصالت',
      badge: '⚡ پیشنهاد ویژه این هفته',
      image: 'https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=1400',
      mobileImage: 'https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=800',
      link: '/shop?sort=popular',
      buttonText: 'مشاهده و خرید آنلاین',
      bgGradient: 'from-vio to-ice',
      textColor: 'light',
      position: 'hero',
      sortOrder: 1,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'تخفیف ویژه سالت‌های نستی مالزی',
      subtitle: 'تا ۱۵٪ تخفیف روی محبوب‌ترین طعم‌های Cush Man، انگور خنک و تنباکو کارامل',
      badge: '🔥 جشنواره تابستانه',
      image: 'https://images.pexels.com/photos/14472703/pexels-photo-14472703.jpeg?auto=compress&cs=tinysrgb&w=1400',
      mobileImage: 'https://images.pexels.com/photos/14472703/pexels-photo-14472703.jpeg?auto=compress&cs=tinysrgb&w=800',
      link: '/shop?category=salts',
      buttonText: 'مشاهده طعم‌های سالت',
      bgGradient: 'from-amber to-rose',
      textColor: 'light',
      position: 'hero',
      sortOrder: 2,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'پاد سیستم ویپرسو XROS 3 Pro',
      subtitle: 'طراحی ارگونومیک، چیپست هوشمند و باتری فوق‌العاده بادوام برای استفاده روزمره',
      badge: '✨ جدیدترین ورود بازار',
      image: 'https://images.pexels.com/photos/17962161/pexels-photo-17962161.jpeg?auto=compress&cs=tinysrgb&w=1400',
      mobileImage: 'https://images.pexels.com/photos/17962161/pexels-photo-17962161.jpeg?auto=compress&cs=tinysrgb&w=800',
      link: '/product/vaporesso-xros-3-pro',
      buttonText: 'بررسی مشخصات و قیمت',
      bgGradient: 'from-neon to-ice',
      textColor: 'light',
      position: 'hero',
      sortOrder: 3,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  constructor(private http: HttpClient) {}

  /**
   * دریافت لیست تمام بنرها از API سرور
   */
  getBanners(): Observable<Banner[]> {
    this.loadingSignal.set(true);
    return this.http.get<Banner[]>('/api/admin/banners').pipe(
      map((res) => (Array.isArray(res) ? res : this.fallbackBanners)),
      tap((banners) => {
        this.bannersSignal.set(banners);
        this.loadingSignal.set(false);
      }),
      catchError((err) => {
        console.warn('BannerService getBanners fallback:', err);
        this.bannersSignal.set(this.fallbackBanners);
        this.loadingSignal.set(false);
        return of(this.fallbackBanners);
      })
    );
  }

  /**
   * ایجاد بنر جدید در پایگاه داده
   */
  createBanner(bannerData: BannerFormData): Observable<Banner> {
    return this.http
      .post<{ ok: boolean; banner: Banner }>('/api/admin/banners', bannerData)
      .pipe(
        map((res) => res.banner),
        tap((newBanner) => {
          this.bannersSignal.update((list) => [...list, newBanner]);
        }),
        catchError((err) => {
          console.warn('BannerService createBanner fallback:', err);
          const fallback: Banner = {
            id: Date.now(),
            ...bannerData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          this.fallbackBanners.push(fallback);
          this.bannersSignal.update((list) => [...list, fallback]);
          return of(fallback);
        })
      );
  }

  /**
   * به‌روزرسانی بنر موجود در پایگاه داده
   */
  updateBanner(id: number, bannerData: Partial<BannerFormData>): Observable<Banner> {
    return this.http
      .patch<{ ok: boolean; banner: Banner }>('/api/admin/banners', { id, ...bannerData })
      .pipe(
        map((res) => res.banner),
        tap((updated) => {
          this.bannersSignal.update((list) =>
            list.map((b) => (b.id === id ? updated : b))
          );
        }),
        catchError((err) => {
          console.warn('BannerService updateBanner fallback:', err);
          let updatedItem: Banner | null = null;
          const idx = this.fallbackBanners.findIndex((b) => b.id === id);
          if (idx !== -1) {
            this.fallbackBanners[idx] = {
              ...this.fallbackBanners[idx],
              ...bannerData,
              updatedAt: new Date().toISOString(),
            };
            updatedItem = this.fallbackBanners[idx];
          }
          if (updatedItem) {
            this.bannersSignal.update((list) =>
              list.map((b) => (b.id === id ? updatedItem! : b))
            );
            return of(updatedItem);
          }
          return of({ id, ...bannerData } as Banner);
        })
      );
  }

  /**
   * تغییر سریع وضعیت فعال/غیرفعال بنر
   */
  toggleBannerActive(id: number, currentStatus: boolean): Observable<Banner> {
    return this.updateBanner(id, { active: !currentStatus });
  }

  /**
   * حذف بنر از پایگاه داده
   */
  deleteBanner(id: number): Observable<boolean> {
    return this.http
      .delete<{ ok: boolean; id: number }>(`/api/admin/banners?id=${id}`)
      .pipe(
        map((res) => res.ok),
        tap(() => {
          this.bannersSignal.update((list) => list.filter((b) => b.id !== id));
        }),
        catchError((err) => {
          console.warn('BannerService deleteBanner fallback:', err);
          this.fallbackBanners = this.fallbackBanners.filter((b) => b.id !== id);
          this.bannersSignal.update((list) => list.filter((b) => b.id !== id));
          return of(true);
        })
      );
  }
}
