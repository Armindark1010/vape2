/* ==========================================================================
   📌 کامپوننت مدیریت و لیست محصولات (ProductListComponent - product-list.component.ts)
   ==========================================================================
   💡 این معادل چیه؟ و چرا بخش RxJS اینجا حیاتی است؟
   توی Nuxt 3 سرچ زنده را معمولاً این‌طوری می‌نوشتیم:
     const searchQuery = ref('');
     watch(searchQuery, useDebounceFn(async (newVal) => {
       products.value = await $fetch(`/api/products?q=${newVal}`);
     }, 300));

   در Angular با **RxJS**:
   ما از قدرت عملگرهای جریانی (Stream Operators) استفاده می‌کنیم:
   1. `Subject<string>`: یک جریان ورودی که هر حرف تایپ شده وارد آن می‌شود (`.next(term)`).
   2. `debounceTime(300)`: تا وقتی کاربر ۳۰۰ میلی‌ثانیه مکث نکرده، درخواستی ارسال نمی‌شود.
   3. `distinctUntilChanged()`: اگر متن تغییری نکرده باشد (مثلاً فشردن کلید جهت‌نما)، ریکوئست تکراری فرستاده نمی‌شود.
   4. `switchMap()`: **مهم‌ترین بخش!** اگر ریکوئست قبلی هنوز در حال اجرا در شبکه باشد و کاربر کلمه جدیدی تایپ کند، ریکوئست قبلی به صورت خودکار لغو (Cancel) می‌شود تا جلوی Race Condition گرفته شود!
   ========================================================================== */

import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product, ProductFilter, PaginatedProducts } from '../../../core/models/product.model';
import { TomanPipe } from '../../../shared/pipes/toman.pipe';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TomanPipe, StatusBadgeComponent],
  template: `
    <div class="products-page">
      <!-- سربرگ و دکمه افزودن محصول جدید -->
      <div class="page-header">
        <div>
          <h1 class="page-title">مدیریت محصولات ویپ و سالت</h1>
          <p class="page-desc">مشاهده، ویرایش، کنترل موجودی انبار و فیلتر زنده محصولات</p>
        </div>
        <a routerLink="/products/new" class="glow-btn">
          ➕ افزودن محصول جدید
        </a>
      </div>

      <!-- نوار فیلتر زنده و جستجو (RxJS Search Bar) -->
      <div class="filter-bar glass-card">
        <!-- ورودی جستجوی متنی با RxJS -->
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            placeholder="جستجوی زنده در نام، برند یا طعم ویپ..."
            class="search-input"
            [ngModel]="searchTerm"
            (ngModelChange)="onSearchChange($event)"
          />
        </div>

        <!-- سلکتور دسته‌بندی -->
        <select class="filter-select" [(ngModel)]="selectedCategory" (change)="applyFilters()">
          <option value="all">همه دسته‌بندی‌ها</option>
          <option value="pods">پاد یک‌بارمصرف</option>
          <option value="salts">سالت نیکوتین</option>
          <option value="mods">مود و پاد سیستم</option>
          <option value="gear">لوازم جانبی</option>
        </select>

        <!-- سلکتور برند -->
        <select class="filter-select" [(ngModel)]="selectedBrand" (change)="applyFilters()">
          <option value="all">همه برندها</option>
          <option value="ELFBAR">ELFBAR</option>
          <option value="VOZOL">VOZOL</option>
          <option value="NASTY">NASTY</option>
          <option value="VAPORESSO">VAPORESSO</option>
          <option value="LOST MARY">LOST MARY</option>
        </select>

        <!-- سلکتور وضعیت موجودی -->
        <select class="filter-select" [(ngModel)]="selectedStockStatus" (change)="applyFilters()">
          <option value="all">همه وضعیت‌های انبار</option>
          <option value="in_stock">موجود در انبار</option>
          <option value="low_stock">موجودی کم (زیر ۱۰ عدد)</option>
          <option value="out_of_stock">ناموجود</option>
        </select>
      </div>

      <!-- پیام وضعیت لودینگ جستجو -->
      <div *ngIf="isSearching()" class="search-indicator">
        <span class="pulse-dot"></span> در حال جستجوی بلادرنگ در پایگاه داده...
      </div>

      <!-- جدول نمایش محصولات -->
      <div class="table-container glass-card">
        <div class="table-responsive">
          <table class="products-table">
            <thead>
              <tr>
                <th>تصویر</th>
                <th>نام و مشخصات محصول</th>
                <th>دسته‌بندی</th>
                <th>برند</th>
                <th>قیمت فروش</th>
                <th>موجودی</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              @if (products().length === 0 && !loading()) {
                <tr>
                  <td colspan="8" class="empty-state">
                    <p class="empty-icon">🔍</p>
                    <p class="empty-text">هیچ محصولی با فیلترهای انتخابی شما پیدا نشد.</p>
                  </td>
                </tr>
              }

              @for (p of products(); track p.id) {
                <tr [class.low-stock-row]="p.stock <= 5 && p.stock > 0" [class.out-stock-row]="p.stock === 0">
                  <!-- تصویر -->
                  <td class="img-cell">
                    <img [src]="p.images[0]" [alt]="p.name" class="product-thumb" />
                  </td>

                  <!-- نام و مشخصات -->
                  <td class="info-cell">
                    <strong class="product-name">{{ p.name }}</strong>
                    <span class="product-tagline">{{ p.tagline }}</span>
                    <div class="badges-row">
                      <span *ngIf="p.featured" class="mini-tag featured">ویژه</span>
                      <span *ngIf="p.bestSeller" class="mini-tag bestseller">پرفروش</span>
                      <span *ngIf="p.newArrival" class="mini-tag new">جدید</span>
                    </div>
                  </td>

                  <!-- دسته -->
                  <td>
                    <span class="category-pill">{{ getCategoryLabel(p.category) }}</span>
                  </td>

                  <!-- برند -->
                  <td class="brand-cell font-mono">{{ p.brand }}</td>

                  <!-- قیمت -->
                  <td class="price-cell">
                    <div class="current-price font-mono font-bold">
                      {{ (p.discountPrice || p.price) | toman }}
                    </div>
                    <div *ngIf="p.discountPrice" class="old-price font-mono">
                      {{ p.price | toman }}
                    </div>
                  </td>

                  <!-- موجودی -->
                  <td class="stock-cell font-mono font-bold" [class.out]="p.stock === 0" [class.low]="p.stock <= 5">
                    {{ p.stock }} عدد
                  </td>

                  <!-- بج وضعیت -->
                  <td>
                    <app-status-badge [status]="p.stock + ''" type="stock"></app-status-badge>
                  </td>

                  <!-- دکمه‌های عملیات -->
                  <td class="actions-cell">
                    <a [routerLink]="['/products/edit', p.id]" class="action-btn edit-btn" title="ویرایش محصول">
                      ✏️ ویرایش
                    </a>
                    <button
                      *ngIf="authService.isFullAdmin()"
                      (click)="confirmDelete(p)"
                      class="action-btn delete-btn"
                      title="حذف محصول"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- کارت‌های ریسپانسیو محصولات در موبایل -->
        <div class="mobile-products-cards">
          @for (p of products(); track p.id) {
            <div class="mob-product-card" [class.out]="p.stock === 0">
              <div class="mob-top">
                <img [src]="p.images[0]" [alt]="p.name" class="mob-thumb" />
                <div class="mob-info">
                  <span class="mob-brand">{{ p.brand }} · {{ getCategoryLabel(p.category) }}</span>
                  <h4 class="mob-name">{{ p.name }}</h4>
                  <div class="mob-price-row">
                    <span class="mob-price font-mono font-bold">{{ (p.discountPrice || p.price) | toman }}</span>
                    <app-status-badge [status]="p.stock + ''" type="stock"></app-status-badge>
                  </div>
                </div>
              </div>

              <div class="mob-actions">
                <a [routerLink]="['/products/edit', p.id]" class="mob-btn edit">✏️ ویرایش مشخصات و موجودی</a>
                <button
                  *ngIf="authService.isFullAdmin()"
                  (click)="confirmDelete(p)"
                  class="mob-btn delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          }
        </div>

        <!-- صفحه‌بندی (Pagination) -->
        <div class="pagination-bar" *ngIf="totalPages() > 1">
          <span class="page-info">
            نمایش صفحه {{ currentPage() }} از {{ totalPages() }} (مجموع {{ totalItems() }} کالا)
          </span>
          <div class="page-buttons">
            <button
              class="page-nav-btn"
              [disabled]="currentPage() === 1"
              (click)="changePage(currentPage() - 1)"
            >
              قبلی
            </button>
            @for (pg of [].constructor(totalPages()); track $index) {
              <button
                class="page-num-btn"
                [class.active]="currentPage() === ($index + 1)"
                (click)="changePage($index + 1)"
              >
                {{ $index + 1 }}
              </button>
            }
            <button
              class="page-nav-btn"
              [disabled]="currentPage() === totalPages()"
              (click)="changePage(currentPage() + 1)"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;

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

    .filter-bar {
      padding: 1rem 1.2rem;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;

      .search-input-wrap {
        flex: 1;
        min-width: 260px;
        position: relative;

        .search-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-dim);
          font-size: 14px;
        }

        .search-input {
          width: 100%;
          height: 44px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0 2.6rem 0 1rem;
          font-size: 13.5px;
          color: var(--text-main);
          &:focus {
            border-color: var(--color-primary);
          }
        }
      }

      .filter-select {
        height: 44px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        padding: 0 1rem;
        font-size: 13px;
        color: var(--text-main);
        min-width: 160px;
        &:focus {
          border-color: var(--color-primary);
        }
      }
    }

    .search-indicator {
      font-size: 12px;
      color: var(--color-ice);
      display: flex;
      align-items: center;
      gap: 6px;
      .pulse-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-ice);
        animation: blink 1s infinite alternate;
      }
    }

    .table-container {
      overflow: hidden;
    }

    .products-table {
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
        padding: 0.9rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;
      }

      tr:hover td {
        background: rgba(255, 255, 255, 0.02);
      }

      tr.low-stock-row td {
        background: rgba(245, 158, 11, 0.03);
      }
      tr.out-stock-row td {
        background: rgba(244, 63, 94, 0.04);
      }
    }

    .product-thumb {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      border: 1px solid var(--border-subtle);
    }

    .info-cell {
      .product-name {
        display: block;
        font-size: 13.5px;
        font-weight: 700;
        color: var(--text-main);
      }
      .product-tagline {
        display: block;
        font-size: 11px;
        color: var(--text-dim);
        margin-top: 2px;
      }
      .badges-row {
        display: flex;
        gap: 4px;
        margin-top: 4px;
      }
      .mini-tag {
        font-size: 9.5px;
        padding: 1px 6px;
        border-radius: var(--radius-sm);
        font-weight: 700;
        &.featured { background: rgba(167, 139, 250, 0.2); color: var(--color-primary); }
        &.bestseller { background: rgba(245, 158, 11, 0.2); color: var(--color-gold); }
        &.new { background: rgba(56, 189, 248, 0.2); color: var(--color-ice); }
      }
    }

    .category-pill {
      font-size: 11px;
      padding: 3px 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-sm);
      color: var(--text-dim);
    }

    .price-cell {
      .old-price {
        font-size: 11px;
        color: var(--text-muted);
        text-decoration: line-through;
      }
    }

    .stock-cell {
      &.low { color: #fbbf24; }
      &.out { color: #fb7185; }
    }

    .actions-cell {
      display: flex;
      gap: 6px;

      .action-btn {
        padding: 5px 10px;
        border-radius: var(--radius-sm);
        font-size: 11.5px;
        font-weight: 700;
        border: 1px solid var(--border-subtle);

        &.edit-btn {
          background: rgba(56, 189, 248, 0.1);
          color: var(--color-ice);
          border-color: rgba(56, 189, 248, 0.3);
          &:hover { background: rgba(56, 189, 248, 0.2); }
        }

        &.delete-btn {
          background: rgba(244, 63, 94, 0.1);
          color: var(--color-blush);
          border-color: rgba(244, 63, 94, 0.3);
          &:hover { background: rgba(244, 63, 94, 0.2); }
        }
      }
    }

    .table-responsive {
      overflow-x: auto;
      @media (max-width: 768px) {
        display: none;
      }
    }

    .mobile-products-cards {
      display: none;
      flex-direction: column;
      gap: 12px;
      padding: 1rem;

      @media (max-width: 768px) {
        display: flex;
      }

      .mob-product-card {
        padding: 1rem;
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        display: flex;
        flex-direction: column;
        gap: 10px;

        &.out {
          border-color: rgba(244, 63, 94, 0.3);
          background: rgba(244, 63, 94, 0.04);
        }

        .mob-top {
          display: flex;
          gap: 12px;

          .mob-thumb {
            width: 60px;
            height: 60px;
            border-radius: var(--radius-sm);
            object-fit: cover;
            border: 1px solid var(--border-subtle);
            flex-shrink: 0;
          }

          .mob-info {
            flex: 1;
            min-width: 0;

            .mob-brand {
              font-size: 11px;
              color: var(--color-primary);
              font-weight: 700;
            }

            .mob-name {
              font-size: 13.5px;
              font-weight: 700;
              color: var(--text-main);
              margin: 2px 0 6px 0;
            }

            .mob-price-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 8px;

              .mob-price {
                font-size: 13px;
                color: #4ade80;
              }
            }
          }
        }

        .mob-actions {
          display: flex;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);

          .mob-btn {
            padding: 8px 12px;
            font-size: 12px;
            font-weight: 700;
            border-radius: var(--radius-sm);
            display: grid;
            place-items: center;
            transition: all 0.2s;

            &.edit {
              flex: 1;
              background: rgba(56, 189, 248, 0.12);
              color: var(--color-ice);
              border: 1px solid rgba(56, 189, 248, 0.25);
            }

            &.delete {
              width: 44px;
              background: rgba(244, 63, 94, 0.12);
              color: var(--color-blush);
              border: 1px solid rgba(244, 63, 94, 0.25);
            }
          }
        }
      }
    }

    .empty-state {
      padding: 3rem !important;
      text-align: center;
      .empty-icon { font-size: 32px; margin-bottom: 0.5rem; }
      .empty-text { color: var(--text-dim); font-size: 13.5px; }
    }

    .pagination-bar {
      padding: 1rem 1.2rem;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;

      .page-info {
        font-size: 12px;
        color: var(--text-dim);
      }

      .page-buttons {
        display: flex;
        gap: 6px;

        .page-nav-btn, .page-num-btn {
          padding: 5px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dim);

          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-main);
          }

          &.active {
            background: var(--color-primary);
            color: #09090b;
            border-color: var(--color-primary);
          }

          &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
        }
      }
    }

    @keyframes blink {
      0% { opacity: 0.2; }
      100% { opacity: 1; }
    }
  `]
})
export class ProductListComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  readonly authService = inject(AuthService);

  // 💡 سیگنال‌های استیت جدول محصولات (معادل ref در Vue)
  readonly products = signal<Product[]>([]);
  readonly loading = signal<boolean>(true);
  readonly isSearching = signal<boolean>(false);
  readonly currentPage = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly totalItems = signal<number>(0);

  // متغیرهای فیلتر تمپلیت
  searchTerm = '';
  selectedCategory = 'all';
  selectedBrand = 'all';
  selectedStockStatus = 'all';

  // 🔹 موتور سرچ زنده با RxJS Subject (اینجا جادوی RxJS اتفاق می‌افتد!)
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  ngOnInit(): void {
    this.setupRxJsSearchPipeline();
    this.fetchProducts();
  }

  ngOnDestroy(): void {
    // جلوگیری از Memory Leak با آن‌سابسکرایب کردن در تخریب کامپوننت
    this.searchSubscription?.unsubscribe();
  }

  /**
   * 🌟 خط لوله جستجوی واکنشی (RxJS Reactive Search Pipeline):
   * گوش دادن به تایپ کاربر -> اعمال تاخیر -> لغو ریکوئست قبلی با switchMap -> بروزرسانی لیست
   */
  private setupRxJsSearchPipeline(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),          // مکث ۳۰۰ میلی‌ثانیه بعد از آخرین کلید
        distinctUntilChanged(),     // عدم ارسال اگر متن عوض نشده باشد
        tap(() => this.isSearching.set(true)),
        switchMap((query) => {
          // ارسال ریکوئست به سرویس با فیلتر جدید
          const filter: ProductFilter = {
            query,
            category: this.selectedCategory,
            brand: this.selectedBrand,
            stockStatus: this.selectedStockStatus as any,
            page: 1, // ریست به صفحه اول در جستجو
            limit: 10,
          };
          return this.productService.getProducts(filter);
        })
      )
      .subscribe({
        next: (result: PaginatedProducts) => {
          this.products.set(result.items);
          this.currentPage.set(result.page);
          this.totalPages.set(result.totalPages);
          this.totalItems.set(result.total);
          this.isSearching.set(false);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('خطا در سرچ محصول:', err);
          this.isSearching.set(false);
        }
      });
  }

  /**
   * زمانی که کاربر در اینپوت تایپ می‌کند، مقدار را به جریان RxJS پمپ می‌کنیم
   */
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.fetchProducts();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading.set(true);
    const filter: ProductFilter = {
      query: this.searchTerm,
      category: this.selectedCategory,
      brand: this.selectedBrand,
      stockStatus: this.selectedStockStatus as any,
      page: this.currentPage(),
      limit: 10,
    };

    this.productService.getProducts(filter).subscribe({
      next: (res) => {
        this.products.set(res.items);
        this.totalPages.set(res.totalPages);
        this.totalItems.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  confirmDelete(p: Product): void {
    if (confirm(`آیا از حذف محصول "${p.name}" اطمینان دارید؟`)) {
      this.productService.deleteProduct(p.id).subscribe({
        next: () => {
          alert('محصول با موفقیت حذف شد.');
          this.fetchProducts();
        },
      });
    }
  }

  getCategoryLabel(slug: string): string {
    const map: Record<string, string> = {
      pods: 'پاد یک‌بارمصرف',
      salts: 'سالت نیکوتین',
      mods: 'مود و پادسیستم',
      gear: 'لوازم جانبی',
    };
    return map[slug] || slug;
  }
}
