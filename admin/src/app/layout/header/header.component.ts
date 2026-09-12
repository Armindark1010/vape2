/* ==========================================================================
   📌 کامپوننت هدر بالای پنل ادمین (Header Component - header.component.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این کامپوننت معادل `components/admin/Header.vue` است.
   در اینجا با استفاده از `@Output()` و `EventEmitter`، رویداد کلیک باز/بسته
   شدن سایدبار را به لایوت والد پاس می‌دهیم (مشابه `emit('toggle-sidebar')` در Vue).
   ========================================================================== */

import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="admin-header">
      <!-- دکمه تاگل سایدبار و عنوان صفحه -->
      <div class="header-left">
        <button
          class="menu-toggle-btn"
          (click)="toggleSidebar.emit()"
          title="تغییر وضعیت منو"
        >
          ☰
        </button>
        <div class="page-meta">
          <span class="breadcrumb">ویپورا ادمین</span>
          <span class="sub-breadcrumb">/ مدیریت فروشگاه</span>
        </div>
      </div>

      <!-- وضعیت زنده سیستم و پروفایل کاربری -->
      <div class="header-right">
        <!-- برچسب وضعیت زنده سرور -->
        <div class="live-status" title="ارتباط زنده با پایگاه‌داده">
          <span class="status-pulse"></span>
          <span class="status-text">دیتابیس متصل</span>
        </div>

        <!-- نشانگر سطح دسترسی کاربر -->
        <div class="role-badge" [class.admin-role]="authService.isFullAdmin()">
          {{ authService.isFullAdmin() ? '👑 مدیر کل' : '🛡️ اپراتور' }}
        </div>

        <!-- لینک بازگشت به فروشگاه اصلی -->
        <a href="http://localhost:3000" target="_blank" class="store-link-btn" title="مشاهده فروشگاه عمومی">
          <span class="icon">🌐</span>
          <span class="text">فروشگاه</span>
        </a>
      </div>
    </header>
  `,
  styles: [`
    .admin-header {
      height: var(--header-height);
      background: rgba(18, 18, 23, 0.85);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.8rem;
      position: sticky;
      top: 0;
      z-index: 30;

      @media (max-width: 768px) {
        padding: 0 1rem;
        height: 60px;
      }
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .menu-toggle-btn {
        width: 38px;
        height: 38px;
        border-radius: var(--radius-sm);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-dim);
        font-size: 18px;
        display: grid;
        place-items: center;
        border: 1px solid var(--border-subtle);
        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-main);
        }
      }

      .page-meta {
        display: flex;
        align-items: center;
        gap: 6px;

        .breadcrumb {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-main);
        }

        .sub-breadcrumb {
          font-size: 12px;
          color: var(--text-muted);
          @media (max-width: 540px) {
            display: none;
          }
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;

      .live-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: var(--color-accent);
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.25);
        padding: 4px 10px;
        border-radius: var(--radius-full);
        font-weight: 600;

        .status-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-accent);
          box-shadow: 0 0 8px var(--color-accent);
          animation: pulse 1.8s infinite;
        }

        @media (max-width: 480px) {
          .status-text {
            display: none;
          }
        }
      }

      .role-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: var(--radius-full);
        background: rgba(255, 255, 255, 0.06);
        color: var(--text-dim);
        border: 1px solid var(--border-subtle);

        &.admin-role {
          background: rgba(167, 139, 250, 0.15);
          color: #c084fc;
          border-color: rgba(167, 139, 250, 0.35);
        }
      }

      .store-link-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11.5px;
        font-weight: 600;
        color: var(--text-main);
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-subtle);
        padding: 5px 12px;
        border-radius: var(--radius-md);
        transition: all 0.2s;
        &:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--color-primary);
        }
        @media (max-width: 400px) {
          .text {
            display: none;
          }
        }
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
    }
  `]
})
export class HeaderComponent {
  // 💡 EventEmitter معادل defineEmits(['toggleSidebar']) در Vue 3 است
  @Output() toggleSidebar = new EventEmitter<void>();

  readonly authService = inject(AuthService);
}
