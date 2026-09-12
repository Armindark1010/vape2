/* ==========================================================================
   📌 کامپوننت صفحه ورود ادمین (Admin Login Component - login.component.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این صفحه معادل `pages/auth/login.vue` است:
     const form = reactive({ username: '', password: '', role: 'full-admin' });
     const loading = ref(false);
     const handleSubmit = async () => { ... };

   در Angular:
   ما از **Reactive Forms** استفاده می‌کنیم (`FormGroup`, `FormControl`, `Validators`):
   1. ولیدیشن‌ها مستقیماً در کدهای TypeScript تعریف می‌شوند، نه درون تگ‌های HTML تمپلیت!
   2. استیت فرم، ارورها و وضعیت `valid` یا `touched` بودن بدون وابستگی به DOM کنترل می‌شود.
   3. هنگام ارسال فرم با فراخوانی متد `authService.login(...)` به صورت RxJS Observable سابسکرایب می‌کنیم.
   ========================================================================== */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <!-- پس‌زمینه نئونی با افکت تار شیشه‌ای -->
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>

      <div class="login-card glass-card">
        <!-- سربرگ فرم لاگین -->
        <div class="login-header">
          <div class="brand-logo">💨</div>
          <h1>ورود به پنل مدیریت ویپورا</h1>
          <p class="subtitle">سیستم مدیریت محصولات، سفارشات و انبار مرکزی</p>
        </div>

        <!-- دکمه‌های پر کردن سریع اطلاعات دمو (Quick Role Picker) -->
        <div class="quick-roles">
          <span class="quick-title">انتخاب سریع نقش برای تست:</span>
          <div class="role-buttons">
            <button
              type="button"
              class="role-btn"
              [class.active]="loginForm.get('role')?.value === 'full-admin'"
              (click)="selectQuickRole('full-admin')"
            >
              👑 مدیر کل (Admin)
            </button>
            <button
              type="button"
              class="role-btn"
              [class.active]="loginForm.get('role')?.value === 'operator'"
              (click)="selectQuickRole('operator')"
            >
              🛡️ اپراتور (Operator)
            </button>
          </div>
        </div>

        <!-- پیام خطای اعتبارسنجی سرور -->
        <div class="alert-error" *ngIf="errorMessage()">
          ⚠️ {{ errorMessage() }}
        </div>

        <!-- فرم Reactive -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <!-- فیلد نام کاربری -->
          <div class="form-group">
            <label for="username">نام کاربری</label>
            <input
              id="username"
              type="text"
              dir="ltr"
              formControlName="username"
              placeholder="admin or operator"
              class="form-control"
              [class.invalid]="isFieldInvalid('username')"
            />
            <div class="field-error" *ngIf="isFieldInvalid('username')">
              <span *ngIf="loginForm.get('username')?.hasError('required')">نام کاربری الزامی است.</span>
              <span *ngIf="loginForm.get('username')?.hasError('minlength')">حداقل ۳ کاراکتر وارد کنید.</span>
            </div>
          </div>

          <!-- فیلد رمز عبور -->
          <div class="form-group">
            <label for="password">رمز عبور</label>
            <div class="password-wrap">
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                dir="ltr"
                formControlName="password"
                placeholder="••••••••"
                class="form-control"
                [class.invalid]="isFieldInvalid('password')"
              />
              <button
                type="button"
                class="toggle-pass-btn"
                (click)="toggleShowPassword()"
              >
                {{ showPassword() ? '👁️' : '🙈' }}
              </button>
            </div>
            <div class="field-error" *ngIf="isFieldInvalid('password')">
              <span *ngIf="loginForm.get('password')?.hasError('required')">رمز عبور الزامی است.</span>
              <span *ngIf="loginForm.get('password')?.hasError('minlength')">رمز عبور باید حداقل ۴ رقم باشد.</span>
            </div>
          </div>

          <!-- دکمه ورود -->
          <button
            type="submit"
            class="glow-btn submit-btn"
            [disabled]="loading() || loginForm.invalid"
          >
            <span *ngIf="loading()" class="spinner">⏳ در حال ورود...</span>
            <span *ngIf="!loading()">ورود به پنل مدیریت</span>
          </button>
        </form>

        <div class="login-footer">
          <p>سیستم امنیتی ویپورا · بدون نیاز به کد پیامک (OTP)</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: var(--bg-main);
      position: relative;
      overflow: hidden;
    }

    .glow-orb {
      position: absolute;
      width: 450px;
      height: 450px;
      border-radius: 50%;
      filter: blur(120px);
      pointer-events: none;
      opacity: 0.18;
    }
    .orb-1 {
      top: -100px;
      right: -100px;
      background: var(--color-primary);
    }
    .orb-2 {
      bottom: -100px;
      left: -100px;
      background: var(--color-ice);
    }

    .login-card {
      width: 100%;
      max-width: 460px;
      padding: 2.5rem 2rem;
      position: relative;
      z-index: 10;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;

      .brand-logo {
        font-size: 38px;
        margin-bottom: 0.5rem;
        filter: drop-shadow(0 0 12px var(--color-primary));
      }

      h1 {
        font-size: 20px;
        font-weight: 800;
        color: var(--text-main);
        margin-bottom: 0.4rem;
      }

      .subtitle {
        font-size: 12.5px;
        color: var(--text-dim);
      }
    }

    .quick-roles {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.8rem;
      margin-bottom: 1.5rem;

      .quick-title {
        display: block;
        font-size: 11.5px;
        font-weight: 700;
        color: var(--text-dim);
        margin-bottom: 0.5rem;
      }

      .role-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .role-btn {
        padding: 6px;
        font-size: 11.5px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-dim);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-main);
        }

        &.active {
          background: rgba(167, 139, 250, 0.2);
          color: var(--color-primary);
          border-color: var(--color-primary);
        }
      }
    }

    .alert-error {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.35);
      color: #fb7185;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 1.5rem;
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
        height: 48px;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        padding: 0 1rem;
        font-size: 14px;
        color: var(--text-main);
        transition: all 0.2s ease;

        &:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
        }

        &.invalid {
          border-color: var(--color-blush);
        }
      }

      .password-wrap {
        position: relative;
        .form-control {
          padding-left: 45px;
        }
        .toggle-pass-btn {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          font-size: 16px;
          padding: 4px;
        }
      }

      .field-error {
        font-size: 11px;
        color: var(--color-blush);
        margin-top: 4px;
        font-weight: 600;
      }
    }

    .submit-btn {
      width: 100%;
      height: 50px;
      font-size: 14.5px;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .login-footer {
      text-align: center;
      margin-top: 2rem;
      font-size: 11px;
      color: var(--text-muted);
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // 💡 سیگنال‌ها برای مدیریت استیت محلی (مشابه ref(false) در Vue)
  readonly loading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal<boolean>(false);

  /**
   * 💡 تعریف Reactive Form با FormGroup و FormControl:
   * ولیدیتورهای مورد نیاز به عنوان پارامتر دوم ارسال شده‌اند.
   */
  readonly loginForm = new FormGroup({
    username: new FormControl('admin', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('123456', [Validators.required, Validators.minLength(4)]),
    role: new FormControl<UserRole>('full-admin', [Validators.required]),
  });

  /**
   * انتخاب سریع نقش برای سهولت تست
   */
  selectQuickRole(role: UserRole): void {
    this.loginForm.patchValue({
      role,
      username: role === 'full-admin' ? 'admin' : 'operator_vape',
      password: 'password123',
    });
  }

  /**
   * بررسی اینکه آیا یک فیلد نامعتبر است و توسط کاربر لمس (Touched) شده
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * سابمیت فرم ورود
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { username, password, role } = this.loginForm.getRawValue();

    /**
     * 💡 در Nuxt معمولاً می‌نوشتیم:
     *   try {
     *     const res = await login({ username, password });
     *   } catch (err) { ... }
     *
     * در Angular با متد `.subscribe()` به Observable گوش می‌دهیم:
     *   - next: زمان دریافت پاسخ موفق
     *   - error: زمان بروز خطا
     */
    this.authService
      .login({
        username: username!,
        password: password!,
        role: role || 'full-admin',
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err: Error) => {
          this.loading.set(false);
          this.errorMessage.set(err.message || 'خطا در احراز هویت ادمین');
        },
      });
  }

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }
}
