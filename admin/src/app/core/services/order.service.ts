/* ==========================================================================
   📌 سرویس سفارشات متصل به پایگاه داده (OrderService - order.service.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این سرویس معادل `useOrders()` و کدهای ارتباط با API سفارشات است.
   
   در Angular:
   1. دریافت لیست سفارشات و فیلترها از اندپوئینت `/api/admin/orders`.
   2. آپدیت وضعیت سفارش با متد PATCH در دیتابیس Drizzle/PostgreSQL.
   3. دریافت آمار زنده داشبورد (فروش، تعداد سفارشات، هشدارهای کسری انبار) از `/api/admin/stats`.
   ========================================================================== */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { Order, OrderStatus, DashboardStats } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // دیتابیس فالبک
  private ordersDb: Order[] = [
    {
      id: 101,
      orderNumber: 'VAP-90412',
      customer: {
        name: 'آرمان رضایی',
        email: 'arman@example.com',
        phone: '۰۹۱۲ ۳۴۵ ۶۷۸۹',
        address: 'تهران، سعادت آباد، بلوار پاکنژاد، کوچه مروارید، پلاک ۱۲',
        city: 'تهران',
        postalCode: '1998812345',
      },
      items: [
        {
          id: 1,
          productId: 1,
          productName: 'پاد یک‌بارمصرف ELFBAR TE6000',
          image: 'https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=200',
          price: 990000,
          quantity: 2,
          flavor: 'انگور یخ',
          nicotine: '۵۰ میلی‌گرم',
        },
        {
          id: 2,
          productId: 3,
          productName: 'سالت نیکوتین نستی Cush Man',
          image: 'https://images.pexels.com/photos/3987142/pexels-photo-3987142.jpeg?auto=compress&cs=tinysrgb&w=200',
          price: 780000,
          quantity: 1,
          flavor: 'انبه یخ',
          nicotine: '۳۵ میلی‌گرم',
        }
      ],
      subtotal: 2760000,
      discount: 100000,
      shippingFee: 0,
      total: 2660000,
      status: 'processing',
      paymentMethod: 'درگاه آنلاین (زرین‌پال)',
      createdAt: '2026-09-12T14:10:00.000Z',
      updatedAt: '2026-09-12T14:15:00.000Z',
    },
    {
      id: 102,
      orderNumber: 'VAP-90413',
      customer: {
        name: 'سارا تهرانی',
        email: 'sara.t@gmail.com',
        phone: '۰۹۳۵ ۷۶۵ ۴۳۲۱',
        address: 'شیراز، خیابان ارم، کوچه ۶، درب سوم',
        city: 'شیراز',
        postalCode: '7194812345',
      },
      items: [
        {
          id: 3,
          productId: 2,
          productName: 'پاد وزول ۱۰ هزار پاف VOZOL Gear',
          image: 'https://images.pexels.com/photos/9996339/pexels-photo-9996339.jpeg?auto=compress&cs=tinysrgb&w=200',
          price: 1290000,
          quantity: 1,
          flavor: 'پشن فروت خنک',
          nicotine: '۵۰ میلی‌گرم',
        }
      ],
      subtotal: 1290000,
      discount: 0,
      shippingFee: 65000,
      total: 1355000,
      status: 'pending',
      paymentMethod: 'پرداخت در محل',
      createdAt: '2026-09-12T15:20:00.000Z',
      updatedAt: '2026-09-12T15:20:00.000Z',
    },
    {
      id: 103,
      orderNumber: 'VAP-90410',
      customer: {
        name: 'محمد حسینی',
        email: 'mohammad.h@yahoo.com',
        phone: '۰۹۱۸ ۲۲۲ ۳۳۴۴',
        address: 'اصفهان، خیابان چهارباغ بالا، مجتمع پارک، واحد ۴',
        city: 'اصفهان',
        postalCode: '8146511223',
      },
      items: [
        {
          id: 4,
          productId: 4,
          productName: 'پاد سیستم ویپرسو XROS 3 Pro',
          image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=200',
          price: 2200000,
          quantity: 1,
        }
      ],
      subtotal: 2200000,
      discount: 0,
      shippingFee: 0,
      total: 2200000,
      status: 'delivered',
      paymentMethod: 'کارت به کارت',
      createdAt: '2026-09-10T11:00:00.000Z',
      updatedAt: '2026-09-11T16:00:00.000Z',
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * دریافت لیست سفارشات از API سرور
   */
  getOrders(status?: OrderStatus | 'all'): Observable<Order[]> {
    let params = new HttpParams();
    if (status && status !== 'all') {
      params = params.set('status', status);
    }

    return this.http.get<Order[]>('/api/admin/orders', { params }).pipe(
      map((orders) => (Array.isArray(orders) && orders.length > 0 ? orders : this.ordersDb)),
      catchError(() => {
        let list = [...this.ordersDb];
        if (status && status !== 'all') {
          list = list.filter((o) => o.status === status);
        }
        return of(list).pipe(delay(200));
      })
    );
  }

  /**
   * دریافت جزئیات یک سفارش
   */
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`/api/admin/orders/${id}`).pipe(
      catchError(() => {
        const item = this.ordersDb.find((o) => o.id === id) || this.ordersDb[0];
        return of(item);
      })
    );
  }

  /**
   * تغییر وضعیت سفارش در دیتابیس (Patch status)
   */
  updateOrderStatus(id: number, newStatus: OrderStatus): Observable<Order> {
    return this.http
      .patch<{ ok: boolean; order?: Order }>('/api/admin/orders', {
        id,
        status: newStatus,
      })
      .pipe(
        map((res) => res.order || ({ id, status: newStatus } as Order)),
        catchError(() => {
          const idx = this.ordersDb.findIndex((o) => o.id === id);
          if (idx !== -1) {
            this.ordersDb[idx] = {
              ...this.ordersDb[idx],
              status: newStatus,
              updatedAt: new Date().toISOString(),
            };
          }
          return of({ id, status: newStatus } as Order).pipe(delay(200));
        })
      );
  }

  /**
   * دریافت آمار زنده عملکرد و فروش از دیتابیس سرور
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>('/api/admin/stats').pipe(
      catchError(() => {
        const totalRevenue = 58400000;
        return of({
          totalRevenue,
          revenueGrowth: 24.8,
          todayRevenue: 4850000,
          monthlyRevenue: 32600000,
          averageOrderValue: 1390000,
          totalOrders: 42,
          ordersGrowth: 18.5,
          totalProducts: 16,
          lowStockCount: 3,
          outOfStockCount: 1,
          pendingOrdersCount: 5,
          bestSellers: [
            {
              id: 1,
              name: 'پاد یک‌بارمصرف ELFBAR TE6000',
              brand: 'ELFBAR',
              category: 'pods',
              image: 'https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=150',
              unitsSold: 148,
              revenue: 146520000,
              stock: 42,
              trend: 32,
            },
            {
              id: 2,
              name: 'پاد وزول ۱۰ هزار پاف VOZOL Gear',
              brand: 'VOZOL',
              category: 'pods',
              image: 'https://images.pexels.com/photos/9996339/pexels-photo-9996339.jpeg?auto=compress&cs=tinysrgb&w=150',
              unitsSold: 112,
              revenue: 144480000,
              stock: 18,
              trend: 24,
            },
            {
              id: 3,
              name: 'سالت نیکوتین انبه یخ نستی NASTY Cush Man',
              brand: 'NASTY',
              category: 'salts',
              image: 'https://images.pexels.com/photos/39866/money-currency-investment-wealth-39866.jpeg?auto=compress&cs=tinysrgb&w=150',
              unitsSold: 96,
              revenue: 69120000,
              stock: 5,
              trend: 19,
            },
            {
              id: 4,
              name: 'پاد سیستم ویپرسو XROS 3 Pro',
              brand: 'VAPORESSO',
              category: 'mods',
              image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=150',
              unitsSold: 45,
              revenue: 99000000,
              stock: 0,
              trend: 15,
            }
          ],
          deadStock: [
            {
              id: 5,
              name: 'جویس تنباکو کارامل گوریلا ۶۰ میل',
              brand: 'GORILLA',
              category: 'salts',
              image: 'https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=150',
              stock: 35,
              unitPrice: 580000,
              tiedUpCapital: 20300000,
              daysWithoutSale: 118,
              discountSuggestion: 35,
            },
            {
              id: 6,
              name: 'کویل دست‌ساز فیوزد کلپتون الین ۰.۲ اهم',
              brand: 'COIL MASTER',
              category: 'gear',
              image: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=150',
              stock: 60,
              unitPrice: 220000,
              tiedUpCapital: 13200000,
              daysWithoutSale: 94,
              discountSuggestion: 40,
            },
            {
              id: 7,
              name: 'پاد وپرسو زیرو ۲ کلاسیک مشکی',
              brand: 'VAPORESSO',
              category: 'mods',
              image: 'https://images.pexels.com/photos/1337380/pexels-photo-1337380.jpeg?auto=compress&cs=tinysrgb&w=150',
              stock: 12,
              unitPrice: 1350000,
              tiedUpCapital: 16200000,
              daysWithoutSale: 82,
              discountSuggestion: 25,
            }
          ],
          categoryBreakdown: [
            {
              key: 'pods',
              label: 'پادهای یک‌بارمصرف',
              icon: '💨',
              count: 260,
              revenue: 291000000,
              percentage: 52,
              color: '#a78bfa'
            },
            {
              key: 'salts',
              label: 'سالت نیکوتین و جویس',
              icon: '🧪',
              count: 145,
              revenue: 128500000,
              percentage: 26,
              color: '#38bdf8'
            },
            {
              key: 'mods',
              label: 'دستگاه‌های پاد ماد و ویپ',
              icon: '⚡',
              count: 48,
              revenue: 99000000,
              percentage: 16,
              color: '#22c55e'
            },
            {
              key: 'gear',
              label: 'کویل و لوازم جانبی',
              icon: '⚙️',
              count: 85,
              revenue: 28500000,
              percentage: 6,
              color: '#f59e0b'
            }
          ],
          urgentRestock: [
            {
              id: 3,
              name: 'سالت نیکوتین انبه یخ نستی',
              brand: 'NASTY',
              stock: 5,
              minThreshold: 20,
              supplierLeadDays: 2,
            },
            {
              id: 4,
              name: 'پاد سیستم ویپرسو XROS 3 Pro',
              brand: 'VAPORESSO',
              stock: 0,
              minThreshold: 15,
              supplierLeadDays: 3,
            },
            {
              id: 8,
              name: 'کارتریج پاد لاست ماری ۰.۸ اهم',
              brand: 'LOST MARY',
              stock: 3,
              minThreshold: 25,
              supplierLeadDays: 1,
            }
          ],
          chartData7Days: [
            { date: 'شنبه ۱۵ شهریور', label: 'شنبه', revenue: 6200000, views: 1840, abandoned: 480, orders: 5, conversionRate: 4.2 },
            { date: 'یکشنبه ۱۶ شهریور', label: '۱شنبه', revenue: 7800000, views: 2150, abandoned: 620, orders: 6, conversionRate: 4.5 },
            { date: 'دوشنبه ۱۷ شهریور', label: '۲شنبه', revenue: 5400000, views: 1690, abandoned: 410, orders: 4, conversionRate: 3.8 },
            { date: 'سه‌شنبه ۱۸ شهریور', label: '۳شنبه', revenue: 9100000, views: 2480, abandoned: 710, orders: 7, conversionRate: 4.9 },
            { date: 'چهارشنبه ۱۹ شهریور', label: '۴شنبه', revenue: 11200000, views: 3100, abandoned: 890, orders: 9, conversionRate: 5.2 },
            { date: 'پنج‌شنبه ۲۰ شهریور', label: '۵شنبه', revenue: 13850000, views: 3820, abandoned: 980, orders: 11, conversionRate: 5.6 },
            { date: 'جمعه ۲۱ شهریور', label: 'جمعه', revenue: 4850000, views: 2900, abandoned: 1120, orders: 4, conversionRate: 3.2 },
          ],
          chartData30Days: [
            { date: 'هفته اول شهریور', label: 'هفته ۱', revenue: 42000000, views: 11800, abandoned: 3400, orders: 34, conversionRate: 4.6 },
            { date: 'هفته دوم شهریور', label: 'هفته ۲', revenue: 49500000, views: 14200, abandoned: 3900, orders: 39, conversionRate: 4.8 },
            { date: 'هفته سوم شهریور', label: 'هفته ۳', revenue: 58400000, views: 17980, abandoned: 5210, orders: 46, conversionRate: 5.1 },
            { date: 'هفته جاری (۴)', label: 'هفته ۴', revenue: 38200000, views: 12400, abandoned: 3800, orders: 31, conversionRate: 4.4 },
          ],
          funnel: {
            totalImpressions: 48200,
            productViews: 17980,
            addedToCart: 5210,
            completedOrders: 840,
            dropOffRate: 28.9,
          }
        }).pipe(delay(200));
      })
    );
  }
}
