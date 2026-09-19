import { db } from "../db";
import { products } from "../db/schema";
import { inArray, eq } from "drizzle-orm";
import { FALLBACK_PRODUCTS } from "../db/fallbackData";

export interface ReservationItem {
  productId: number;
  qty: number;
}

export interface Reservation {
  id: string;
  items: ReservationItem[];
  createdAt: number;
  expiresAt: number;
}

// In-memory hold storage
const activeReservations = new Map<string, Reservation>();

/**
 * Clean up expired holds
 */
export function cleanupExpiredReservations() {
  const now = Date.now();
  for (const [id, res] of activeReservations.entries()) {
    if (res.expiresAt <= now) {
      activeReservations.delete(id);
    }
  }
}

/**
 * Calculate total quantity of product currently reserved by active holds
 */
export function getReservedQty(productId: number, excludeReservationId?: string): number {
  cleanupExpiredReservations();
  let total = 0;
  for (const [id, res] of activeReservations.entries()) {
    if (excludeReservationId && id === excludeReservationId) continue;
    for (const item of res.items) {
      if (item.productId === productId) {
        total += item.qty;
      }
    }
  }
  return total;
}

/**
 * Get available stock after subtracting active holds
 */
export async function getEffectiveStock(productId: number, excludeReservationId?: string): Promise<{ actualStock: number; reservedStock: number; availableStock: number; name?: string }> {
  let actualStock = 0;
  let name = "";

  if (db) {
    try {
      const rows = await db.select({ id: products.id, stock: products.stock, name: products.name }).from(products).where(eq(products.id, productId)).limit(1);
      if (rows[0]) {
        actualStock = rows[0].stock;
        name = rows[0].name;
      }
    } catch {
      // fallback
    }
  }

  if (!name) {
    const p = FALLBACK_PRODUCTS.find((p) => p.id === productId);
    if (p) {
      actualStock = p.stock;
      name = p.name;
    }
  }

  const reservedStock = getReservedQty(productId, excludeReservationId);
  const availableStock = Math.max(0, actualStock - reservedStock);

  return { actualStock, reservedStock, availableStock, name };
}

/**
 * Create or extend a 15-minute stock hold
 */
export async function createOrRenewReservation(
  items: ReservationItem[],
  existingReservationId?: string,
  holdMinutes: number = 15
): Promise<{
  ok: boolean;
  reservationId?: string;
  expiresAt?: string;
  remainingSeconds?: number;
  conflictItem?: { productId: number; name: string; available: number; requested: number };
  error?: string;
}> {
  cleanupExpiredReservations();

  if (!items || items.length === 0) {
    return { ok: false, error: "سبد خرید خالی است." };
  }

  // Validate stock for all items
  for (const it of items) {
    const qty = Math.max(1, Math.min(99, Number(it.qty) || 1));
    const stockInfo = await getEffectiveStock(it.productId, existingReservationId);

    if (stockInfo.availableStock < qty) {
      return {
        ok: false,
        error: `موجودی کالای "${stockInfo.name || it.productId}" برای رزرو کافی نیست.`,
        conflictItem: {
          productId: it.productId,
          name: stockInfo.name || String(it.productId),
          available: stockInfo.availableStock,
          requested: qty,
        },
      };
    }
  }

  // Generate or reuse reservation ID
  const reservationId = existingReservationId && activeReservations.has(existingReservationId)
    ? existingReservationId
    : `res_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;

  const now = Date.now();
  const expiresAtMs = now + holdMinutes * 60 * 1000;

  activeReservations.set(reservationId, {
    id: reservationId,
    items: items.map((i) => ({ productId: Number(i.productId), qty: Number(i.qty) })),
    createdAt: now,
    expiresAt: expiresAtMs,
  });

  return {
    ok: true,
    reservationId,
    expiresAt: new Date(expiresAtMs).toISOString(),
    remainingSeconds: holdMinutes * 60,
  };
}

/**
 * Release an active hold (e.g. user leaves checkout or cancels)
 */
export function releaseReservation(reservationId: string): boolean {
  return activeReservations.delete(reservationId);
}

/**
 * Commit reservation (called when order is placed, so hold is released and permanent DB reduction applies)
 */
export function commitReservation(reservationId: string): boolean {
  return activeReservations.delete(reservationId);
}

/**
 * Get active reservation status
 */
export function getReservationStatus(reservationId: string): { active: boolean; remainingSeconds: number; expiresAt?: string } {
  cleanupExpiredReservations();
  const res = activeReservations.get(reservationId);
  if (!res) {
    return { active: false, remainingSeconds: 0 };
  }
  const remaining = Math.max(0, Math.floor((res.expiresAt - Date.now()) / 1000));
  if (remaining === 0) {
    activeReservations.delete(reservationId);
    return { active: false, remainingSeconds: 0 };
  }
  return {
    active: true,
    remainingSeconds: remaining,
    expiresAt: new Date(res.expiresAt).toISOString(),
  };
}
