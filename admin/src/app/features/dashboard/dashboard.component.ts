/* ==========================================================================
   📌 کامپوننت داشبورد جامع و پیشرفته مدیریت (Comprehensive Dashboard - dashboard.component.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این صفحه معادل یک داشبورد تحلیلی فوق‌پیشرفته در `pages/admin/index.vue`
   است که با ترکیب `useAsyncData` و متدهای محاسباتی، KPIهای مالی، پرفروش‌ترین‌ها،
   کالاهای راکد (Dead Stock)، هشدارهای شارژ انبار و وضعیت سفارشات را تحلیل می‌کند.

   در Angular:
   1. ما با عملگر `forkJoin` در RxJS تمام داده‌ها را به صورت همزمان (Parallel) واکشی می‌کنیم.
   2. استیت‌ها را درون `signal()` های واکنشی نگه می‌داریم.
   3. طراحی ۱۰۰٪ ریسپانسیو با پشتیبانی ویژه از نمایش بهینه در صفحات گوشی موبایل.
   ========================================================================== */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardStats, Order } from '../../core/models/order.model';
import { TomanPipe } from '../../shared/pipes/toman.pipe';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { AnalyticsChartComponent } from '../../shared/components/analytics-chart/analytics-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TomanPipe, StatusBadgeComponent, AnalyticsChartComponent],
  template: `
    <div class="dashboard-page">
      <!-- ۱. سربرگ داشبورد و خوش‌آمدگویی -->
      <header class="dash-header glass-card">
        <div class="header-main">
          <div class="user-greeting">
            <span class="greeting-badge">👑 کنترل پنل مرکزی ویپورا</span>
            <h1 class="page-title">داشبورد جامع هوش تجاری و انبارداری</h1>
            <p class="page-subtitle">
              خوش آمدید، <strong>{{ authService.currentUser()?.name }}</strong> 👋 — رصد زنده جریان فروش، کالاهای پرطرفدار و مدیریت سرمایه در گردش
            </p>
          </div>
          <div class="header-controls">
            <button class="refresh-btn" (click)="loadDashboardData()" [disabled]="loading()" title="بروزرسانی زنده اطلاعات">
              <span [class.spin]="loading()">🔄</span>
              <span class="btn-text">بروزرسانی داده‌ها</span>
            </button>
            <a routerLink="/products/new" class="glow-btn">
              <span>➕</span>
              <span>افزودن محصول</span>
            </a>
          </div>
        </div>
      </header>

      <!-- وضعیت در حال بارگذاری -->
      <div *ngIf="loading()" class="loading-state glass-card">
        <div class="loader-pulse"></div>
        <p>در حال محاسبه شاخص‌های مالی و تجزیه و تحلیل دیتابیس...</p>
      </div>

      <!-- محتوای اصلی داشبورد -->
      <div *ngIf="!loading() && stats()" class="dashboard-body">
        <!-- ۲. کارت‌های شاخص کلیدی عملکرد (KPIs) -->
        <section class="kpi-grid">
          <!-- کارت درآمد کل -->
          <div class="kpi-card glass-card kpi-revenue">
            <div class="kpi-top">
              <div class="kpi-icon-wrap">💰</div>
              <span class="trend-badge positive">+{{ stats()?.revenueGrowth }}% ماهانه</span>
            </div>
            <div class="kpi-info">
              <span class="kpi-title">مجموع درآمد حاصل از فروش</span>
              <h2 class="kpi-value">{{ stats()?.totalRevenue | toman }}</h2>
              <div class="kpi-meta">
                <span>فروش امروز: </span>
                <strong class="tnum">{{ stats()?.todayRevenue | toman }}</strong>
              </div>
            </div>
          </div>

          <!-- کارت تعداد سفارشات و میانگین فاکتور -->
          <div class="kpi-card glass-card kpi-orders">
            <div class="kpi-top">
              <div class="kpi-icon-wrap">🛍️</div>
              <span class="trend-badge positive">+{{ stats()?.ordersGrowth }}% سفارشات</span>
            </div>
            <div class="kpi-info">
              <span class="kpi-title">کل سفارشات ثبت شده</span>
              <h2 class="kpi-value">{{ stats()?.totalOrders }} <small>سفارش</small></h2>
              <div class="kpi-meta">
                <span>میانگین ارزش هر سبد (AOV): </span>
                <strong class="tnum">{{ stats()?.averageOrderValue | toman }}</strong>
              </div>
            </div>
          </div>

          <!-- کارت سفارشات نیازمند اقدام فوری -->
          <div class="kpi-card glass-card kpi-pending">
            <div class="kpi-top">
              <div class="kpi-icon-wrap">⏳</div>
              <span class="trend-badge warning">نیاز به اقدام</span>
            </div>
            <div class="kpi-info">
              <span class="kpi-title">سفارشات در انتظار آماده‌سازی</span>
              <h2 class="kpi-value">{{ stats()?.pendingOrdersCount }} <small>بسته</small></h2>
              <div class="kpi-meta">
                <span>آماده‌سازی و تحویل به تیپاکس</span>
              </div>
            </div>
          </div>

          <!-- کارت بحران موجودی انبار -->
          <div class="kpi-card glass-card kpi-stock">
            <div class="kpi-top">
              <div class="kpi-icon-wrap">⚠️</div>
              <span class="trend-badge danger" *ngIf="(stats()?.lowStockCount || 0) > 0">هشدار کسری</span>
            </div>
            <div class="kpi-info">
              <span class="kpi-title">محصولات با موجودی کم یا اتمام</span>
              <h2 class="kpi-value">{{ (stats()?.lowStockCount || 0) + (stats()?.outOfStockCount || 0) }} <small>قلم کالا</small></h2>
              <div class="kpi-meta">
                <span class="danger-text">{{ stats()?.outOfStockCount }} قلم کاملاً ناموجود</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ۲.۵ چارت پیشرفته و هوشمند تحلیلی با فیلترهای چندگانه (Analytics Chart & Funnel) -->
        <app-analytics-chart
          [data7d]="stats()?.chartData7Days || []"
          [data30d]="stats()?.chartData30Days || []"
          [funnel]="stats()?.funnel"
        ></app-analytics-chart>

        <!-- ۳. سهم فروش دسته‌بندی‌ها (Category Revenue Distribution) -->
        <section class="category-analytics glass-card">
          <div class="section-head">
            <div class="head-title">
              <h3>📊 سهم فروش و درآمد بر اساس دسته‌بندی محصولات</h3>
              <p>توزیع حجم تقاضا در بازارهای پاد یک‌بارمصرف، سالت نیکوتین و دستگاه‌ها</p>
            </div>
          </div>

          <div class="category-bars-grid">
            @for (cat of stats()?.categoryBreakdown; track cat.key) {
              <div class="cat-bar-card">
                <div class="cat-bar-header">
                  <span class="cat-name">
                    <span class="cat-emoji">{{ cat.icon }}</span>
                    <strong>{{ cat.label }}</strong>
                  </span>
                  <span class="cat-percent tnum font-bold">{{ cat.percentage }}%</span>
                </div>
                
                <div class="progress-track">
                  <div
                    class="progress-fill"
                    [style.width.%]="cat.percentage"
                    [style.background]="cat.color"
                  ></div>
                </div>

                <div class="cat-bar-footer">
                  <span class="cat-count">{{ cat.count }} واحد فروش</span>
                  <span class="cat-rev tnum">{{ cat.revenue | toman }}</span>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- ۴. دو بخش تحلیلی مهم: پرفروش‌ترین‌ها (Best Sellers) در برابر کالاهای راکد (Dead Stock) -->
        <section class="analytics-split-grid">
          <!-- 🔥 پرفروش‌ترین و پرطرفدارترین محصولات -->
          <div class="best-sellers-card glass-card">
            <div class="section-head">
              <div class="head-title">
                <h3>🔥 پرفروش‌ترین و پرطرفدارترین محصولات (Best Sellers)</h3>
                <p>کالاهایی با بالاترین نرخ گردش و سودآوری در فروشگاه</p>
              </div>
              <span class="badge-hot">پرمخاطب‌ترین‌ها</span>
            </div>

            <div class="items-list">
              @for (item of stats()?.bestSellers; track item.id; let i = $index) {
                <div class="item-row">
                  <div class="rank-badge" [class.gold]="i === 0" [class.silver]="i === 1" [class.bronze]="i === 2">
                    #{{ i + 1 }}
                  </div>
                  
                  <img [src]="item.image" [alt]="item.name" class="item-thumb" />

                  <div class="item-details">
                    <h4 class="item-name">{{ item.name }}</h4>
                    <div class="item-tags">
                      <span class="brand-tag">{{ item.brand }}</span>
                      <span class="sales-count font-bold">{{ item.unitsSold }} عدد فروخته شده</span>
                    </div>
                  </div>

                  <div class="item-financials">
                    <span class="item-rev font-mono font-bold">{{ item.revenue | toman }}</span>
                    <span class="trend-indicator positive">+{{ item.trend }}% تقاضا</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- ❄️ محصولات راکد و خواب‌رفته در انبار (Dead Stock / رو دست مونده) -->
          <div class="dead-stock-card glass-card">
            <div class="section-head">
              <div class="head-title">
                <h3>❄️ محصولات راکد و خواب‌رفته در انبار (Dead Stock)</h3>
                <p>کالاهایی با رکود طولانی مدت و سرمایه قفل شده که نیاز به تخفیف یا باندل دارند</p>
              </div>
              <span class="badge-frozen">سرمایه راکد</span>
            </div>

            <div class="items-list">
              @for (item of stats()?.deadStock; track item.id) {
                <div class="dead-item-row">
                  <img [src]="item.image" [alt]="item.name" class="item-thumb" />

                  <div class="item-details">
                    <h4 class="item-name">{{ item.name }}</h4>
                    <div class="dead-meta">
                      <span class="brand-tag">{{ item.brand }}</span>
                      <span class="stagnant-tag">⏳ {{ item.daysWithoutSale }} روز بدون فروش</span>
                      <span class="stock-qty">موجودی: {{ item.stock }} عدد</span>
                    </div>
                  </div>

                  <div class="dead-actions">
                    <div class="tied-capital">
                      <span class="label">سرمایه قفل شده:</span>
                      <strong class="value font-mono">{{ item.tiedUpCapital | toman }}</strong>
                    </div>

                    <a
                      routerLink="/products"
                      class="deal-suggest-btn"
                      title="اعمال تخفیف و تعریف باندل"
                    >
                      🎯 پیشنهاد تخفیف {{ item.discountSuggestion }}%
                    </a>
                  </div>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- ۵. هشدارهای فوری شارژ انبار و عملیات سریع -->
        <section class="restock-and-actions-grid">
          <!-- هشدارهای شارژ فوری -->
          <div class="restock-card glass-card">
            <div class="section-head">
              <div class="head-title">
                <h3>⚡ هشدار فوری شارژ موجودی انبار</h3>
                <p>اقلامی که به زیر آستانه ایمن رسیده‌اند و باید سریعاً به تأمین‌کننده سفارش داده شوند</p>
              </div>
              <a routerLink="/products" class="view-link">مدیریت موجودی ←</a>
            </div>

            <div class="restock-list">
              @for (item of stats()?.urgentRestock; track item.id) {
                <div class="restock-item">
                  <div class="restock-info">
                    <span class="warning-dot"></span>
                    <div>
                      <h4>{{ item.name }}</h4>
                      <span class="brand-text">{{ item.brand }} · حداقل مجاز: {{ item.minThreshold }} عدد</span>
                    </div>
                  </div>

                  <div class="restock-status">
                    <span class="stock-pill" [class.zero]="item.stock === 0">
                      {{ item.stock === 0 ? 'اتمام موجودی' : item.stock + ' عدد باقی‌مانده' }}
                    </span>
                    <a routerLink="/products" class="order-supplier-btn">شارژ انبار ↗</a>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- میانبرهای عملیاتی و سلامت سیستم -->
          <div class="quick-ops-card glass-card">
            <div class="section-head">
              <div class="head-title">
                <h3>🚀 میانبرهای استودیو و عملیات سریع</h3>
              </div>
            </div>

            <div class="ops-links-list">
              <a href="http://localhost:3000/studio/scan" target="_blank" class="ops-btn studio">
                <span class="ops-icon">✨</span>
                <div class="ops-text">
                  <strong>استودیو اسکن سه‌بعدی (3D Scan)</strong>
                  <span>تولید و بارگذاری فایل‌های GLB با موتور گوگل</span>
                </div>
                <span class="arrow">↗</span>
              </a>

              <a routerLink="/products/new" class="ops-btn product">
                <span class="ops-icon">📦</span>
                <div class="ops-text">
                  <strong>ثبت و ایجاد کالای جدید</strong>
                  <span>با پشتیبانی از فرم واکنشی و تصاویر چندگانه</span>
                </div>
                <span class="arrow">←</span>
              </a>

              <a routerLink="/orders" class="ops-btn orders">
                <span class="ops-icon">🛍️</span>
                <div class="ops-text">
                  <strong>مدیریت سفارشات باز</strong>
                  <span>تغییر وضعیت آنی و چاپ برچسب ارسال</span>
                </div>
                <span class="arrow">←</span>
              </a>
            </div>
          </div>
        </section>

        <!-- ۶. جدول و کارت‌های سفارشات اخیر -->
        <section class="recent-orders-section glass-card">
          <div class="section-head">
            <div class="head-title">
              <h3>📦 آخرین سفارش‌های ثبت شده در سیستم</h3>
              <p>تراکنش‌های زنده مشتریان فروشگاه ویپورا</p>
            </div>
            <a routerLink="/orders" class="view-all-link">مشاهده همه سفارش‌ها ←</a>
          </div>

          <!-- نمایش جدولی در دسکتاپ -->
          <div class="desktop-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>شماره سفارش</th>
                  <th>مشخصات خریدار</th>
                  <th>شهر مقصد</th>
                  <th>تعداد اقلام</th>
                  <th>مبلغ کل فاکتور</th>
                  <th>وضعیت سفارش</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                @for (order of recentOrders(); track order.id) {
                  <tr>
                    <td class="font-mono font-bold">{{ order.orderNumber }}</td>
                    <td>
                      <strong>{{ order.customer.name }}</strong>
                      <span class="sub-text">{{ order.customer.phone }}</span>
                    </td>
                    <td>{{ order.customer.city }}</td>
                    <td>{{ order.items.length }} کالا</td>
                    <td class="font-mono font-bold text-accent">{{ order.total | toman }}</td>
                    <td>
                      <app-status-badge [status]="order.status" type="order"></app-status-badge>
                    </td>
                    <td>
                      <a [routerLink]="['/orders']" [queryParams]="{ id: order.id }" class="table-action-btn">
                        مشاهده جزئیات
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- نمایش کارت‌های موبایل در صفحات کوچک -->
          <div class="mobile-orders-cards">
            @for (order of recentOrders(); track order.id) {
              <div class="mobile-order-card">
                <div class="card-top">
                  <span class="font-mono font-bold">{{ order.orderNumber }}</span>
                  <app-status-badge [status]="order.status" type="order"></app-status-badge>
                </div>
                <div class="card-middle">
                  <div>
                    <strong>{{ order.customer.name }}</strong>
                    <span class="loc">{{ order.customer.city }} · {{ order.items.length }} کالا</span>
                  </div>
                  <strong class="price font-mono">{{ order.total | toman }}</strong>
                </div>
                <div class="card-bottom">
                  <a [routerLink]="['/orders']" [queryParams]="{ id: order.id }" class="mobile-detail-btn">
                    بررسی جزئیات سفارش ←
                  </a>
                </div>
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 1.6rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* ۱. سربرگ داشبورد */
    .dash-header {
      padding: 1.6rem 2rem;
      background: linear-gradient(135deg, rgba(24, 24, 32, 0.9), rgba(18, 18, 23, 0.7));

      @media (max-width: 768px) {
        padding: 1.2rem;
      }

      .header-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1.2rem;
      }

      .greeting-badge {
        display: inline-block;
        font-size: 11.5px;
        font-weight: 700;
        color: var(--color-primary);
        background: rgba(167, 139, 250, 0.12);
        border: 1px solid rgba(167, 139, 250, 0.25);
        padding: 3px 10px;
        border-radius: var(--radius-full);
        margin-bottom: 6px;
      }

      .page-title {
        font-size: 22px;
        font-weight: 800;
        color: var(--text-main);
        letter-spacing: -0.02em;
        @media (max-width: 768px) {
          font-size: 18px;
        }
      }

      .page-subtitle {
        font-size: 13px;
        color: var(--text-dim);
        margin-top: 4px;
        strong { color: var(--text-main); }
      }

      .header-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.65rem 1.1rem;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 13px;
          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        }
      }
    }

    .loading-state {
      padding: 3.5rem;
      text-align: center;
      color: var(--text-dim);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;

      .loader-pulse {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--color-primary);
        animation: ping 1.5s infinite;
      }
    }

    .dashboard-body {
      display: flex;
      flex-direction: column;
      gap: 1.6rem;
    }

    /* ۲. شبکه کارت‌های KPI */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.2rem;
    }

    .kpi-card {
      padding: 1.4rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
      transition: transform 0.2s ease, border-color 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 255, 255, 0.15);
      }

      .kpi-top {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .kpi-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-md);
          display: grid;
          place-items: center;
          font-size: 22px;
          background: rgba(255, 255, 255, 0.05);
        }

        .trend-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          &.positive { background: rgba(34, 197, 94, 0.12); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.25); }
          &.warning { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
          &.danger { background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); }
        }
      }

      .kpi-info {
        .kpi-title {
          font-size: 12px;
          color: var(--text-dim);
          display: block;
          margin-bottom: 4px;
        }

        .kpi-value {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.01em;

          small {
            font-size: 13px;
            font-weight: 500;
            color: var(--text-dim);
          }
        }

        .kpi-meta {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 6px;
          strong { color: var(--text-dim); }
          .danger-text { color: #fb7185; }
        }
      }
    }

    /* ۳. سهم دسته‌بندی‌ها */
    .category-analytics {
      padding: 1.5rem;

      .section-head {
        margin-bottom: 1.2rem;
      }

      .category-bars-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.2rem;
      }

      .cat-bar-card {
        padding: 1rem;
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);

        .cat-bar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
          .cat-emoji { margin-left: 6px; }
        }

        .progress-track {
          width: 100%;
          height: 7px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 8px;

          .progress-fill {
            height: 100%;
            border-radius: var(--radius-full);
            transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }

        .cat-bar-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11.5px;
          color: var(--text-dim);
          .cat-rev { font-weight: 700; color: var(--text-main); }
        }
      }
    }

    /* ۴. بخش تحلیلی دوگانه (Best Sellers & Dead Stock) */
    .analytics-split-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.4rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .best-sellers-card, .dead-stock-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;

      .section-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 1.2rem;
        padding-bottom: 0.8rem;
        border-bottom: 1px solid var(--border-subtle);

        .badge-hot {
          background: rgba(244, 63, 94, 0.15);
          color: #fb7185;
          border: 1px solid rgba(244, 63, 94, 0.3);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          white-space: nowrap;
        }

        .badge-frozen {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          white-space: nowrap;
        }
      }

      .items-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .item-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0.75rem;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);

        .rank-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 12px;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-dim);

          &.gold { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid #f59e0b; }
          &.silver { background: rgba(148, 163, 184, 0.2); color: #cbd5e1; border: 1px solid #94a3b8; }
          &.bronze { background: rgba(217, 119, 6, 0.2); color: #fb923c; border: 1px solid #d97706; }
        }

        .item-thumb {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          background: rgba(255, 255, 255, 0.03);
        }

        .item-details {
          flex: 1;
          min-width: 0;

          .item-name {
            font-size: 13px;
            font-weight: 700;
            color: var(--text-main);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .item-tags {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 3px;
            font-size: 11px;

            .brand-tag {
              background: rgba(167, 139, 250, 0.12);
              color: var(--color-primary);
              padding: 1px 6px;
              border-radius: var(--radius-sm);
            }

            .sales-count {
              color: var(--text-dim);
            }
          }
        }

        .item-financials {
          text-align: left;
          .item-rev {
            font-size: 13px;
            color: #4ade80;
            display: block;
          }
          .trend-indicator {
            font-size: 11px;
            font-weight: 700;
            color: #4ade80;
          }
        }
      }

      .dead-item-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0.85rem;
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(244, 63, 94, 0.15);
        border-radius: var(--radius-md);

        @media (max-width: 600px) {
          flex-direction: column;
          align-items: flex-start;
        }

        .item-thumb {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .item-details {
          flex: 1;
          min-width: 0;

          .item-name {
            font-size: 13px;
            font-weight: 700;
            color: var(--text-main);
          }

          .dead-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 4px;
            font-size: 11px;

            .brand-tag {
              background: rgba(255, 255, 255, 0.08);
              padding: 1px 6px;
              border-radius: var(--radius-sm);
            }

            .stagnant-tag {
              color: #fb7185;
              font-weight: 700;
            }

            .stock-qty {
              color: var(--text-muted);
            }
          }
        }

        .dead-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;

          @media (max-width: 600px) {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .tied-capital {
            font-size: 11.5px;
            .label { color: var(--text-dim); margin-left: 4px; }
            .value { color: #fbbf24; }
          }

          .deal-suggest-btn {
            font-size: 11px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: var(--radius-sm);
            background: rgba(244, 63, 94, 0.15);
            color: #fb7185;
            border: 1px solid rgba(244, 63, 94, 0.3);
            white-space: nowrap;
            &:hover {
              background: rgba(244, 63, 94, 0.25);
            }
          }
        }
      }
    }

    /* ۵. هشدارهای شارژ و عملیات سریع */
    .restock-and-actions-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 1.4rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .restock-card, .quick-ops-card {
      padding: 1.5rem;

      .section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.2rem;
        padding-bottom: 0.8rem;
        border-bottom: 1px solid var(--border-subtle);

        .view-link {
          font-size: 12px;
          color: var(--color-primary);
          font-weight: 700;
        }
      }

      .restock-list {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .restock-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          gap: 10px;

          .restock-info {
            display: flex;
            align-items: center;
            gap: 10px;

            .warning-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #fbbf24;
              box-shadow: 0 0 8px #fbbf24;
            }

            h4 {
              font-size: 13px;
              font-weight: 700;
              color: var(--text-main);
            }

            .brand-text {
              font-size: 11px;
              color: var(--text-dim);
            }
          }

          .restock-status {
            display: flex;
            align-items: center;
            gap: 8px;

            .stock-pill {
              font-size: 11px;
              font-weight: 700;
              padding: 3px 8px;
              border-radius: var(--radius-full);
              background: rgba(245, 158, 11, 0.15);
              color: #fbbf24;

              &.zero {
                background: rgba(244, 63, 94, 0.15);
                color: #fb7185;
              }
            }

            .order-supplier-btn {
              font-size: 11px;
              font-weight: 700;
              padding: 4px 10px;
              border-radius: var(--radius-sm);
              background: rgba(255, 255, 255, 0.08);
              color: var(--text-main);
              &:hover {
                background: rgba(255, 255, 255, 0.15);
              }
            }
          }
        }
      }

      .ops-links-list {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .ops-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.95rem;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-main);
          transition: all 0.2s ease;

          &:hover {
            transform: translateY(-2px);
            border-color: var(--color-primary);
            background: rgba(167, 139, 250, 0.08);
          }

          .ops-icon {
            font-size: 24px;
          }

          .ops-text {
            flex: 1;
            strong {
              display: block;
              font-size: 13.5px;
              color: var(--text-main);
            }
            span {
              font-size: 11.5px;
              color: var(--text-dim);
            }
          }

          .arrow {
            font-size: 16px;
            color: var(--text-muted);
          }
        }
      }
    }

    /* ۶. سفارشات اخیر */
    .recent-orders-section {
      padding: 1.5rem;

      .section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.2rem;
        padding-bottom: 0.8rem;
        border-bottom: 1px solid var(--border-subtle);

        .view-all-link {
          font-size: 12.5px;
          color: var(--color-primary);
          font-weight: 700;
          &:hover { text-decoration: underline; }
        }
      }

      .desktop-table-wrap {
        overflow-x: auto;
        @media (max-width: 768px) {
          display: none; /* در موبایل کارت‌ها نمایش داده می‌شوند */
        }
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;

        th {
          text-align: right;
          padding: 0.8rem;
          color: var(--text-dim);
          font-size: 12px;
          border-bottom: 1px solid var(--border-subtle);
        }

        td {
          padding: 0.95rem 0.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          vertical-align: middle;

          .sub-text {
            display: block;
            font-size: 11px;
            color: var(--text-muted);
          }

          &.text-accent {
            color: #4ade80;
          }
        }

        tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .table-action-btn {
          font-size: 11.5px;
          color: var(--color-ice);
          background: rgba(56, 189, 248, 0.1);
          padding: 5px 10px;
          border-radius: var(--radius-sm);
          &:hover {
            background: rgba(56, 189, 248, 0.2);
          }
        }
      }

      /* کارت‌های ریسپانسیو سفارشات در موبایل */
      .mobile-orders-cards {
        display: none;
        flex-direction: column;
        gap: 10px;

        @media (max-width: 768px) {
          display: flex;
        }

        .mobile-order-card {
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 8px;

          .card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .card-middle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;

            .loc {
              display: block;
              font-size: 11.5px;
              color: var(--text-dim);
              margin-top: 2px;
            }

            .price {
              color: #4ade80;
            }
          }

          .card-bottom {
            padding-top: 6px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);

            .mobile-detail-btn {
              font-size: 12px;
              color: var(--color-primary);
              font-weight: 700;
              display: block;
              text-align: left;
            }
          }
        }
      }
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
    .spin {
      display: inline-block;
      animation: spin 1s linear infinite;
    }

    @keyframes ping {
      0% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 0.4; }
      100% { transform: scale(0.9); opacity: 0.8; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  readonly authService = inject(AuthService);

  readonly stats = signal<DashboardStats | null>(null);
  readonly recentOrders = signal<Order[]>([]);
  readonly loading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);

    forkJoin({
      stats: this.orderService.getDashboardStats(),
      orders: this.orderService.getOrders('all'),
    }).subscribe({
      next: ({ stats, orders }) => {
        this.stats.set(stats);
        this.recentOrders.set(orders.slice(0, 6));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('خطا در دریافت اطلاعات داشبورد:', err);
        this.loading.set(false);
      }
    });
  }
}
