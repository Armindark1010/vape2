/* ==========================================================================
   📌 کامپوننت مدیریت بنرها و اسلایدرها (BannerListComponent - banner-list.component.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این کامپوننت معادل `pages/admin/banners.vue` است.
   
   در Angular:
   1. از Standalone Components استفاده شده (بدون نیاز به NgModule).
   2. از Angular Signals (`bannerService.bannersSignal`) برای واکنش‌پذیری آنی بهره گرفته شده
      (دقیقاً مثل `computed(() => banners.value)` در Vue 3).
   3. از Reactive Forms برای اعتبارسنجی دقیق فرم ثبت و ویرایش بنر استفاده شده است.
   4. یکپارچه‌سازی شده با کامپوننت ادیتور و کراپ تصویر (`ImageCropperComponent`).
   ========================================================================== */

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BannerService } from '../../../core/services/banner.service';
import { Banner, BannerFormData } from '../../../core/models/banner.model';
import { ImageCropperComponent, CropResult } from '../../../shared/components/image-cropper/image-cropper.component';

@Component({
  selector: 'app-banner-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageCropperComponent],
  template: `
    <div class="banners-container" dir="rtl">
      <!-- هدر صفحه و دکمه افزودن -->
      <header class="page-header">
        <div class="header-titles">
          <div class="title-badge">
            <span class="icon">🖼️</span>
            <span>مدیریت بنرها و اسلایدر</span>
          </div>
          <h1>مدیریت بنرهای صفحه اصلی</h1>
          <p class="subtitle">
            تنظیم بنرهای اسلایدر هدر، پروموشن‌ها و تخفیف‌های ویژه متصل مستقیم به پایگاه داده PostgreSQL
          </p>
        </div>

        <button class="btn-primary" (click)="openAddModal()">
          <span class="btn-icon">+</span>
          <span>افزودن بنر جدید</span>
        </button>
      </header>

      <!-- کارت‌های آمار و خلاصه‌وضعیت -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-label">تعداد کل بنرها</span>
          <strong class="stat-value">{{ banners().length }}</strong>
        </div>
        <div class="stat-card active-card">
          <span class="stat-label">بنرهای فعال در سایت</span>
          <strong class="stat-value text-emerald">{{ activeBannersCount() }}</strong>
        </div>
        <div class="stat-card">
          <span class="stat-label">موقعیت اسلایدر هدر (Hero)</span>
          <strong class="stat-value text-vio">{{ heroBannersCount() }}</strong>
        </div>
        <div class="stat-card">
          <span class="stat-label">موقعیت بنر میانی (Promo)</span>
          <strong class="stat-value text-sky">{{ middleBannersCount() }}</strong>
        </div>
      </div>

      <!-- وضعیت لودینگ -->
      <div *ngIf="loading()" class="loading-state">
        <div class="spinner"></div>
        <p>در حال دریافت اطلاعات بنرها از دیتابیس...</p>
      </div>

      <!-- گرید نمایش بنرها -->
      <div *ngIf="!loading()" class="banners-grid">
        @for (b of banners(); track b.id) {
          <div class="banner-card" [class.inactive]="!b.active">
            <!-- تصویر بنر همراه با برچسب موقعیت و وضعیت -->
            <div class="banner-image-box" (click)="openCropperForBanner(b)" title="کلیک برای تنظیم کادر و برش">
              <img [src]="b.image" [alt]="b.title" loading="lazy" (error)="onImgError($event)" />
              <div class="overlay-tags">
                <span class="position-tag" [class.hero]="b.position === 'hero'">
                  {{ b.position === 'hero' ? 'اسلایدر هدر (Hero)' : 'بنر میانی (Middle)' }}
                </span>
                <span class="status-tag" [class.active]="b.active">
                  {{ b.active ? '🟢 فعال' : '⚪ غیرفعال' }}
                </span>
              </div>
              <span class="order-badge">اولویت: {{ b.sortOrder }}</span>
              <div class="crop-hover-hint">
                <span>✂️ تنظیم کادر و ادیت</span>
              </div>
            </div>

            <!-- محتوای متنی بنر -->
            <div class="banner-body">
              <div class="badge-chip" *ngIf="b.badge">{{ b.badge }}</div>
              <h3 class="banner-title">{{ b.title }}</h3>
              <p class="banner-subtitle" *ngIf="b.subtitle">{{ b.subtitle }}</p>

              <div class="banner-meta">
                <div class="meta-item">
                  <span class="meta-label">لینک مقصد:</span>
                  <span class="meta-val ltr font-mono">{{ b.link }}</span>
                </div>
                <div class="meta-item" *ngIf="b.buttonText">
                  <span class="meta-label">متن دکمه:</span>
                  <span class="meta-val">{{ b.buttonText }}</span>
                </div>
              </div>

              <!-- اکشن‌های بنر -->
              <div class="banner-actions">
                <button
                  class="btn-toggle"
                  [class.active]="b.active"
                  (click)="toggleStatus(b)"
                  [title]="b.active ? 'غیرفعال‌سازی' : 'فعال‌سازی'"
                >
                  {{ b.active ? 'غیرفعال کن' : 'فعال کن' }}
                </button>
                <div class="btn-group">
                  <button class="btn-action crop" (click)="openCropperForBanner(b)" title="برش و تنظیم کادر عکس">
                    ✂️ کادر
                  </button>
                  <button class="btn-action edit" (click)="openEditModal(b)" title="ویرایش بنر">
                    ✏️ ویرایش
                  </button>
                  <button class="btn-action delete" (click)="deleteBanner(b)" title="حذف بنر">
                    🗑️ حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <span class="empty-icon">🖼️</span>
            <h3>هیچ بنری تعریف نشده است</h3>
            <p>روی دکمه «افزودن بنر جدید» کلیک کنید تا اولین بنر را ثبت نمایید.</p>
          </div>
        }
      </div>

      <!-- مودال فرم افزودن / ویرایش بنر -->
      <div *ngIf="showModal()" class="modal-backdrop" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingBanner() ? 'ویرایش بنر' : 'افزودن بنر جدید' }}</h2>
            <button class="btn-close" (click)="closeModal()">✕</button>
          </div>

          <form [formGroup]="bannerForm" (ngSubmit)="saveBanner()" class="modal-form">
            <!-- پیش‌نمایش زنده و دکمه‌های برش هوشمند تصویر -->
            <div class="form-group image-upload-group">
              <div class="image-label-row">
                <label>تصویر بنر و کادربندی <span class="req">*</span></label>
                <button type="button" class="btn-quick-cropper" (click)="openCropper()">
                  <span>✂️ باز کردن ویرایشگر و کادربندی عکس</span>
                </button>
              </div>

              <!-- باکس پیش‌نمایش تصویر انتخابی با قابلیت کلیک جهت کراپ -->
              <div
                class="preview-box clickable"
                *ngIf="bannerForm.get('image')?.value"
                (click)="openCropper()"
                title="برای تغییر کادر یا بزرگ‌نمایی کلیک کنید"
              >
                <img [src]="bannerForm.get('image')?.value" alt="Preview" (error)="onImgError($event)" />
                <div class="preview-overlay-btn">
                  <span>✂️ کلیک برای تنظیم دقیق کادر و چرخش عکس</span>
                </div>
              </div>

              <!-- انتخاب مستقیم فایل محلی -->
              <div class="file-pick-row">
                <label class="btn-upload-file">
                  <span>📁 انتخاب عکس از حافظه سیستم و برش</span>
                  <input type="file" accept="image/*" (change)="onDirectFileSelected($event)" hidden />
                </label>
              </div>

              <!-- ورودی آدرس دستی -->
              <div class="input-url-wrap">
                <input
                  id="image"
                  type="text"
                  formControlName="image"
                  placeholder="https://images.pexels.com/photos/... یا خروجی برش خورده"
                  class="form-control ltr font-mono"
                />
              </div>
            </div>

            <!-- عنوان بنر -->
            <div class="form-group">
              <label for="title">عنوان اصلی بنر <span class="req">*</span></label>
              <input
                id="title"
                type="text"
                formControlName="title"
                placeholder="مثلاً: تخفیف ویژه سالت‌های نستی مالزی"
                class="form-control"
              />
            </div>

            <!-- زیرعنوان -->
            <div class="form-group">
              <label for="subtitle">زیرعنوان / توضیحات تکمیلی</label>
              <textarea
                id="subtitle"
                formControlName="subtitle"
                rows="2"
                placeholder="مثلاً: تا ۱۵٪ تخفیف روی محبوب‌ترین طعم‌های Cush Man"
                class="form-control"
              ></textarea>
            </div>

            <!-- ردیف فیلدهای دوتایی -->
            <div class="form-row">
              <div class="form-group">
                <label for="badge">متن نشان یا بج (Badge)</label>
                <input
                  id="badge"
                  type="text"
                  formControlName="badge"
                  placeholder="مثلاً: ⚡ پیشنهاد ویژه"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="buttonText">متن دکمه اکشن</label>
                <input
                  id="buttonText"
                  type="text"
                  formControlName="buttonText"
                  placeholder="مشاهده و خرید آنلاین"
                  class="form-control"
                />
              </div>
            </div>

            <!-- لینک مقصد و اولویت نمایش -->
            <div class="form-row">
              <div class="form-group">
                <label for="link">لینک مقصد (URL / Route) <span class="req">*</span></label>
                <input
                  id="link"
                  type="text"
                  formControlName="link"
                  placeholder="/shop?category=salts"
                  class="form-control ltr font-mono"
                />
              </div>

              <div class="form-group">
                <label for="sortOrder">اولویت نمایش (ترتیب اسلاید)</label>
                <input
                  id="sortOrder"
                  type="number"
                  formControlName="sortOrder"
                  min="0"
                  class="form-control"
                />
              </div>
            </div>

            <!-- موقعیت و وضعیت فعال -->
            <div class="form-row">
              <div class="form-group">
                <label for="position">موقعیت قرارگیری در صفحه</label>
                <select id="position" formControlName="position" class="form-control">
                  <option value="hero">اسلایدر بالای صفحه (Hero)</option>
                  <option value="middle">بنر پروموشن میانی (Middle)</option>
                </select>
              </div>

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="active" />
                  <span>بنر فعال و قابل نمایش در سایت باشد</span>
                </label>
              </div>
            </div>

            <!-- دکمه‌های فرم -->
            <div class="modal-footer">
              <button type="button" class="btn-cancel" (click)="closeModal()">انصراف</button>
              <button type="submit" class="btn-submit" [disabled]="bannerForm.invalid || submitting()">
                {{ submitting() ? 'در حال ذخیره‌سازی...' : editingBanner() ? 'ذخیره تغییرات' : 'ثبت بنر جدید' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- کامپوننت مودال کراپ و ادیتور تصویر -->
      <app-image-cropper
        *ngIf="showCropper()"
        [initialImageUrl]="cropperInitialImage()"
        (cropCompleted)="onCropSaved($event)"
        (cancel)="showCropper.set(false)"
      ></app-image-cropper>
    </div>
  `,
  styles: [`
    .banners-container {
      padding: 1.5rem;
      max-width: 1300px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;

      .title-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(167, 139, 250, 0.12);
        color: var(--color-primary);
        padding: 4px 12px;
        border-radius: var(--radius-full);
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      h1 {
        font-size: 22px;
        font-weight: 900;
        color: var(--text-main);
      }

      .subtitle {
        font-size: 13px;
        color: var(--text-dim);
        margin-top: 4px;
      }

      .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #a78bfa, #38bdf8);
        color: #09090b !important;
        font-weight: 900;
        font-size: 14px;
        padding: 0.75rem 1.4rem;
        border-radius: var(--radius-md);
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(167, 139, 250, 0.4);
        transition: all 0.2s ease;

        .btn-icon {
          font-size: 18px;
          font-weight: 900;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(167, 139, 250, 0.6);
          filter: brightness(1.08);
        }
      }
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.8rem;

      .stat-card {
        background: var(--bg-surface);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 6px;

        .stat-label {
          font-size: 12px;
          color: var(--text-dim);
          font-weight: 600;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 900;
          color: var(--text-main);
          font-family: monospace;
        }

        .text-emerald { color: #34d399; }
        .text-vio { color: var(--color-primary); }
        .text-sky { color: var(--color-secondary); }
      }
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-dim);
      .spinner {
        width: 36px;
        height: 36px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 1rem;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .banners-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.4rem;
    }

    .banner-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.25s ease;

      &:hover {
        border-color: rgba(167, 139, 250, 0.35);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        transform: translateY(-3px);
      }

      &.inactive {
        opacity: 0.65;
        filter: grayscale(0.2);
      }

      .banner-image-box {
        position: relative;
        height: 180px;
        background: #000;
        overflow: hidden;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        &:hover img {
          transform: scale(1.05);
        }

        .crop-hover-hint {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;

          span {
            background: rgba(18, 18, 23, 0.9);
            border: 1px solid rgba(56, 189, 248, 0.5);
            color: var(--color-secondary);
            font-size: 12px;
            font-weight: 800;
            padding: 6px 14px;
            border-radius: var(--radius-full);
          }
        }

        &:hover .crop-hover-hint {
          opacity: 1;
        }

        .overlay-tags {
          position: absolute;
          top: 10px;
          right: 10px;
          left: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .position-tag {
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(8px);
            color: #fff;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: var(--radius-sm);
            border: 1px solid rgba(255, 255, 255, 0.15);
            &.hero { border-color: rgba(167, 139, 250, 0.4); }
          }

          .status-tag {
            background: rgba(0, 0, 0, 0.75);
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: var(--radius-sm);
            &.active { color: #34d399; }
          }
        }

        .order-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: var(--text-dim);
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
        }
      }

      .banner-body {
        padding: 1.2rem;
        display: flex;
        flex-direction: column;
        flex: 1;

        .badge-chip {
          display: inline-block;
          align-self: flex-start;
          background: rgba(167, 139, 250, 0.15);
          color: var(--color-primary);
          font-size: 11px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
          margin-bottom: 0.5rem;
        }

        .banner-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 0.4rem;
          line-height: 1.4;
        }

        .banner-subtitle {
          font-size: 12.5px;
          color: var(--text-dim);
          line-height: 1.5;
          margin-bottom: 0.8rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .banner-meta {
          margin-top: auto;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.6rem 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 1rem;

          .meta-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11.5px;

            .meta-label { color: var(--text-dim); }
            .meta-val { color: var(--text-main); font-weight: 700; }
          }
        }

        .banner-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          border-top: 1px solid var(--border-subtle);
          padding-top: 0.8rem;

          .btn-toggle {
            background: rgba(255, 255, 255, 0.06);
            color: var(--text-dim);
            border: 1px solid var(--border-subtle);
            padding: 0.45rem 0.8rem;
            border-radius: var(--radius-sm);
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;

            &.active {
              background: rgba(52, 211, 153, 0.1);
              color: #34d399;
              border-color: rgba(52, 211, 153, 0.3);
            }

            &:hover { background: rgba(255, 255, 255, 0.12); }
          }

          .btn-group {
            display: flex;
            gap: 6px;

            .btn-action {
              background: transparent;
              border: 1px solid var(--border-subtle);
              color: var(--text-dim);
              padding: 0.45rem 0.75rem;
              border-radius: var(--radius-sm);
              font-size: 12px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.2s;

              &.crop:hover {
                background: rgba(167, 139, 250, 0.12);
                color: var(--color-primary);
                border-color: var(--color-primary);
              }

              &.edit:hover {
                background: rgba(56, 189, 248, 0.12);
                color: var(--color-secondary);
                border-color: var(--color-secondary);
              }

              &.delete:hover {
                background: rgba(244, 63, 94, 0.12);
                color: var(--color-blush);
                border-color: var(--color-blush);
              }
            }
          }
        }
      }
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 1rem;
      background: var(--bg-surface);
      border: 1px dashed var(--border-subtle);
      border-radius: var(--radius-xl);

      .empty-icon { font-size: 40px; margin-bottom: 1rem; display: inline-block; }
      h3 { font-size: 17px; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem; }
      p { font-size: 13px; color: var(--text-dim); }
    }

    /* استایل مودال دیالوگ */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    }

    .modal-content {
      background: #121217;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 640px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
      animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.95); } to { transform: scale(1); } }

    .modal-header {
      padding: 1.2rem 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 { font-size: 17px; font-weight: 800; color: var(--text-main); }
      .btn-close {
        background: transparent;
        border: none;
        color: var(--text-dim);
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        &:hover { color: white; }
      }
    }

    .modal-form {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.1rem;

      .image-upload-group {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .image-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .btn-quick-cropper {
            background: rgba(167, 139, 250, 0.12);
            color: var(--color-primary);
            border: 1px solid rgba(167, 139, 250, 0.3);
            border-radius: var(--radius-sm);
            padding: 3px 10px;
            font-size: 11.5px;
            font-weight: 800;
            cursor: pointer;
            &:hover { background: rgba(167, 139, 250, 0.22); }
          }
        }

        .preview-box {
          position: relative;
          height: 150px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-subtle);
          background: #000;
          cursor: pointer;

          img { width: 100%; height: 100%; object-fit: cover; }

          .preview-overlay-btn {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;

            span {
              background: #181820;
              border: 1px solid rgba(56, 189, 248, 0.5);
              color: var(--color-secondary);
              font-size: 12px;
              font-weight: 800;
              padding: 6px 14px;
              border-radius: var(--radius-full);
            }
          }

          &:hover .preview-overlay-btn {
            opacity: 1;
          }
        }

        .file-pick-row {
          .btn-upload-file {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px dashed var(--border-subtle);
            color: var(--text-dim);
            padding: 0.6rem;
            border-radius: var(--radius-sm);
            font-size: 12.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              background: rgba(255, 255, 255, 0.08);
              color: var(--text-main);
              border-color: rgba(255, 255, 255, 0.3);
            }
          }
        }
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text-main);
          .req { color: var(--color-blush); }
        }

        .form-control {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.85rem;
          color: var(--text-main);
          font-size: 13.5px;
          transition: border-color 0.2s;

          &:focus {
            outline: none;
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15);
          }
        }
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        @media (max-width: 500px) {
          grid-template-columns: 1fr;
        }
      }

      .checkbox-group {
        justify-content: center;
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-main);
          cursor: pointer;
          margin-top: 1.5rem;
        }
      }
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 1rem;
      border-top: 1px solid var(--border-subtle);
      padding-top: 1rem;

      .btn-cancel {
        background: transparent;
        border: 1px solid var(--border-subtle);
        color: var(--text-dim);
        padding: 0.65rem 1.2rem;
        border-radius: var(--radius-sm);
        font-weight: 700;
        cursor: pointer;
        &:hover { background: rgba(255, 255, 255, 0.05); }
      }

      .btn-submit {
        background: linear-gradient(135deg, #a78bfa, #38bdf8);
        color: #09090b !important;
        font-weight: 900;
        padding: 0.65rem 1.4rem;
        border-radius: var(--radius-sm);
        border: none;
        cursor: pointer;
        &:disabled { opacity: 0.5; cursor: not-allowed; }
      }
    }

    .ltr { direction: ltr; text-align: left; }
    .font-mono { font-family: monospace; }
  `]
})
export class BannerListComponent implements OnInit {
  private readonly bannerService = inject(BannerService);
  private readonly fb = inject(FormBuilder);

  // سیگنال‌های واکنشی
  readonly banners = this.bannerService.bannersSignal;
  readonly loading = this.bannerService.loadingSignal;
  readonly showModal = signal<boolean>(false);
  readonly editingBanner = signal<Banner | null>(null);
  readonly submitting = signal<boolean>(false);

  // وضعیت کراپ ادیتور
  readonly showCropper = signal<boolean>(false);
  readonly cropperInitialImage = signal<string>('');
  private cropperTargetBannerId: number | null = null;

  // محاسبات با computed() (معادل computed(() => ...) در Vue 3)
  readonly activeBannersCount = computed(() => this.banners().filter((b) => b.active).length);
  readonly heroBannersCount = computed(() => this.banners().filter((b) => b.position === 'hero').length);
  readonly middleBannersCount = computed(() => this.banners().filter((b) => b.position === 'middle').length);

  // فرم ری‌اکتیو انگولار
  bannerForm: FormGroup = this.initForm();

  ngOnInit(): void {
    this.bannerService.getBanners().subscribe();
  }

  initForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      subtitle: [''],
      badge: [''],
      image: ['', [Validators.required]],
      link: ['/shop', [Validators.required]],
      buttonText: ['مشاهده و خرید آنلاین'],
      position: ['hero', [Validators.required]],
      sortOrder: [1, [Validators.required, Validators.min(0)]],
      active: [true],
    });
  }

  openAddModal(): void {
    this.editingBanner.set(null);
    this.bannerForm.reset({
      title: '',
      subtitle: '',
      badge: '',
      image: 'https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=1400',
      link: '/shop',
      buttonText: 'مشاهده و خرید آنلاین',
      position: 'hero',
      sortOrder: this.banners().length + 1,
      active: true,
    });
    this.showModal.set(true);
  }

  openEditModal(banner: Banner): void {
    this.editingBanner.set(banner);
    this.bannerForm.patchValue({
      title: banner.title,
      subtitle: banner.subtitle || '',
      badge: banner.badge || '',
      image: banner.image,
      link: banner.link,
      buttonText: banner.buttonText,
      position: banner.position,
      sortOrder: banner.sortOrder,
      active: banner.active,
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingBanner.set(null);
  }

  // متدهای ادیتور و برش تصویر
  openCropper(): void {
    this.cropperTargetBannerId = null;
    const currentImg =
      this.bannerForm.get('image')?.value ||
      'https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=1400';
    this.cropperInitialImage.set(currentImg);
    this.showCropper.set(true);
  }

  openCropperForBanner(banner: Banner): void {
    this.cropperTargetBannerId = banner.id;
    this.cropperInitialImage.set(banner.image);
    this.showCropper.set(true);
  }

  onDirectFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.cropperTargetBannerId = null;
          this.cropperInitialImage.set(e.target.result as string);
          this.showCropper.set(true);
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onCropSaved(result: CropResult): void {
    this.showCropper.set(false);

    if (this.cropperTargetBannerId) {
      // اگر کراپ مستقیم روی کارت بنر در گرید کلیک شده بود، بنر سریعاً در دیتابیس آپدیت می‌شود
      this.bannerService
        .updateBanner(this.cropperTargetBannerId, { image: result.dataUrl })
        .subscribe();
    } else {
      // در غیر این صورت فیلد فرم ادیت/افزودن با دیتای برش خورده پر می‌شود
      this.bannerForm.patchValue({ image: result.dataUrl });
    }
  }

  saveBanner(): void {
    if (this.bannerForm.invalid) return;

    this.submitting.set(true);
    const formVal = this.bannerForm.value as BannerFormData;
    const editing = this.editingBanner();

    if (editing) {
      this.bannerService.updateBanner(editing.id, formVal).subscribe({
        next: () => {
          this.submitting.set(false);
          this.closeModal();
        },
        error: () => this.submitting.set(false),
      });
    } else {
      this.bannerService.createBanner(formVal).subscribe({
        next: () => {
          this.submitting.set(false);
          this.closeModal();
        },
        error: () => this.submitting.set(false),
      });
    }
  }

  toggleStatus(banner: Banner): void {
    this.bannerService.toggleBannerActive(banner.id, banner.active).subscribe();
  }

  deleteBanner(banner: Banner): void {
    if (confirm(`آیا از حذف بنر «${banner.title}» اطمینان دارید؟`)) {
      this.bannerService.deleteBanner(banner.id).subscribe();
    }
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src =
      'https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
}
