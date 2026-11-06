import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  AccountType,
  EntryType,
  order_status,
  PaymentStatus,
  ReservationStatus,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ZarinpalService } from './zarinpal.service';

export interface InitiatePaymentDto {
  orderNumber: string;
}

export interface VerifyPaymentDto {
  orderNumber: string;
  status?: string;
  refId?: string;
  authority?: string;
  gateway?: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly zarinpal: ZarinpalService,
  ) {}

  /**
   * 1. Initiate Online Payment with Zarinpal Sandbox
   */
  async requestPayment(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { number: orderNumber },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`سفارش شماره ${orderNumber} یافت نشد`);
    }

    if (order.status === order_status.paid) {
      throw new ConflictException('این سفارش قبلاً پرداخت و نهایی شده است.');
    }

    const storefrontUrl = process.env.STOREFRONT_URL || 'http://localhost:3001';
    const callbackUrl = `${storefrontUrl}/payment/callback?order=${order.number}`;

    const zarinpalRes = await this.zarinpal.requestPayment({
      amount: order.total,
      orderNumber: order.number,
      description: `خرید از فروشگاه ویپ‌لب - سفارش ${order.number}`,
      callbackUrl,
      mobile: order.phone || undefined,
      email: order.email,
    });

    const idempotencyKey = `pay_${order.id}_${Date.now()}`;
    await this.prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        idempotencyKey,
        gatewayProvider: 'ZARINPAL_SANDBOX',
        gatewayReference: zarinpalRes.authority || null,
        amount: order.total,
        currency: order.currency,
        status: PaymentStatus.INITIATED,
        metadata: {
          authority: zarinpalRes.authority,
          paymentUrl: zarinpalRes.paymentUrl,
        },
      },
    });

    return {
      ok: true,
      success: true,
      orderNumber: order.number,
      amount: order.total,
      authority: zarinpalRes.authority,
      paymentUrl: zarinpalRes.paymentUrl,
    };
  }

  /**
   * 2. Verify Payment (Called by callback.vue or gateway simulator)
   */
  async verifyPayment(dto: VerifyPaymentDto) {
    const { orderNumber, status, refId, authority, gateway } = dto;

    const order = await this.prisma.order.findUnique({
      where: { number: orderNumber },
      include: {
        items: true,
        reservation: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`سفارش شماره ${orderNumber} پیدا نشد.`);
    }

    // If order already paid, return successful idempotently
    if (order.status === order_status.paid) {
      return {
        ok: true,
        success: true,
        orderNumber: order.number,
        message: 'سفارش قبلاً پرداخت و تأیید شده است.',
        redirectUrl: `/order/${order.number}?status=success`,
      };
    }

    // If user cancelled on gateway or gateway indicated failure
    if (status === 'failed' || status === 'NOK') {
      this.logger.warn(`پرداخت سفارش ${orderNumber} توسط کاربر لغو شد یا ناموفق بود.`);
      return {
        ok: false,
        success: false,
        orderNumber: order.number,
        message: 'پرداخت انجام نشد یا توسط کاربر لغو گردید.',
        redirectUrl: `/order/${order.number}?status=failed`,
      };
    }

    const authCode = authority || refId;
    let verifiedRefId = refId || `REF_${Date.now()}`;

    // Verify with Zarinpal Sandbox if gateway is Zarinpal or authCode exists
    if (gateway !== 'shaparak_sim' && authCode) {
      const zarinVerify = await this.zarinpal.verifyPayment({
        amount: order.total,
        authority: authCode,
      });

      if (!zarinVerify.success) {
        return {
          ok: false,
          success: false,
          orderNumber: order.number,
          message: zarinVerify.message || 'اعتبارسنجی درگاه ناموفق بود',
          redirectUrl: `/order/${order.number}?status=failed`,
        };
      }

      if (zarinVerify.refId) {
        verifiedRefId = String(zarinVerify.refId);
      }
    }

    // Atomic Database Transaction for Order Completion
    return this.prisma.$transaction(async (tx) => {
      // 1. Record Successful Payment Transaction
      const idempotencyKey = `verify_${order.id}_${verifiedRefId}`;
      await tx.paymentTransaction.upsert({
        where: { idempotencyKey },
        create: {
          orderId: order.id,
          idempotencyKey,
          gatewayProvider: gateway === 'shaparak_sim' ? 'SHAPARAK_SIM' : 'ZARINPAL_SANDBOX',
          gatewayReference: verifiedRefId,
          amount: order.total,
          currency: order.currency,
          status: PaymentStatus.SUCCESSFUL,
          verifiedAt: new Date(),
          metadata: {
            authority: authCode,
            refId: verifiedRefId,
          },
        },
        update: {
          status: PaymentStatus.SUCCESSFUL,
          gatewayReference: verifiedRefId,
          verifiedAt: new Date(),
        },
      });

      // 2. Update Order status to PAID
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: order_status.paid,
        },
      });

      // 3. Commit reservation
      if (order.reservationId) {
        await tx.inventoryReservation.update({
          where: { id: order.reservationId },
          data: { status: ReservationStatus.COMMITTED },
        });
      }

      // 4. Atomically decrement physical stock from Variant and Product with Movement Log
      for (const item of order.items) {
        if (item.productId) {
          // Find target variant (either explicit variantId or first active variant)
          let targetVariant = item.variantId
            ? await tx.productVariant.findUnique({ where: { id: item.variantId } })
            : await tx.productVariant.findFirst({ where: { productId: item.productId, isActive: true } });

          if (targetVariant) {
            const stockBefore = targetVariant.stock;
            const stockAfter = Math.max(0, stockBefore - item.qty);
            const reservedAfter = Math.max(0, targetVariant.reservedQuantity - item.qty);

            await tx.productVariant.update({
              where: { id: targetVariant.id },
              data: {
                stock: stockAfter,
                reservedQuantity: reservedAfter,
              },
            });

            // Log inventory movement
            await tx.inventoryMovement.create({
              data: {
                variantId: targetVariant.id,
                productId: item.productId,
                type: 'SALE_DEDUCTION',
                delta: -item.qty,
                stockBefore,
                stockAfter,
                reason: `کسر قطعی موجودی پس از پرداخت موفق سفارش ${order.number}`,
                orderId: order.id,
                userId: order.userId || undefined,
              },
            });

            // Recalculate and sync total product stock
            const allVariants = await tx.productVariant.findMany({
              where: { productId: item.productId, isActive: true },
            });
            const totalStock = allVariants.reduce((sum, v) => sum + v.stock, 0);
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: totalStock },
            });
          } else {
            // Fallback for simple product without variants
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.qty,
                },
              },
            });
          }
        }
      }

      // 5. Append immutable TransactionJournal records (Double-Entry Accounting)
      // Debit: Asset Gateway
      await tx.transactionJournal.create({
        data: {
          orderId: order.id,
          accountType: AccountType.ASSET_GATEWAY,
          entryType: EntryType.DEBIT,
          amount: order.total,
          currency: order.currency,
          description: `واریز وجه سفارش ${order.number} به درگاه زرین‌پال`,
        },
      });

      // Credit: Platform Commission
      await tx.transactionJournal.create({
        data: {
          orderId: order.id,
          accountType: AccountType.REVENUE_COMMISSION,
          entryType: EntryType.CREDIT,
          amount: order.platformCommissionAmount,
          currency: order.currency,
          description: `کارمزد پلتفرم از سفارش ${order.number}`,
        },
      });

      // Credit: Supplier Payable
      await tx.transactionJournal.create({
        data: {
          orderId: order.id,
          accountType: AccountType.LIABILITY_SUPPLIER,
          entryType: EntryType.CREDIT,
          amount: order.supplierPayableAmount,
          currency: order.currency,
          description: `بدهی تسویه به تأمین‌کننده برای سفارش ${order.number}`,
        },
      });

      this.logger.log(
        `سفارش ${order.number} با تراکنش ${verifiedRefId} با موفقیت تسویه و موجودی انبار قطعی شد.`,
      );

      return {
        ok: true,
        success: true,
        orderNumber: order.number,
        refId: verifiedRefId,
        message: 'پرداخت با موفقیت تأیید شد.',
        redirectUrl: `/order/${order.number}?status=success&refId=${verifiedRefId}`,
      };
    });
  }
}

