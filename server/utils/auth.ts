import crypto from "node:crypto";
import type { AuthUser } from "~/types";

export interface StoredUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  passwordSalt: string;
  isAdmin: boolean;
  createdAt: string;
}

// حافظه موقت برای زمانی که دیتابیس خارجی وصل نیست تا سیستم لاگین همیشه زنده باشد
const memoryUsers = new Map<string, StoredUser>();

export function hashPassword(password: string, existingSalt?: string) {
  const salt = existingSalt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: calculated } = hashPassword(password, salt);
  return calculated === hash;
}

export function generateToken(user: { id: number; username: string }): string {
  const payload = Buffer.from(JSON.stringify({ id: user.id, username: user.username, t: Date.now() })).toString("base64");
  const sig = crypto.createHmac("sha256", "vapora-secret-key-2026").update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function parseToken(token: string): { id: number; username: string } | null {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    const expectedSig = crypto.createHmac("sha256", "vapora-secret-key-2026").update(payload).digest("hex");
    if (sig !== expectedSig) return null;
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    return decoded;
  } catch {
    return null;
  }
}

export function registerMemoryUser(userData: {
  name: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
}): { user: AuthUser; token: string } {
  const normalizedUsername = userData.username.trim().toLowerCase();
  const normalizedEmail = userData.email.trim().toLowerCase();

  for (const u of memoryUsers.values()) {
    if (u.username.toLowerCase() === normalizedUsername) {
      throw new Error("این نام کاربری قبلاً ثبت شده است");
    }
    if (u.email.toLowerCase() === normalizedEmail) {
      throw new Error("این ایمیل قبلاً ثبت شده است");
    }
  }

  const { hash, salt } = hashPassword(userData.password);
  const id = memoryUsers.size + 101;
  const stored: StoredUser = {
    id,
    name: userData.name.trim(),
    username: normalizedUsername,
    email: normalizedEmail,
    phone: userData.phone?.trim() || null,
    passwordHash: hash,
    passwordSalt: salt,
    isAdmin: false,
    createdAt: new Date().toISOString(),
  };

  memoryUsers.set(normalizedUsername, stored);
  memoryUsers.set(normalizedEmail, stored);

  const authUser: AuthUser = {
    id: stored.id,
    name: stored.name,
    username: stored.username,
    email: stored.email,
    phone: stored.phone,
    isAdmin: stored.isAdmin,
    createdAt: stored.createdAt,
  };

  const token = generateToken(stored);
  return { user: authUser, token };
}

export function loginMemoryUser(credentials: {
  username: string;
  password: string;
}): { user: AuthUser; token: string } {
  const key = credentials.username.trim().toLowerCase();
  const stored = memoryUsers.get(key);

  if (!stored) {
    throw new Error("کاربری با این مشخصات یافت نشد");
  }

  const isValid = verifyPassword(credentials.password, stored.passwordHash, stored.passwordSalt);
  if (!isValid) {
    throw new Error("رمز عبور وارد شده نادرست است");
  }

  const authUser: AuthUser = {
    id: stored.id,
    name: stored.name,
    username: stored.username,
    email: stored.email,
    phone: stored.phone,
    isAdmin: stored.isAdmin,
    createdAt: stored.createdAt,
  };

  const token = generateToken(stored);
  return { user: authUser, token };
}
