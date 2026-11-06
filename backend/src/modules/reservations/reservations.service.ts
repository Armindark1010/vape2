import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma.service';

export interface ReserveItemInput {
  productId: number;
  variantId?: number;
  quantity: number;
}

@Injectable()
export class ReservationsService {
  private readonly HOLD_DURATION_MINUTES = 10;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. Create or extend a 10-minute persistent inventory reservation
   * Atomically verifies that: actualStock - sum(active reservations) >= requested
   */
  async createReservation(userId: number | undefined, items: ReserveItemInput[], existingToken?: string) {
    if (!items || items.length === 0) {
      throw new BadRequestException('Items array cannot be empty');
    }

    const now = new Date();

    // Auto-release any expired reservations in DB first
    await this.releaseExpiredReservations();

    const expiresAt = new Date(now.getTime() + this.HOLD_DURATION_MINUTES * 60 * 1000);
    const token = existingToken || `res_${randomUUID().replace(/-/g, '')}`;

    return this.prisma.$transaction(async (tx) => {
      // If extending an existing reservation by token, release previous items
      if (existingToken) {
        const existing = await tx.inventoryReservation.findUnique({
          where: { token: existingToken },
          include: { items: true },
        });

        if (existing && existing.status === ReservationStatus.ACTIVE) {
          await tx.reservationItem.deleteMany({
            where: { reservationId: existing.id },
          });
        }
      }

      const resolvedItems: { productId: number; variantId: number | null; quantity: number }[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: { where: { isActive: true } } },
        });

        if (!product) {
          throw new NotFoundException(`محصول با شناسه ${item.productId} یافت نشد`);
        }

        // Determine variant
        let targetVariant = item.variantId
          ? await tx.productVariant.findUnique({ where: { id: item.variantId } })
          : (product.variants[0] || null);

        const stockToTest = targetVariant ? targetVariant.stock : product.stock;

        // Calculate active holds for this variant or product
        const activeHolds = await tx.reservationItem.aggregate({
          where: {
            productId: item.productId,
            ...(targetVariant ? { variantId: targetVariant.id } : {}),
            reservation: {
              status: ReservationStatus.ACTIVE,
              expiresAt: { gt: now },
              ...(existingToken ? { token: { not: existingToken } } : {}),
            },
          },
          _sum: { quantity: true },
        });

        const reservedQty = activeHolds._sum.quantity || 0;
        const availableStock = Math.max(0, stockToTest - reservedQty);

        if (availableStock < item.quantity) {
          const varTitle = targetVariant?.title ? ` (تنوع: ${targetVariant.title})` : '';
          throw new ConflictException({
            statusCode: 409,
            message: `موجودی قابل رزرو محصول '${product.name}'${varTitle} کافی نیست. موجودی آزاد: ${availableStock} عدد، درخواستی: ${item.quantity} عدد`,
            product: {
              id: product.id,
              variantId: targetVariant?.id,
              name: product.name,
              available: availableStock,
              requested: item.quantity,
            },
          });
        }

        resolvedItems.push({
          productId: item.productId,
          variantId: targetVariant?.id || null,
          quantity: item.quantity,
        });

        // Atomically update variant reservedQuantity
        if (targetVariant) {
          await tx.productVariant.update({
            where: { id: targetVariant.id },
            data: { reservedQuantity: { increment: item.quantity } },
          });
        }
      }

      // Upsert reservation
      const reservation = await tx.inventoryReservation.upsert({
        where: { token },
        create: {
          userId,
          token,
          status: ReservationStatus.ACTIVE,
          expiresAt,
          items: {
            create: resolvedItems.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              quantity: i.quantity,
            })),
          },
        },
        update: {
          status: ReservationStatus.ACTIVE,
          expiresAt,
          items: {
            create: resolvedItems.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              quantity: i.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return {
        ok: true,
        success: true,
        reservationToken: reservation.token,
        reservationId: reservation.token,
        expiresAt: reservation.expiresAt.toISOString(),
        remainingSeconds: this.HOLD_DURATION_MINUTES * 60,
      };
    });
  }

  /**
   * 2. Release active reservation
   */
  async releaseReservation(token: string) {
    const reservation = await this.prisma.inventoryReservation.findUnique({
      where: { token },
    });

    if (!reservation) {
      return { success: true, message: 'Reservation not found or already released' };
    }

    if (reservation.status === ReservationStatus.ACTIVE) {
      await this.prisma.inventoryReservation.update({
        where: { token },
        data: { status: ReservationStatus.RELEASED },
      });
    }

    return { success: true, message: 'Reservation released successfully' };
  }

  /**
   * 3. Get reservation status
   */
  async getReservationStatus(token: string) {
    const reservation = await this.prisma.inventoryReservation.findUnique({
      where: { token },
    });

    if (!reservation || reservation.status !== ReservationStatus.ACTIVE) {
      return { active: false, remainingSeconds: 0 };
    }

    const remainingMs = reservation.expiresAt.getTime() - Date.now();
    if (remainingMs <= 0) {
      await this.prisma.inventoryReservation.update({
        where: { id: reservation.id },
        data: { status: ReservationStatus.EXPIRED },
      });
      return { active: false, remainingSeconds: 0 };
    }

    return {
      active: true,
      remainingSeconds: Math.floor(remainingMs / 1000),
      expiresAt: reservation.expiresAt.toISOString(),
    };
  }

  /**
   * 4. Helper to mark all expired ACTIVE reservations as EXPIRED
   */
  async releaseExpiredReservations() {
    await this.prisma.inventoryReservation.updateMany({
      where: {
        status: ReservationStatus.ACTIVE,
        expiresAt: { lte: new Date() },
      },
      data: {
        status: ReservationStatus.EXPIRED,
      },
    });
  }
}
