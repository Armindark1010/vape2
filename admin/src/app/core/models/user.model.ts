/* ==========================================================================
   📌 مدل‌های کاربر و احراز هویت (User & Auth Interfaces - user.model.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt/Vue این فایل دقیقاً معادل `types/index.ts` یا `types/auth.d.ts` است.
   در TypeScript برای تضمین Type-Safety در کل پروژه از Interface یا Type استفاده می‌کنیم.
   ========================================================================== */

export type UserRole = 'full-admin' | 'operator';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}
