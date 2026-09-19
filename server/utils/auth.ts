import crypto from "node:crypto";
import type { AuthUser } from "~/types";

export interface StoredUser {
  id: string | number;
  fullName: string | null;
  name: string;
  username: string | null;
  phoneNumber: string | null;
  email: string | null;
  phone?: string | null;
  passwordHash: string;
  passwordSalt: string;
  role: string;
  isAdmin: boolean;
  createdAt: string;
}

interface StoredOtp {
  phoneNumber: string;
  code: string;
  expiresAt: number;
}

// In-memory user store for instant standalone operation
const memoryUsers = new Map<string, StoredUser>();
const memoryOtps = new Map<string, StoredOtp>();

export function hashPassword(password: string, existingSalt?: string) {
  const salt = existingSalt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: calculated } = hashPassword(password, salt);
  return calculated === hash;
}

export function generateToken(user: { id: string | number; username?: string | null; phoneNumber?: string | null }): string {
  const identifier = user.phoneNumber || user.username || String(user.id);
  const payload = Buffer.from(
    JSON.stringify({ id: user.id, identifier, t: Date.now() })
  ).toString("base64");
  const sig = crypto.createHmac("sha256", "vapelab-secret-key-2026").update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function parseToken(token: string): { id: string | number; identifier: string } | null {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    const expectedSig = crypto.createHmac("sha256", "vapelab-secret-key-2026").update(payload).digest("hex");
    if (sig !== expectedSig) return null;
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    return decoded;
  } catch {
    return null;
  }
}

function isIranianMobile(val: string): boolean {
  const clean = val.replace(/\s+/g, "");
  return /^(\+98|0098|98|0)?9\d{9}$/.test(clean);
}

function formatPhoneNumber(phone: string): string {
  let clean = phone.trim().replace(/\s+/g, "");
  if (clean.startsWith("+98")) clean = "0" + clean.slice(3);
  else if (clean.startsWith("0098")) clean = "0" + clean.slice(4);
  else if (clean.startsWith("98")) clean = "0" + clean.slice(2);
  else if (!clean.startsWith("0") && clean.length === 10) clean = "0" + clean;
  return clean;
}

/**
 * Send OTP (Memory & Fallback)
 */
export function sendMemoryOtp(phoneNumber: string): { success: boolean; message: string; phoneNumber: string; debugCode?: string } {
  const clean = formatPhoneNumber(phoneNumber);
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  const expiresAt = Date.now() + 2 * 60 * 1000;

  memoryOtps.set(clean, { phoneNumber: clean, code, expiresAt });

  return {
    success: true,
    message: "کد تأیید با موفقیت ارسال شد",
    phoneNumber: clean,
    debugCode: code,
  };
}

/**
 * Verify OTP (Memory & Fallback with 11111 bypass)
 */
export function verifyMemoryOtp(dto: { phoneNumber: string; code: string }): { accessToken: string; user: AuthUser } {
  const clean = formatPhoneNumber(dto.phoneNumber);
  const isTest = dto.code === "11111";

  if (!isTest) {
    const record = memoryOtps.get(clean);
    if (!record || record.code !== dto.code || Date.now() > record.expiresAt) {
      throw new Error("کد تأیید نامعتبر یا منقضی شده است");
    }
    memoryOtps.delete(clean);
  }

  let user = memoryUsers.get(clean);
  if (!user) {
    const id = "usr_" + (memoryUsers.size + 101);
    const { hash, salt } = hashPassword("auto_otp_default_pass");
    user = {
      id,
      fullName: null,
      name: "کاربر " + clean.slice(-4),
      username: null,
      phoneNumber: clean,
      email: null,
      phone: clean,
      passwordHash: hash,
      passwordSalt: salt,
      role: "CUSTOMER",
      isAdmin: false,
      createdAt: new Date().toISOString(),
    };
    memoryUsers.set(clean, user);
  }

  const authUser: AuthUser = {
    id: user.id,
    fullName: user.fullName,
    name: user.name,
    username: user.username,
    phoneNumber: user.phoneNumber,
    phone: user.phone,
    role: user.role,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };

  const accessToken = generateToken(user);
  return { accessToken, user: authUser };
}

/**
 * Register with Username/Mobile and Password (Memory & Fallback)
 */
export function registerMemoryUser(userData: {
  usernameOrMobile: string;
  password: string;
  fullName?: string;
}): { accessToken: string; user: AuthUser } {
  const identifier = userData.usernameOrMobile.trim();
  const isMobile = isIranianMobile(identifier);
  const cleanPhone = isMobile ? formatPhoneNumber(identifier) : null;
  const username = !isMobile ? identifier.toLowerCase() : null;
  const lookupKey = cleanPhone || username!;

  if (memoryUsers.has(lookupKey)) {
    throw new Error("این نام کاربری یا شماره موبایل قبلاً ثبت شده است");
  }

  const { hash, salt } = hashPassword(userData.password);
  const id = "usr_" + (memoryUsers.size + 101);
  const name = userData.fullName?.trim() || identifier;

  const stored: StoredUser = {
    id,
    fullName: userData.fullName?.trim() || null,
    name,
    username,
    phoneNumber: cleanPhone,
    phone: cleanPhone,
    email: null,
    passwordHash: hash,
    passwordSalt: salt,
    role: "CUSTOMER",
    isAdmin: false,
    createdAt: new Date().toISOString(),
  };

  memoryUsers.set(lookupKey, stored);
  if (cleanPhone && username) {
    memoryUsers.set(username, stored);
  }

  const authUser: AuthUser = {
    id: stored.id,
    fullName: stored.fullName,
    name: stored.name,
    username: stored.username,
    phoneNumber: stored.phoneNumber,
    phone: stored.phone,
    role: stored.role,
    isAdmin: stored.isAdmin,
    createdAt: stored.createdAt,
  };

  const accessToken = generateToken(stored);
  return { accessToken, user: authUser };
}

/**
 * Login with Password (Memory & Fallback)
 */
export function loginMemoryUser(credentials: {
  usernameOrMobile: string;
  password: string;
}): { accessToken: string; user: AuthUser } {
  const identifier = credentials.usernameOrMobile.trim();
  const isMobile = isIranianMobile(identifier);
  const cleanPhone = isMobile ? formatPhoneNumber(identifier) : null;
  const username = !isMobile ? identifier.toLowerCase() : null;
  const lookupKey = cleanPhone || username || identifier.toLowerCase();

  const stored = memoryUsers.get(lookupKey);

  if (!stored) {
    throw new Error("کاربری با این مشخصات یافت نشد");
  }

  const isValid = verifyPassword(credentials.password, stored.passwordHash, stored.passwordSalt);
  if (!isValid) {
    throw new Error("رمز عبور وارد شده نادرست است");
  }

  const authUser: AuthUser = {
    id: stored.id,
    fullName: stored.fullName,
    name: stored.name,
    username: stored.username,
    phoneNumber: stored.phoneNumber,
    phone: stored.phone,
    role: stored.role,
    isAdmin: stored.isAdmin,
    createdAt: stored.createdAt,
  };

  const accessToken = generateToken(stored);
  return { accessToken, user: authUser };
}
