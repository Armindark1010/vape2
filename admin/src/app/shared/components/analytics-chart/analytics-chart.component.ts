/* ==========================================================================
   📌 کامپوننت چارت تحلیلی تعاملی (Interactive Analytics Chart Component)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این کامپوننت معادل `components/admin/AnalyticsChart.vue` است که با
   ترکیب SVG و استیت‌های واکنشی، نمودارهای تحلیلی فروش، بازدیدها، سبدهای رها شده
   و نرخ تبدیل را با فیلترهای زمانی رسم می‌کند.
   ========================================================================== */

import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartDataPoint, FunnelAnalytics } from '../../../core/models/order.model';
import { TomanPipe } from '../../pipes/toman.pipe';

export type MetricType = 'revenue' | 'views' | 'abandoned' | 'conversion';
export type TimeframeType = '7d' | '30d';

@Component({
  selector: 'app-analytics-chart',
  standalone: true,
  imports: [CommonModule, TomanPipe],
  template: `
    <div class="analytics-chart-container glass-card">
      <!-- سربرگ و فیلترهای نمودار -->
      <div class="chart-header">
        <div class="header-left">
          <div class="title-row">
            <span class="chart-badge">📈 آنالیتیکس و رفتار کاربران</span>
            <h3 class="chart-title">{{ currentMetricTitle() }}</h3>
          </div>
          <p class="chart-subtitle">{{ currentMetricDesc() }}</p>
        </div>

        <!-- کنترل‌های فیلتر متریک و بازه زمانی -->
        <div class="chart-controls">
          <!-- فیلتر نوع داده -->
          <div class="metric-tabs">
            <button
              class="metric-btn revenue"
              [class.active]="selectedMetric() === 'revenue'"
              (click)="setMetric('revenue')"
            >
              💰 فروش و درآمد
            </button>
            <button
              class="metric-btn views"
              [class.active]="selectedMetric() === 'views'"
              (click)="setMetric('views')"
            >
              👁️ کل بازدیدها
            </button>
            <button
              class="metric-btn abandoned"
              [class.active]="selectedMetric() === 'abandoned'"
              (click)="setMetric('abandoned')"
            >
              🛒 بازدیدهای بدون خرید
            </button>
            <button
              class="metric-btn conversion"
              [class.active]="selectedMetric() === 'conversion'"
              (click)="setMetric('conversion')"
            >
              🎯 نرخ تبدیل
            </button>
          </div>

          <!-- فیلتر بازه زمانی -->
          <div class="timeframe-switch">
            <button
              [class.active]="timeframe() === '7d'"
              (click)="setTimeframe('7d')"
            >
              ۷ روز اخیر
            </button>
            <button
              [class.active]="timeframe() === '30d'"
              (click)="setTimeframe('30d')"
            >
              ۳۰ روز اخیر
            </button>
          </div>
        </div>
      </div>

      <!-- کارت‌های خلاصه آماری قیف فروش (Funnel Summary) -->
      <div class="funnel-summary" *ngIf="funnel">
        <div class="funnel-step">
          <span class="step-label">👁️ کل مشاهده محصولات</span>
          <strong class="step-value tnum">{{ funnel.productViews | number }} ویو</strong>
          <span class="step-hint">۱۰۰٪ ترافیک ورودی</span>
        </div>

        <div class="funnel-arrow">←</div>

        <div class="funnel-step">
          <span class="step-label">🛒 افزودن به سبد</span>
          <strong class="step-value tnum">{{ funnel.addedToCart | number }} کالا</strong>
          <span class="step-hint text-cyan">{{ calculateRate(funnel.addedToCart, funnel.productViews) }}% علاقه به خرید</span>
        </div>

        <div class="funnel-arrow">←</div>

        <div class="funnel-step highlight-success">
          <span class="step-label">✅ سفارشات قطعی</span>
          <strong class="step-value tnum text-accent">{{ funnel.completedOrders | number }} خرید</strong>
          <span class="step-hint text-accent">{{ calculateRate(funnel.completedOrders, funnel.productViews) }}% نرخ تبدیل نهایی</span>
        </div>

        <div class="funnel-arrow">←</div>

        <div class="funnel-step highlight-drop">
          <span class="step-label">⚠️ بازدید بدون خرید</span>
          <strong class="step-value tnum text-rose">{{ funnel.dropOffRate }}% ریزش</strong>
          <span class="step-hint text-rose">نیاز به پیشنهاد تخفیف یا پاپ‌آپ</span>
        </div>
      </div>

      <!-- بوم نمودار میله‌ای/ارتفاعی تعاملی (Interactive SVG/CSS Chart) -->
      <div class="chart-canvas-wrapper">
        <div class="chart-bars-track">
          @for (point of activeData(); track point.date; let i = $index) {
            <div
              class="bar-column"
              (mouseenter)="hoveredPoint.set(point)"
              (mouseleave)="hoveredPoint.set(null)"
              [class.hovered]="hoveredPoint()?.date === point.date"
            >
              <!-- مقدار روی ستون در هاور -->
              <div class="bar-tooltip" *ngIf="hoveredPoint()?.date === point.date">
                <span class="tt-date">{{ point.date }}</span>
                <span class="tt-val" [ngClass]="selectedMetric()">
                  {{ formatValue(point, selectedMetric()) }}
                </span>
                <span class="tt-sub">
                  {{ point.orders }} سفارش قطعی · {{ point.views }} بازدید
                </span>
              </div>

              <!-- میله نمودار با ارتفاع درصدی -->
              <div class="bar-fill-wrap">
                <div
                  class="bar-fill"
                  [ngClass]="selectedMetric()"
                  [style.height.%]="getBarHeightPercent(point)"
                >
                  <span class="bar-glow"></span>
                </div>
              </div>

              <!-- برچسب تاریخ زیر ستون -->
              <span class="bar-label">{{ point.label }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-chart-container {
      padding: 1.6rem;
      display: flex;
      flex-direction: column;
      gap: 1.4rem;
      background: linear-gradient(135deg, rgba(24, 24, 32, 0.85), rgba(18, 18, 23, 0.95));
    }

    /* سربرگ */
    .chart-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.2rem;

      .chart-badge {
        font-size: 11px;
        font-weight: 700;
        color: var(--color-ice);
        background: rgba(56, 189, 248, 0.12);
        padding: 3px 9px;
        border-radius: var(--radius-full);
        display: inline-block;
        margin-bottom: 4px;
      }

      .chart-title {
        font-size: 18px;
        font-weight: 800;
        color: var(--text-main);
      }

      .chart-subtitle {
        font-size: 12.5px;
        color: var(--text-dim);
        margin-top: 3px;
      }

      .chart-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .metric-tabs {
        display: flex;
        background: rgba(0, 0, 0, 0.35);
        padding: 3px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-subtle);
        gap: 2px;
        flex-wrap: wrap;

        .metric-btn {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 11.5px;
          font-weight: 700;
          color: var(--text-dim);
          background: transparent;
          transition: all 0.2s;

          &:hover {
            color: var(--text-main);
          }

          &.active {
            color: #09090b;
            font-weight: 800;
            &.revenue { background: #a78bfa; box-shadow: 0 0 12px rgba(167, 139, 250, 0.5); }
            &.views { background: #38bdf8; box-shadow: 0 0 12px rgba(56, 189, 248, 0.5); }
            &.abandoned { background: #fb7185; box-shadow: 0 0 12px rgba(251, 113, 133, 0.5); }
            &.conversion { background: #4ade80; box-shadow: 0 0 12px rgba(74, 222, 128, 0.5); }
          }
        }
      }

      .timeframe-switch {
        display: flex;
        background: rgba(0, 0, 0, 0.35);
        padding: 3px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-subtle);
        gap: 2px;

        button {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 11.5px;
          font-weight: 700;
          color: var(--text-dim);
          background: transparent;

          &.active {
            background: rgba(255, 255, 255, 0.15);
            color: var(--text-main);
          }
        }
      }
    }

    /* خلاصه قیف فروش */
    .funnel-summary {
      display: grid;
      grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
      align-items: center;
      gap: 8px;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);

      @media (max-width: 900px) {
        grid-template-columns: 1fr 1fr;
        .funnel-arrow { display: none; }
      }

      .funnel-step {
        display: flex;
        flex-direction: column;
        gap: 3px;

        .step-label {
          font-size: 11px;
          color: var(--text-dim);
        }

        .step-value {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-main);
        }

        .step-hint {
          font-size: 10.5px;
          color: var(--text-muted);
        }

        &.highlight-success {
          background: rgba(34, 197, 94, 0.08);
          padding: 8px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        &.highlight-drop {
          background: rgba(244, 63, 94, 0.08);
          padding: 8px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(244, 63, 94, 0.2);
        }
      }

      .funnel-arrow {
        color: var(--text-muted);
        font-weight: 800;
        font-size: 14px;
      }
    }

    /* بوم نمودار */
    .chart-canvas-wrapper {
      position: relative;
      height: 240px;
      padding-top: 2rem;
    }

    .chart-bars-track {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 100%;
      gap: 10px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .bar-column {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      cursor: pointer;

      .bar-fill-wrap {
        width: 100%;
        max-width: 44px;
        height: 100%;
        display: flex;
        align-items: flex-end;
        justify-content: center;
      }

      .bar-fill {
        width: 100%;
        border-radius: var(--radius-sm) var(--radius-sm) 0 0;
        transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.2s ease;
        position: relative;
        min-height: 8px;

        &.revenue {
          background: linear-gradient(180deg, #a78bfa, rgba(167, 139, 250, 0.35));
        }
        &.views {
          background: linear-gradient(180deg, #38bdf8, rgba(56, 189, 248, 0.35));
        }
        &.abandoned {
          background: linear-gradient(180deg, #fb7185, rgba(251, 113, 133, 0.35));
        }
        &.conversion {
          background: linear-gradient(180deg, #4ade80, rgba(74, 222, 128, 0.35));
        }
      }

      &:hover .bar-fill {
        filter: brightness(1.25);
        box-shadow: 0 0 16px rgba(255, 255, 255, 0.2);
      }

      .bar-label {
        position: absolute;
        bottom: 0;
        font-size: 11px;
        color: var(--text-dim);
        white-space: nowrap;
        direction: rtl;
      }

      .bar-tooltip {
        position: absolute;
        top: -45px;
        background: rgba(18, 18, 23, 0.95);
        border: 1px solid var(--border-subtle);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        padding: 6px 12px;
        border-radius: var(--radius-sm);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        z-index: 20;
        pointer-events: none;
        white-space: nowrap;

        .tt-date { font-size: 10.5px; color: var(--text-dim); }
        .tt-val { font-size: 13px; font-weight: 800; font-family: var(--font-mono); }
        .tt-sub { font-size: 10px; color: var(--text-muted); }

        .tt-val.revenue { color: #a78bfa; }
        .tt-val.views { color: #38bdf8; }
        .tt-val.abandoned { color: #fb7185; }
        .tt-val.conversion { color: #4ade80; }
      }
    }

    .text-accent { color: #4ade80; }
    .text-cyan { color: #38bdf8; }
    .text-rose { color: #fb7185; }
  `]
})
export class AnalyticsChartComponent {
  @Input() data7d: ChartDataPoint[] = [];
  @Input() data30d: ChartDataPoint[] = [];
  @Input() funnel?: FunnelAnalytics;

  readonly selectedMetric = signal<MetricType>('revenue');
  readonly timeframe = signal<TimeframeType>('7d');
  readonly hoveredPoint = signal<ChartDataPoint | null>(null);

  readonly activeData = computed(() => {
    return this.timeframe() === '7d' ? this.data7d : this.data30d;
  });

  setMetric(m: MetricType): void {
    this.selectedMetric.set(m);
  }

  setTimeframe(t: TimeframeType): void {
    this.timeframe.set(t);
  }

  currentMetricTitle(): string {
    const titles: Record<MetricType, string> = {
      revenue: 'نمودار رشد فروش و درآمد ریالی فروشگاه',
      views: 'نمودار حجم ترافیک و بازدیدهای کاربران',
      abandoned: 'تحلیل سبدهای رها شده و بازدیدهای بدون خرید',
      conversion: 'نرخ تبدیل بازدیدکننده به خریدار واقعی (Conversion Rate)',
    };
    return titles[this.selectedMetric()];
  }

  currentMetricDesc(): string {
    const descs: Record<MetricType, string> = {
      revenue: 'مبالغ کل فاکتورهای پرداخت شده در بازه انتخابی',
      views: 'تعداد کل صفحات بازدید شده توسط کاربران مهمان و ثبت‌نامی',
      abandoned: 'تعداد کاربرانی که کالا را دیدند یا به سبد اضافه کردند اما پرداخت نهایی نکردند',
      conversion: 'درصد خریداران نهایی به نسبت کل ترافیک ورودی فروشگاه',
    };
    return descs[this.selectedMetric()];
  }

  getBarHeightPercent(point: ChartDataPoint): number {
    const metric = this.selectedMetric();
    const list = this.activeData();
    if (!list.length) return 10;

    let maxVal = 1;
    if (metric === 'revenue') maxVal = Math.max(...list.map(p => p.revenue), 1);
    if (metric === 'views') maxVal = Math.max(...list.map(p => p.views), 1);
    if (metric === 'abandoned') maxVal = Math.max(...list.map(p => p.abandoned), 1);
    if (metric === 'conversion') maxVal = Math.max(...list.map(p => p.conversionRate), 1);

    let val = 0;
    if (metric === 'revenue') val = point.revenue;
    if (metric === 'views') val = point.views;
    if (metric === 'abandoned') val = point.abandoned;
    if (metric === 'conversion') val = point.conversionRate;

    const pct = Math.round((val / maxVal) * 90);
    return Math.max(pct, 12);
  }

  formatValue(point: ChartDataPoint, metric: MetricType): string {
    if (metric === 'revenue') {
      return (point.revenue).toLocaleString('fa-IR') + ' تومان';
    }
    if (metric === 'views') {
      return point.views.toLocaleString('fa-IR') + ' بازدید';
    }
    if (metric === 'abandoned') {
      return point.abandoned.toLocaleString('fa-IR') + ' سبد رها شده';
    }
    if (metric === 'conversion') {
      return point.conversionRate + '% نرخ تبدیل';
    }
    return '';
  }

  calculateRate(sub: number, total: number): number {
    if (!total) return 0;
    return Number(((sub / total) * 100).toFixed(1));
  }
}
