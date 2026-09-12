/* ==========================================================================
   📌 کامپوننت نوبار ریسپانسیو موبایل (Mobile Bottom Navigation - mobile-nav.component.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این کامپوننت معادل `components/admin/MobileNav.vue` است.
   روی گوشی‌های هوشمند (صفحات کوچک‌تر از 768px)، دسترسی سریع به بخش‌های اصلی:
   داشبورد، محصولات، سفارشات، اسکن سه‌بعدی و تنظیمات را فراهم می‌کند.
   ========================================================================== */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="mobile-bottom-bar">
      <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="tab-item">
        <span class="tab-icon">📊</span>
        <span class="tab-label">داشبورد</span>
      </a>

      <a routerLink="/products" routerLinkActive="active" class="tab-item">
        <span class="tab-icon">📦</span>
        <span class="tab-label">محصولات</span>
      </a>

      <a routerLink="/orders" routerLinkActive="active" class="tab-item">
        <span class="tab-icon">🛍️</span>
        <span class="tab-label">سفارشات</span>
      </a>

      <a href="http://localhost:3000/studio/scan" target="_blank" class="tab-item">
        <span class="tab-icon">✨</span>
        <span class="tab-label">اسکن 3D</span>
      </a>

      <button *ngIf="authService.isFullAdmin()" class="tab-item btn-tab" (click)="logoutPrompt()">
        <span class="tab-icon">👑</span>
        <span class="tab-label">مدیر</span>
      </button>
    </nav>
  `,
  styles: [`
    .mobile-bottom-bar {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: rgba(18, 18, 23, 0.92);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border-top: 1px solid var(--border-subtle);
      z-index: 50;
      justify-content: space-around;
      align-items: center;
      padding: 0 0.5rem;
      padding-bottom: env(safe-area-inset-bottom, 0px);

      @media (max-width: 768px) {
        display: flex;
      }
    }

    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      flex: 1;
      height: 100%;
      color: var(--text-dim);
      font-size: 11px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      background: transparent;

      .tab-icon {
        font-size: 19px;
        transition: transform 0.2s ease;
      }

      &:active {
        transform: scale(0.92);
      }

      &.active {
        color: var(--color-primary);
        .tab-icon {
          transform: translateY(-2px) scale(1.1);
          filter: drop-shadow(0 0 6px rgba(167, 139, 250, 0.5));
        }
      }
    }

    .btn-tab {
      cursor: pointer;
    }
  `]
})
export class MobileNavComponent {
  readonly authService = inject(AuthService);

  logoutPrompt(): void {
    if (confirm('آیا قصد خروج از حساب مدیریت را دارید؟')) {
      this.authService.logout();
    }
  }
}
