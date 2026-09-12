/* ==========================================================================
   📌 کامپوننت بج وضعیت سفارشات و انبار (Status Badge Component)
   ==========================================================================
   💡 این معادل چیه؟
   توی Vue 3 کامپوننتی می‌نوشتیم با `defineProps<{ status: string }>()` و
   کلاس‌های شرطی با `:class`.
   
   در Angular:
   1. ورودی‌های کامپوننت با دکوراتور `@Input()` یا تابع نوین `input()` مشخص می‌شوند.
   2. متدهای کمکی برای برگرداندن کلاس و متن فارسی استفاده می‌شوند.
   ========================================================================== */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="badgeClass">
      <span class="dot"></span>
      {{ label }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: var(--radius-full);
      font-size: 11.5px;
      font-weight: 700;
      border: 1px solid transparent;
      white-space: nowrap;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    /* وضعیت‌های سفارش */
    .status-pending {
      background: rgba(245, 158, 11, 0.12);
      color: #fbbf24;
      border-color: rgba(245, 158, 11, 0.3);
    }
    .status-processing {
      background: rgba(56, 189, 248, 0.12);
      color: #38bdf8;
      border-color: rgba(56, 189, 248, 0.3);
    }
    .status-shipped {
      background: rgba(167, 139, 250, 0.15);
      color: #c084fc;
      border-color: rgba(167, 139, 250, 0.35);
    }
    .status-delivered {
      background: rgba(34, 197, 94, 0.12);
      color: #4ade80;
      border-color: rgba(34, 197, 94, 0.3);
    }
    .status-refunded {
      background: rgba(244, 63, 94, 0.12);
      color: #fb7185;
      border-color: rgba(244, 63, 94, 0.3);
    }

    /* وضعیت‌های موجودی انبار */
    .stock-in {
      background: rgba(34, 197, 94, 0.12);
      color: #4ade80;
      border-color: rgba(34, 197, 94, 0.3);
    }
    .stock-low {
      background: rgba(245, 158, 11, 0.12);
      color: #fbbf24;
      border-color: rgba(245, 158, 11, 0.3);
    }
    .stock-out {
      background: rgba(244, 63, 94, 0.12);
      color: #fb7185;
      border-color: rgba(244, 63, 94, 0.3);
    }
  `]
})
export class StatusBadgeComponent {
  // ورودی وضعیت
  @Input() status: any = 'pending';
  @Input() type: 'order' | 'stock' = 'order';

  get badgeClass(): string {
    if (this.type === 'stock') {
      const s = Number(this.status);
      if (s === 0) return 'stock-out';
      if (s <= 10) return 'stock-low';
      return 'stock-in';
    }
    return `status-${this.status}`;
  }

  get label(): string {
    if (this.type === 'stock') {
      const s = Number(this.status);
      if (s === 0) return 'ناموجود';
      if (s <= 10) return `موجودی کم (${s} عدد)`;
      return `موجود (${s} عدد)`;
    }

    const orderLabels: Record<string, string> = {
      pending: 'در انتظار پرداخت',
      processing: 'در حال آماده‌سازی',
      shipped: 'ارسال شده',
      delivered: 'تحویل شده',
      refunded: 'مرجوع شده',
    };
    return orderLabels[String(this.status)] || String(this.status);
  }
}
