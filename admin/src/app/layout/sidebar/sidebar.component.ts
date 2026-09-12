/* ==========================================================================
   📌 کامپوننت سایدبار پنل ادمین (Sidebar Component - sidebar.component.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این کامپوننت معادل `components/admin/Sidebar.vue` است.
   در تمپلیت انگولار:
   - `<a routerLink="/dashboard" routerLinkActive="active">` دقیقاً معادل
     `<NuxtLink to="/dashboard" active-class="active">` در Vue Router است.
   - برای تکرار آیتم‌ها از ساختار جدید `@for (item of navItems; track item.path)`
     استفاده می‌کنیم که در Angular 17+ جایگزین `*ngFor` شده و فوق‌العاده سریع‌تر است
     (مشابه `v-for="item in navItems" :key="item.path"` در Vue).
   ========================================================================== */

import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <!-- برند و لوگو -->
      <div class="sidebar-brand">
        <div class="brand-info">
          <div class="brand-icon">💨</div>
          <div class="brand-text" *ngIf="!collapsed">
            <h2>ویپورا ادمین</h2>
            <span class="subtext">مدیریت فروشگاه ویپ</span>
          </div>
        </div>
        <button class="mobile-close-btn" (click)="closeMobile.emit()" title="بستن منو">✕</button>
      </div>

      <!-- منوی ناوبری اصلی -->
      <nav class="sidebar-nav">
        <ul>
          @for (item of navItems; track item.path) {
            @if (!item.adminOnly || authService.isFullAdmin()) {
              <li>
                <a
                  [routerLink]="item.path"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
                  class="nav-link"
                  [title]="collapsed ? item.label : ''"
                >
                  <span class="nav-icon">{{ item.icon }}</span>
                  <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
                  <span class="nav-badge" *ngIf="!collapsed && item.badge">{{ item.badge }}</span>
                </a>
              </li>
            }
          }
        </ul>
      </nav>

      <!-- پروفایل کاربر و دکمه خروج -->
      <div class="sidebar-footer" *ngIf="!collapsed">
        <div class="user-info">
          <span class="user-avatar">{{ authService.currentUser()?.avatarUrl || '👤' }}</span>
          <div class="user-details">
            <p class="user-name">{{ authService.currentUser()?.name }}</p>
            <span class="user-role" [class.admin]="authService.isFullAdmin()">
              {{ authService.isFullAdmin() ? 'مدیر کل سیستم' : 'اپراتور شیفت' }}
            </span>
          </div>
        </div>

        <button class="logout-btn" (click)="authService.logout()" title="خروج از حساب">
          🚪 خروج
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--bg-surface);
      border-left: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: sticky;
      top: 0;
      z-index: 40;

      @media (max-width: 768px) {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        width: 280px;
        z-index: 60;
        box-shadow: -10px 0 30px rgba(0, 0, 0, 0.7);
        transform: translateX(100%);
        &.mobile-open {
          transform: translateX(0);
        }
      }
    }

    .sidebar.collapsed {
      width: var(--sidebar-collapsed-width);
      .sidebar-brand .brand-text,
      .nav-label,
      .nav-badge,
      .sidebar-footer {
        display: none;
      }
      .nav-link {
        justify-content: center;
        padding: 0.8rem;
      }
      @media (max-width: 768px) {
        width: 280px;
        .sidebar-brand .brand-text,
        .nav-label,
        .nav-badge,
        .sidebar-footer {
          display: flex;
        }
      }
    }

    .sidebar-brand {
      height: var(--header-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 0 1.2rem;
      border-bottom: 1px solid var(--border-subtle);

      .brand-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .brand-icon {
        font-size: 24px;
        filter: drop-shadow(0 0 8px var(--color-primary));
      }

      h2 {
        font-size: 16px;
        font-weight: 800;
        color: var(--text-main);
        letter-spacing: -0.02em;
      }

      .subtext {
        font-size: 11px;
        color: var(--text-dim);
      }

      .mobile-close-btn {
        display: none;
        width: 32px;
        height: 32px;
        border-radius: var(--radius-sm);
        background: rgba(255, 255, 255, 0.06);
        color: var(--text-dim);
        font-size: 16px;
        place-items: center;
        border: 1px solid var(--border-subtle);
        &:hover {
          background: rgba(255, 255, 255, 0.12);
          color: white;
        }
        @media (max-width: 768px) {
          display: grid;
        }
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: 1.2rem 0.8rem;
      overflow-y: auto;

      ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0.75rem 1rem;
        border-radius: var(--radius-md);
        color: var(--text-dim);
        font-size: 13.5px;
        font-weight: 600;
        transition: all 0.2s ease;

        .nav-icon {
          font-size: 18px;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-main);
        }

        &.active {
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.18), rgba(56, 189, 248, 0.1));
          color: var(--color-primary);
          border: 1px solid rgba(167, 139, 250, 0.3);
          box-shadow: 0 4px 15px rgba(167, 139, 250, 0.15);
        }

        .nav-badge {
          margin-right: auto;
          background: var(--color-blush);
          color: white;
          font-size: 10.5px;
          padding: 2px 7px;
          border-radius: var(--radius-full);
          font-weight: 800;
        }
      }
    }

    .sidebar-footer {
      padding: 1.2rem;
      border-top: 1px solid var(--border-subtle);
      background: rgba(0, 0, 0, 0.2);

      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 0.8rem;

        .user-avatar {
          font-size: 24px;
        }

        .user-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-main);
        }

        .user-role {
          font-size: 10.5px;
          color: var(--text-dim);
          &.admin {
            color: var(--color-primary);
            font-weight: 700;
          }
        }
      }

      .logout-btn {
        width: 100%;
        padding: 0.55rem;
        background: rgba(244, 63, 94, 0.1);
        color: var(--color-blush);
        border: 1px solid rgba(244, 63, 94, 0.25);
        border-radius: var(--radius-sm);
        font-size: 12px;
        font-weight: 700;
        &:hover {
          background: rgba(244, 63, 94, 0.2);
        }
      }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() closeMobile = new EventEmitter<void>();
  
  // 💡 تزریق سرویس با inject() معادل useAuth() در Nuxt 3
  readonly authService = inject(AuthService);

  readonly navItems: NavItem[] = [
    { label: 'داشبورد آمار', path: '/dashboard', icon: '📊' },
    { label: 'مدیریت محصولات', path: '/products', icon: '📦' },
    { label: 'مدیریت سفارشات', path: '/orders', icon: '🛍️', badge: 'جدید' },
    { label: 'استودیو اسکن 3D', path: '/studio', icon: '✨' },
    { label: 'تنظیمات سیستم', path: '/settings', icon: '⚙️', adminOnly: true },
  ];
}
