/* ==========================================================================
   📌 سرویس احراز هویت و مدیریت دسترسی (AuthService - auth.service.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این کار را با یک Composable سراسری مثل `useAuth()` یا Store پینیا
   انجام می‌دادیم:
     const user = ref(null);
     const isLoggedIn = computed(() => !!user.value);
   
   در Angular:
   1. از دکوراتور `@Injectable({ providedIn: 'root' })` استفاده می‌کنیم. این یعنی
      انگولار خودش به صورت خودکار (Dependency Injection) یک نسخه یکتا (Singleton)
      از این سرویس می‌سازد و در هر کامپوننت یا گاردی که بخواهیم تزریق (Inject) می‌کند.
   2. از **Signals** (`signal`, `computed`) استفاده می‌کنیم که جدیدترین و سریع‌ترین
      مکانیزم ری‌اکتیویتی انگولار است و دقیقاً مثل `ref` و `computed` در Vue کار می‌کند!
   ========================================================================== */

import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root', // این سرویس در سطح کل برنامه به عنوان Singleton در دسترس است
})
export class AuthService {
  private readonly TOKEN_KEY = 'vapora_admin_token';
  private readonly USER_KEY = 'vapora_admin_user';

  // 🔹 سیگنال‌های واکنشی (دقیقاً معادل ref و computed در Vue 3)
  private currentUserSignal = signal<User | null>(this.getStoredUser());
  
  // دسترسی فقط‌خواندنی به کاربر جاری
  readonly currentUser = this.currentUserSignal.asReadonly();
  
  // معادل computed در Vue: آیا کاربر لاگین است؟
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  // معادل computed در Vue: آیا نقش مدیر کل دارد؟
  readonly isFullAdmin = computed(() => this.currentUserSignal()?.role === 'full-admin');

  // معادل computed در Vue: آیا نقش اپراتور فروش دارد؟
  readonly isOperator = computed(() => this.currentUserSignal()?.role === 'operator');

  constructor(private router: Router) {}

  /**
   * لاگین ادمین با پشتیبانی از نقش‌ها
   * 
   * 💡 چرا Observable به جای Promise؟
   * در Nuxt معمولاً تابع async می‌نوشتیم و Promise برمی‌گرداندیم:
   *   const res = await $fetch('/api/login');
   * در Angular، استاندارد معماری بازگرداندن Observable است؛ چون Observableها
   * قابلیت Cancel کردن، Retry خودکار، مدیریت خطای پیشرفته با RxJS و Stream بودن دارند.
   */
  login(credentials: { username: string; password: string; role?: UserRole }): Observable<AuthResponse> {
    const { username, password, role } = credentials;

    // بررسی اولیه اعتبارسنجی
    if (!username || !password) {
      return throwError(() => new Error('لطفاً نام کاربری و رمز عبور را وارد کنید.'));
    }

    if (password.length < 4) {
      return throwError(() => new Error('رمز عبور باید حداقل ۴ رقم باشد.'));
    }

    // شبیه‌سازی ریکوئست شبکه به سرور با تاخیر ۶۰۰ میلی‌ثانیه‌ای (Mock API Endpoint)
    const selectedRole: UserRole = role || (username.toLowerCase().includes('admin') ? 'full-admin' : 'operator');

    const mockUser: User = {
      id: selectedRole === 'full-admin' ? 1 : 2,
      username: username.trim(),
      name: selectedRole === 'full-admin' ? 'مدیر ارشد فروشگاه' : 'اپراتور شیفت سفارشات',
      email: `${username.trim().toLowerCase()}@vapora.ir`,
      role: selectedRole,
      avatarUrl: selectedRole === 'full-admin' ? '👑' : '👨‍💼',
      lastLogin: new Date().toISOString(),
    };

    const mockResponse: AuthResponse = {
      user: mockUser,
      token: `fake-jwt-token-vapora-${mockUser.id}-${Date.now()}`,
      expiresIn: 3600 * 24, // 24 ساعت
    };

    return of(mockResponse).pipe(
      delay(600), // شبیه‌سازی زمان پاسخ سرور
      tap((res) => {
        // عمل ثانویه (Side Effect): ذخیره توکن و کاربر در localStorage و بروزرسانی سیگنال
        this.setSession(res);
      })
    );
  }

  /**
   * خروج از حساب کاربری
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSignal.set(null); // معادل user.value = null در Vue
    this.router.navigate(['/auth/login']);
  }

  /**
   * دریافت توکن ذخیره‌شده برای Interceptor
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * بررسی داشتن دسترسی مشخص
   */
  hasRole(requiredRole: UserRole): boolean {
    const user = this.currentUserSignal();
    if (!user) return false;
    if (user.role === 'full-admin') return true; // ادمین ارشد به همه جا دسترسی دارد
    return user.role === requiredRole;
  }

  private setSession(auth: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, auth.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(auth.user));
    }
    this.currentUserSignal.set(auth.user);
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
