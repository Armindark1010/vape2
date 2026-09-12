/* ==========================================================================
   📌 کامپوننت مدیریت و مشاهده سفارشات (OrderListComponent - order-list.component.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این صفحه معادل `pages/admin/orders/index.vue` است:
     const orders = ref([]);
     const selectedOrder = ref(null);
     const changeStatus = async (orderId, newStatus) => { ... }

   در Angular:
   1. از تب‌های فیلتر وضعیت و لیست بر اساس سیگنال‌ها استفاده می‌کنیم.
   2. مودال جزئیات سفارش با نمایش اقلام، طعم‌ها، میزان نیکوتین و آدرس خریدار.
   3. امکان تغییر وضعیت فوری سفارش (مثلاً تبدیل Pending به Shipped).
   ========================================================================== */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { TomanPipe } from '../../../shared/pipes/toman.pipe';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TomanPipe, StatusBadgeComponent],
  template: `
    <div class="orders-page">
      <!-- سربرگ صفحه -->
      <div class="page-header">
        <div>
          <h1 class="page-title">مدیریت سفارشات فروشگاه</h1>
          <p class="page-desc">پیگیری، آماده‌سازی، تغییر وضعیت ارسال و مدیریت جزئیات خریداران</p>
        </div>
      </div>

      <!-- تب‌های فیلتر بر اساس وضعیت -->
      <div class="status-tabs glass-card">
        <button
          class="tab-btn"
          [class.active]="activeFilter() === 'all'"
          (click)="setFilter('all')"
        >
          همه سفارش‌ها ({{ totalCount() }})
        </button>
        <button
          class="tab-btn"
          [class.active]="activeFilter() === 'pending'"
          (click)="setFilter('pending')"
        >
          در انتظار پرداخت
        </button>
        <button
          class="tab-btn"
          [class.active]="activeFilter() === 'processing'"
          (click)="setFilter('processing')"
        >
          در حال آماده‌سازی
        </button>
        <button
          class="tab-btn"
          [class.active]="activeFilter() === 'shipped'"
          (click)="setFilter('shipped')"
        >
          ارسال شده
        </button>
        <button
          class="tab-btn"
          [class.active]="activeFilter() === 'delivered'"
          (click)="setFilter('delivered')"
        >
          تحویل شده
        </button>
      </div>

      <!-- جدول سفارشات -->
      <div class="table-container glass-card">
        <div *ngIf="loading()" class="loading-state">
          <span class="spinner">⏳</span> در حال بارگذاری سفارشات...
        </div>

        <div *ngIf="!loading()" class="table-responsive">
          <table class="orders-table">
            <thead>
              <tr>
                <th>شماره سفارش</th>
                <th>نام خریدار</th>
                <th>تلفن و شهر</th>
                <th>تعداد اقلام</th>
                <th>مبلغ کل</th>
                <th>روش پرداخت</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              @if (orders().length === 0) {
                <tr>
                  <td colspan="8" class="empty-state">
                    <p class="empty-icon">📭</p>
                    <p class="empty-text">سفارشی با این وضعیت یافت نشد.</p>
                  </td>
                </tr>
              }

              @for (order of orders(); track order.id) {
                <tr>
                  <td class="order-num font-mono font-bold">{{ order.orderNumber }}</td>
                  <td>
                    <strong>{{ order.customer.name }}</strong>
                  </td>
                  <td>
                    <span class="font-mono">{{ order.customer.phone }}</span>
                    <span class="city-text">{{ order.customer.city }}</span>
                  </td>
                  <td>{{ order.items.length }} محصول</td>
                  <td class="total-cell font-mono font-bold">{{ order.total | toman }}</td>
                  <td class="payment-cell">{{ order.paymentMethod }}</td>
                  <td>
                    <app-status-badge [status]="order.status" type="order"></app-status-badge>
                  </td>
                  <td>
                    <button class="view-btn" (click)="openDetailModal(order)">
                      👁️ مشاهده و تغییر وضعیت
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- کارت‌های ریسپانسیو سفارشات در موبایل -->
        <div *ngIf="!loading()" class="mobile-orders-cards">
          @if (orders().length === 0) {
            <div class="empty-state">
              <p class="empty-icon">📭</p>
              <p class="empty-text">سفارشی با این وضعیت یافت نشد.</p>
            </div>
          }

          @for (order of orders(); track order.id) {
            <div class="mob-order-card">
              <div class="mob-card-head">
                <span class="order-num font-mono font-bold">{{ order.orderNumber }}</span>
                <app-status-badge [status]="order.status" type="order"></app-status-badge>
              </div>

              <div class="mob-card-body">
                <div>
                  <strong>{{ order.customer.name }}</strong>
                  <span class="sub-info">{{ order.customer.city }} · {{ order.items.length }} قلم کالا</span>
                </div>
                <div class="mob-total font-mono font-bold">{{ order.total | toman }}</div>
              </div>

              <div class="mob-card-foot">
                <button class="mob-view-btn" (click)="openDetailModal(order)">
                  👁️ مشاهده فاکتور و تغییر وضعیت
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- مودال جزئیات کامل سفارش (Order Detail Modal) -->
      <div class="modal-backdrop" *ngIf="selectedOrder()" (click)="closeDetailModal()">
        <div class="modal-dialog glass-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h3>جزئیات سفارش {{ selectedOrder()?.orderNumber }}</h3>
              <span class="order-date font-mono">{{ selectedOrder()?.createdAt }}</span>
            </div>
            <button class="close-btn" (click)="closeDetailModal()">✕</button>
          </div>

          <div class="modal-body" *ngIf="selectedOrder()">
            <!-- اطلاعات خریدار و آدرس -->
            <div class="section-box">
              <h4>👤 مشخصات و آدرس خریدار</h4>
              <div class="customer-info-grid">
                <div><strong>نام:</strong> {{ selectedOrder()?.customer?.name }}</div>
                <div><strong>تلفن:</strong> <span class="font-mono">{{ selectedOrder()?.customer?.phone }}</span></div>
                <div><strong>شهر:</strong> {{ selectedOrder()?.customer?.city }}</div>
                <div><strong>کد پستی:</strong> <span class="font-mono">{{ selectedOrder()?.customer?.postalCode }}</span></div>
                <div class="full-width"><strong>آدرس دقیق:</strong> {{ selectedOrder()?.customer?.address }}</div>
              </div>
            </div>

            <!-- لیست اقلام سفارش -->
            <div class="section-box">
              <h4>🛍️ اقلام سبد خرید</h4>
              <div class="items-list">
                @for (item of selectedOrder()?.items; track item.id) {
                  <div class="item-row">
                    <img [src]="item.image" [alt]="item.productName" class="item-img" />
                    <div class="item-details">
                      <strong>{{ item.productName }}</strong>
                      <span class="item-meta" *ngIf="item.flavor || item.nicotine">
                        طعم: {{ item.flavor }} | نیکوتین: {{ item.nicotine }}
                      </span>
                    </div>
                    <div class="item-price font-mono">
                      {{ item.quantity }} × {{ item.price | toman }}
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- مبالغ پرداختی -->
            <div class="finance-box">
              <div class="f-row">
                <span>جمع کل اقلام:</span>
                <span class="font-mono">{{ selectedOrder()?.subtotal | toman }}</span>
              </div>
              <div class="f-row" *ngIf="(selectedOrder()?.discount || 0) > 0">
                <span>تخفیف:</span>
                <span class="font-mono text-danger">- {{ selectedOrder()?.discount | toman }}</span>
              </div>
              <div class="f-row">
                <span>هزینه ارسال:</span>
                <span class="font-mono">{{ (selectedOrder()?.shippingFee === 0) ? 'رایگان' : (selectedOrder()?.shippingFee | toman) }}</span>
              </div>
              <div class="f-row total font-bold">
                <span>مبلغ نهایی پرداختی:</span>
                <span class="font-mono text-neon">{{ selectedOrder()?.total | toman }}</span>
              </div>
            </div>

            <!-- تغییر وضعیت سفارش -->
            <div class="status-updater">
              <label>تغییر وضعیت سفارش به:</label>
              <div class="updater-actions">
                <select [(ngModel)]="newStatus" class="status-select">
                  <option value="pending">در انتظار پرداخت (Pending)</option>
                  <option value="processing">در حال آماده‌سازی (Processing)</option>
                  <option value="shipped">ارسال شده با پست/پیک (Shipped)</option>
                  <option value="delivered">تحویل داده شده (Delivered)</option>
                  <option value="refunded">مرجوع شده (Refunded)</option>
                </select>
                <button class="glow-btn update-btn" (click)="saveStatusUpdate()">
                  ذخیره وضعیت
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header {
      .page-title {
        font-size: 22px;
        font-weight: 800;
        color: var(--text-main);
      }
      .page-desc {
        font-size: 13px;
        color: var(--text-dim);
        margin-top: 4px;
      }
    }

    .status-tabs {
      display: flex;
      gap: 8px;
      padding: 0.6rem;
      overflow-x: auto;

      .tab-btn {
        padding: 0.55rem 1.1rem;
        background: transparent;
        color: var(--text-dim);
        font-size: 12.5px;
        font-weight: 700;
        border-radius: var(--radius-md);
        white-space: nowrap;
        transition: all 0.2s;

        &:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.05);
        }

        &.active {
          background: rgba(167, 139, 250, 0.2);
          color: var(--color-primary);
          border: 1px solid rgba(167, 139, 250, 0.35);
        }
      }
    }

    .table-container {
      overflow: hidden;
    }

    .orders-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;

      th {
        text-align: right;
        padding: 1rem 0.9rem;
        color: var(--text-dim);
        font-size: 12px;
        font-weight: 700;
        background: rgba(0, 0, 0, 0.2);
        border-bottom: 1px solid var(--border-subtle);
      }

      td {
        padding: 0.95rem 0.9rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;

        .city-text {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
        }
      }

      tr:hover td {
        background: rgba(255, 255, 255, 0.02);
      }
    }

    .table-responsive {
      overflow-x: auto;
      @media (max-width: 768px) {
        display: none;
      }
    }

    .mobile-orders-cards {
      display: none;
      flex-direction: column;
      gap: 12px;
      padding: 1rem;

      @media (max-width: 768px) {
        display: flex;
      }

      .mob-order-card {
        padding: 1rem;
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        display: flex;
        flex-direction: column;
        gap: 10px;

        .mob-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mob-card-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13.5px;

          .sub-info {
            display: block;
            font-size: 11.5px;
            color: var(--text-dim);
            margin-top: 2px;
          }

          .mob-total {
            color: #4ade80;
          }
        }

        .mob-card-foot {
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);

          .mob-view-btn {
            width: 100%;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: 700;
            color: var(--color-primary);
            background: rgba(167, 139, 250, 0.12);
            border: 1px solid rgba(167, 139, 250, 0.3);
            border-radius: var(--radius-sm);
            text-align: center;
          }
        }
      }
    }

    .view-btn {
      font-size: 11.5px;
      font-weight: 700;
      color: var(--color-primary);
      background: rgba(167, 139, 250, 0.1);
      border: 1px solid rgba(167, 139, 250, 0.25);
      padding: 5px 10px;
      border-radius: var(--radius-sm);
      &:hover {
        background: rgba(167, 139, 250, 0.2);
      }
    }

    .loading-state, .empty-state {
      padding: 3rem;
      text-align: center;
      color: var(--text-dim);
    }

    /* مودال */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 1.5rem;
    }

    .modal-dialog {
      width: 100%;
      max-width: 650px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 1.8rem;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 1rem;
      margin-bottom: 1.2rem;

      h3 { font-size: 17px; font-weight: 800; }
      .order-date { font-size: 11.5px; color: var(--text-dim); margin-top: 2px; }
      .close-btn {
        background: transparent;
        color: var(--text-dim);
        font-size: 18px;
        &:hover { color: var(--text-main); }
      }
    }

    .section-box {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 1rem;
      margin-bottom: 1.2rem;

      h4 { font-size: 13px; font-weight: 700; color: var(--color-primary); margin-bottom: 0.8rem; }
    }

    .customer-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      font-size: 12.5px;
      color: var(--text-dim);
      strong { color: var(--text-main); }
      .full-width { grid-column: span 2; }
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .item-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        &:last-child { border-bottom: none; }

        .item-img {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .item-details {
          flex: 1;
          strong { display: block; font-size: 12.5px; color: var(--text-main); }
          .item-meta { font-size: 11px; color: var(--text-dim); }
        }

        .item-price { font-size: 12px; font-weight: 700; color: var(--text-main); }
      }
    }

    .finance-box {
      background: rgba(255, 255, 255, 0.02);
      border-radius: var(--radius-md);
      padding: 0.9rem;
      margin-bottom: 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 12.5px;

      .f-row {
        display: flex;
        justify-content: space-between;
        color: var(--text-dim);
        &.total {
          border-top: 1px solid var(--border-subtle);
          padding-top: 8px;
          margin-top: 4px;
          font-size: 14px;
          color: var(--text-main);
          .text-neon { color: var(--color-accent); }
        }
      }
      .text-danger { color: var(--color-blush); }
    }

    .status-updater {
      display: flex;
      flex-direction: column;
      gap: 8px;
      label { font-size: 12px; font-weight: 700; color: var(--text-main); }

      .updater-actions {
        display: flex;
        gap: 10px;

        .status-select {
          flex: 1;
          height: 44px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0 1rem;
          font-size: 13px;
          color: var(--text-main);
        }

        .update-btn {
          white-space: nowrap;
          padding: 0 1.5rem;
        }
      }
    }
  `]
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal<boolean>(true);
  readonly activeFilter = signal<OrderStatus | 'all'>('all');
  readonly totalCount = signal<number>(0);
  readonly selectedOrder = signal<Order | null>(null);

  newStatus: OrderStatus = 'processing';

  ngOnInit(): void {
    this.fetchOrders();

    // بررسی کوئری پارامتر برای باز کردن خودکار مودال سفارش
    const orderIdParam = this.route.snapshot.queryParams['id'];
    if (orderIdParam) {
      this.orderService.getOrderById(Number(orderIdParam)).subscribe((o) => {
        this.openDetailModal(o);
      });
    }
  }

  fetchOrders(): void {
    this.loading.set(true);
    this.orderService.getOrders(this.activeFilter()).subscribe({
      next: (list) => {
        this.orders.set(list);
        if (this.activeFilter() === 'all') {
          this.totalCount.set(list.length);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  setFilter(status: OrderStatus | 'all'): void {
    this.activeFilter.set(status);
    this.fetchOrders();
  }

  openDetailModal(order: Order): void {
    this.selectedOrder.set(order);
    this.newStatus = order.status;
  }

  closeDetailModal(): void {
    this.selectedOrder.set(null);
  }

  saveStatusUpdate(): void {
    const order = this.selectedOrder();
    if (!order) return;

    this.orderService.updateOrderStatus(order.id, this.newStatus).subscribe({
      next: (updated) => {
        this.selectedOrder.set(updated);
        alert(`وضعیت سفارش ${order.orderNumber} با موفقیت به ${this.newStatus} تغییر یافت.`);
        this.fetchOrders();
      },
    });
  }
}
