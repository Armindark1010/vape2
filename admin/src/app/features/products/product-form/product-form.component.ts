/* ==========================================================================
   📌 کامپوننت فرم ایجاد و ویرایش محصول (ProductFormComponent - product-form.component.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این صفحه معادل `pages/admin/products/[id].vue` یا `pages/admin/products/new.vue`
   است:
     const route = useRoute();
     const isEdit = computed(() => !!route.params.id);
     const form = reactive({ name: '', price: 0, ... });
     if (isEdit.value) {
       const product = await $fetch(`/api/products/${route.params.id}`);
       Object.assign(form, product);
     }

   در Angular:
   1. با `inject(ActivatedRoute)` پارامترهای آدرس را می‌خوانیم.
   2. فرم را با `FormGroup` و `FormControl` مقداردهی کرده و با متد `patchValue()`
      داده‌های محصول لود شده از سرور را به فرم تزریق می‌کنیم.
   3. تمام فیلدها ولیدیشن لحظه‌ای با متد `isInvalid(name)` دارند.
   ========================================================================== */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="form-page">
      <!-- سربرگ صفحه -->
      <div class="page-header">
        <div>
          <h1 class="page-title">
            {{ isEditMode() ? '✏️ ویرایش محصول ویپ' : '➕ افزودن محصول جدید' }}
          </h1>
          <p class="page-desc">مشخصات طعم، قیمت، موجودی انبار و رسانه‌های محصول را وارد کنید</p>
        </div>
        <a routerLink="/products" class="back-btn">
          ← بازگشت به لیست محصولات
        </a>
      </div>

      <!-- وضعیت لودینگ اولیه محصول در حالت ویرایش -->
      <div *ngIf="loadingProduct()" class="glass-card loading-state">
        <span class="spinner">⏳</span> در حال دریافت مشخصات محصول از پایگاه داده...
      </div>

      <!-- کارت فرم اصلی -->
      <div *ngIf="!loadingProduct()" class="form-card glass-card">
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
          <!-- ردیف اول: نام، اسلاگ و برند -->
          <div class="form-grid-3">
            <div class="form-group">
              <label for="name">نام محصول (فارسی / انگلیسی)</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                placeholder="مثلاً: پاد یک‌بارمصرف ELFBAR TE6000"
                class="form-control"
                [class.invalid]="isInvalid('name')"
              />
              <span class="error-msg" *ngIf="isInvalid('name')">نام محصول الزامی است (حداقل ۳ کاراکتر).</span>
            </div>

            <div class="form-group">
              <label for="slug">اسلاگ یکتا (Slug URL)</label>
              <input
                id="slug"
                type="text"
                dir="ltr"
                formControlName="slug"
                placeholder="elfbar-te6000"
                class="form-control"
                [class.invalid]="isInvalid('slug')"
              />
              <span class="error-msg" *ngIf="isInvalid('slug')">اسلاگ انگلیسی برای آدرس محصول الزامی است.</span>
            </div>

            <div class="form-group">
              <label for="brand">برند سازنده</label>
              <select id="brand" formControlName="brand" class="form-control">
                <option value="ELFBAR">ELFBAR</option>
                <option value="VOZOL">VOZOL</option>
                <option value="NASTY">NASTY</option>
                <option value="VAPORESSO">VAPORESSO</option>
                <option value="LOST MARY">LOST MARY</option>
                <option value="VAPORA">VAPORA (محصول اختصاصی)</option>
              </select>
            </div>
          </div>

          <!-- ردیف دوم: دسته‌بندی و شعار طعم -->
          <div class="form-grid-2">
            <div class="form-group">
              <label for="category">دسته‌بندی اصلی</label>
              <select id="category" formControlName="category" class="form-control">
                <option value="pods">پاد یک‌بارمصرف (Disposable Pods)</option>
                <option value="salts">سالت نیکوتین (Nicotine Salt)</option>
                <option value="mods">مود و پاد سیستم (Pod Mods)</option>
                <option value="gear">لوازم جانبی و کویل (Gear & Coils)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="tagline">شعار طعم یا خلاصه ویژگی</label>
              <input
                id="tagline"
                type="text"
                formControlName="tagline"
                placeholder="مثلاً: طعم انگور یخ و بلوبری نئونی — ۶۰۰۰ پاف"
                class="form-control"
              />
            </div>
          </div>

          <!-- ردیف سوم: قیمت، قیمت تخفیف و موجودی انبار -->
          <div class="form-grid-3">
            <div class="form-group">
              <label for="price">قیمت اصلی (تومان)</label>
              <input
                id="price"
                type="number"
                dir="ltr"
                formControlName="price"
                placeholder="1150000"
                class="form-control font-mono"
                [class.invalid]="isInvalid('price')"
              />
              <span class="error-msg" *ngIf="isInvalid('price')">قیمت معتبر وارد کنید (حداقل ۱۰,۰۰۰ تومان).</span>
            </div>

            <div class="form-group">
              <label for="discountPrice">قیمت حراج / تخفیف‌دار (اختیاری)</label>
              <input
                id="discountPrice"
                type="number"
                dir="ltr"
                formControlName="discountPrice"
                placeholder="990000"
                class="form-control font-mono"
              />
            </div>

            <div class="form-group">
              <label for="stock">موجودی در انبار (تعداد)</label>
              <input
                id="stock"
                type="number"
                dir="ltr"
                formControlName="stock"
                placeholder="25"
                class="form-control font-mono"
                [class.invalid]="isInvalid('stock')"
              />
              <span class="error-msg" *ngIf="isInvalid('stock')">موجودی نمی‌تواند منفی باشد.</span>
            </div>
          </div>

          <!-- توضیحات کامل -->
          <div class="form-group">
            <label for="description">توضیحات و نقد و بررسی محصول</label>
            <textarea
              id="description"
              rows="4"
              formControlName="description"
              placeholder="توضیحات فنی، مشخصات باتری، حجم مخزن و طعم‌های موجود..."
              class="form-control textarea"
            ></textarea>
          </div>

          <!-- لینک تصویر محصول و پیش‌نمایش -->
          <div class="form-group">
            <label for="imageUrl">آدرس تصویر محصول (Image URL)</label>
            <input
              id="imageUrl"
              type="text"
              dir="ltr"
              formControlName="imageUrl"
              placeholder="https://images.pexels.com/photos/..."
              class="form-control font-mono"
            />
            <div class="image-preview" *ngIf="productForm.get('imageUrl')?.value">
              <span>پیش‌نمایش تصویر:</span>
              <img [src]="productForm.get('imageUrl')?.value" alt="Preview" class="preview-img" />
            </div>
          </div>

          <!-- بج‌ها و وضعیت‌های نمایش -->
          <div class="checkbox-row">
            <label class="custom-checkbox">
              <input type="checkbox" formControlName="featured" />
              <span>نمایش در بخش محصولات ویژه (Featured)</span>
            </label>

            <label class="custom-checkbox">
              <input type="checkbox" formControlName="bestSeller" />
              <span>نشان پرفروش‌ترین‌ها (Best Seller)</span>
            </label>
          </div>

          <!-- دکمه‌های ثبت و انصراف -->
          <div class="form-actions">
            <button type="submit" class="glow-btn" [disabled]="saving() || productForm.invalid">
              <span *ngIf="saving()">⏳ در حال ذخیره‌سازی...</span>
              <span *ngIf="!saving()">{{ isEditMode() ? '💾 ذخیره تغییرات محصول' : '➕ ثبت نهایی محصول' }}</span>
            </button>
            <a routerLink="/products" class="cancel-btn">انصراف</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-page {
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
      .back-btn {
        font-size: 12.5px;
        color: var(--text-dim);
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-subtle);
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        &:hover { color: var(--text-main); background: rgba(255, 255, 255, 0.1); }
      }
    }

    .loading-state {
      padding: 3rem;
      text-align: center;
      color: var(--text-dim);
    }

    .form-card {
      padding: 2rem;
    }

    .form-grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.2rem;
    }

    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 1.2rem;
      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }

    .form-group {
      margin-bottom: 1.3rem;

      label {
        display: block;
        font-size: 12.5px;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 0.45rem;
      }

      .form-control {
        width: 100%;
        height: 46px;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        padding: 0 1rem;
        font-size: 13.5px;
        color: var(--text-main);
        &:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
        }
        &.invalid {
          border-color: var(--color-blush);
        }
      }

      .textarea {
        height: auto;
        padding: 0.8rem 1rem;
        resize: vertical;
      }

      .error-msg {
        font-size: 11px;
        color: var(--color-blush);
        margin-top: 4px;
        display: block;
      }
    }

    .image-preview {
      margin-top: 0.8rem;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;
      color: var(--text-dim);

      .preview-img {
        width: 60px;
        height: 60px;
        border-radius: var(--radius-sm);
        object-fit: cover;
        border: 1px solid var(--border-subtle);
      }
    }

    .checkbox-row {
      display: flex;
      gap: 2rem;
      margin: 1.2rem 0 2rem;
      flex-wrap: wrap;

      .custom-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 600;
        color: var(--text-main);
        cursor: pointer;

        input {
          width: 18px;
          height: 18px;
          accent-color: var(--color-primary);
        }
      }
    }

    .form-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-subtle);

      .cancel-btn {
        padding: 0.65rem 1.4rem;
        font-size: 13px;
        font-weight: 700;
        color: var(--text-dim);
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--radius-md);
        &:hover { color: var(--text-main); background: rgba(255, 255, 255, 0.1); }
      }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // 💡 سیگنال‌های استیت فرم
  readonly isEditMode = signal<boolean>(false);
  readonly loadingProduct = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  private currentProductId?: number;

  /**
   * تعریف Reactive Form با اعتبارسنجی
   */
  readonly productForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    slug: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]),
    brand: new FormControl('ELFBAR', [Validators.required]),
    category: new FormControl('pods', [Validators.required]),
    tagline: new FormControl(''),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(10000)]),
    discountPrice: new FormControl<number | null>(null),
    stock: new FormControl<number>(10, [Validators.required, Validators.min(0)]),
    description: new FormControl(''),
    imageUrl: new FormControl('https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=600'),
    featured: new FormControl(false),
    bestSeller: new FormControl(false),
  });

  ngOnInit(): void {
    // خواندن شناسه محصول از روت (معادل route.params.id در Nuxt)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.currentProductId = Number(idParam);
      this.loadProductDetails(this.currentProductId);
    }
  }

  isInvalid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  loadProductDetails(id: number): void {
    this.loadingProduct.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        // پر کردن فیلدهای فرم با اطلاعات محصول دریافتی از سرور
        this.productForm.patchValue({
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          category: product.category,
          tagline: product.tagline,
          price: product.price,
          discountPrice: product.discountPrice ?? null,
          stock: product.stock,
          description: product.description,
          imageUrl: product.images[0] || '',
          featured: product.featured,
          bestSeller: product.bestSeller,
        });
        this.loadingProduct.set(false);
      },
      error: (err) => {
        alert(err.message || 'خطا در بارگذاری مشخصات محصول');
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const formVal = this.productForm.getRawValue();

    const productPayload: Partial<Product> = {
      name: formVal.name!,
      slug: formVal.slug!,
      brand: formVal.brand!,
      category: formVal.category!,
      tagline: formVal.tagline || '',
      price: Number(formVal.price),
      discountPrice: formVal.discountPrice ? Number(formVal.discountPrice) : null,
      stock: Number(formVal.stock),
      description: formVal.description || '',
      images: [formVal.imageUrl || ''],
      featured: !!formVal.featured,
      bestSeller: !!formVal.bestSeller,
    };

    if (this.isEditMode() && this.currentProductId) {
      // حالت ویرایش (Update)
      this.productService.updateProduct(this.currentProductId, productPayload).subscribe({
        next: () => {
          this.saving.set(false);
          alert('محصول با موفقیت ویرایش شد.');
          this.router.navigate(['/products']);
        },
        error: () => this.saving.set(false),
      });
    } else {
      // حالت ایجاد محصول جدید (Create)
      this.productService.createProduct(productPayload).subscribe({
        next: () => {
          this.saving.set(false);
          alert('محصول جدید با موفقیت ایجاد گردید.');
          this.router.navigate(['/products']);
        },
        error: () => this.saving.set(false),
      });
    }
  }
}
