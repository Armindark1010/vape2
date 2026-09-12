/* ==========================================================================
   📌 لایوت اصلی پنل مدیریت (Admin Layout Component - admin-layout.component.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این فایل معادل `layouts/admin.vue` است:
     <template>
       <div class="admin-wrapper">
         <Sidebar />
         <div class="content-area">
           <Header />
           <slot /> <!-- یا <NuxtPage /> -->
         </div>
         <MobileNav />
       </div>
     </template>
   ========================================================================== */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, MobileNavComponent],
  template: `
    <div class="admin-shell">
      <!-- پس‌زمینه تیره تار برای بستن منوی موبایل با لمس -->
      <div
        class="mobile-backdrop"
        [class.active]="mobileMenuOpen()"
        (click)="closeMobileMenu()"
      ></div>

      <!-- سایدبار ناوبری راست‌چین با پشتیبانی از حالت دسکتاپ و دراور موبایل -->
      <app-sidebar
        [collapsed]="sidebarCollapsed()"
        [mobileOpen]="mobileMenuOpen()"
        [class.mobile-open]="mobileMenuOpen()"
        (closeMobile)="closeMobileMenu()"
      ></app-sidebar>

      <!-- ناحیه محتوای اصلی -->
      <div class="main-viewport">
        <!-- هدر بالای صفحه -->
        <app-header (toggleSidebar)="toggleSidebar()"></app-header>

        <!-- نقطه تزریق و رندر صفحات فرزند (معادل <NuxtPage /> در Nuxt) -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- نوار ناوبری پایین صفحه مخصوص گوشی‌های هوشمند -->
      <app-mobile-nav></app-mobile-nav>
    </div>
  `,
  styles: [`
    .admin-shell {
      display: flex;
      min-height: 100vh;
      background: var(--bg-main);
      position: relative;
    }

    .mobile-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 55;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;

      @media (max-width: 768px) {
        display: block;
        &.active {
          opacity: 1;
          pointer-events: auto;
        }
      }
    }

    .main-viewport {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow-x: hidden;
    }

    .page-content {
      flex: 1;
      padding: 1.8rem;
      background: radial-gradient(circle at 80% 10%, rgba(167, 139, 250, 0.05) 0%, transparent 50%),
                  radial-gradient(circle at 10% 80%, rgba(56, 189, 248, 0.04) 0%, transparent 50%);
      overflow-y: auto;

      @media (max-width: 768px) {
        padding: 1rem 0.85rem 5.5rem 0.85rem; /* پدینگ پایین برای جلوگیری از پوشانده شدن توسط bottom nav */
      }
    }
  `]
})
export class AdminLayoutComponent {
  // 💡 سیگنال‌ها برای کنترل وضعیت منوها
  readonly sidebarCollapsed = signal<boolean>(false);
  readonly mobileMenuOpen = signal<boolean>(false);

  toggleSidebar(): void {
    if (window.innerWidth <= 768) {
      this.mobileMenuOpen.update((v) => !v);
    } else {
      this.sidebarCollapsed.update((v) => !v);
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
