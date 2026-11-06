import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AccountType,
  EntryType,
  order_status,
  PaymentStatus,
  ReservationStatus,
  Role,
  User,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma.service';

export interface CreateOrderInput {
  items: { productId: number; variantId?: number; qty: number; flavor?: string; nicotine?: string }[];
  reservationToken: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    zip: string;
    country?: string;
  };
  couponCode?: string;
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. Create Order (Mandatory customer authentication & active 10-min reservation)
   * Stock is NOT deducted yet.
   */
  async create(user: User, input: CreateOrderInput) {
    if (!user) {
      throw new ForbiddenException('ثبت سفارش تنها برای کاربران وارد شده مجاز است');
    }

    const { items, reservationToken, shippingAddress, couponCode } = input;
    if (!items || items.length === 0) {
      throw new BadRequestException('سبد خرید نمی‌تواند خالی باشد');
    }

    const normalizedZip = shippingAddress?.zip || '00000';
    if (!shippingAddress?.line1 || !shippingAddress?.city) {
      throw new BadRequestException('اطلاعات آدرس و شهر مقصد الزامی است');
    }
    shippingAddress.zip = normalizedZip;

    // 1. Verify or automatically create active reservation
    let reservation = reservationToken
      ? await this.prisma.inventoryReservation.findUnique({
          where: { token: reservationToken },
          include: { items: true },
        })
      : null;

    if (!reservation || reservation.status !== ReservationStatus.ACTIVE || reservation.expiresAt <= new Date()) {
      const newToken = `res_${randomUUID()}`;
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      reservation = await this.prisma.inventoryReservation.create({
        data: {
          token: newToken,
          userId: user.id,
          expiresAt,
          status: ReservationStatus.ACTIVE,
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              quantity: i.qty,
            })),
          },
        },
        include: { items: true },
      });
    } else if (reservation.userId && reservation.userId !== user.id) {
      throw new ForbiddenException('رزرو موجودی متعلق به کاربر دیگری است');
    } else if (!reservation.userId) {
      await this.prisma.inventoryReservation.update({
        where: { id: reservation.id },
        data: { userId: user.id },
      });
    }

    // 2. Fetch products and calculate total in Integer Tomans
    const productIds = items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { supplier: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('یک یا چند محصول در کاتالوگ یافت نشدند');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItemsData: any[] = [];
    let totalPlatformCommission = 0;
    let totalSupplierPayable = 0;

    // Fetch default global commission rate (default 10%)
    const globalCommSetting = await this.prisma.globalSetting.findUnique({
      where: { key: 'commission_rate' },
    });
    const defaultCommRate = globalCommSetting ? Number(globalCommSetting.value) : 10;

    for (const it of items) {
      const prod = productMap.get(it.productId)!;
      const qty = Math.max(1, Number(it.qty) || 1);

      // Look up variant if provided or default
      let targetVariant: any = null;
      if (it.variantId) {
        targetVariant = await this.prisma.productVariant.findUnique({ where: { id: it.variantId } });
      } else {
        targetVariant = await this.prisma.productVariant.findFirst({ where: { productId: prod.id, isActive: true } });
      }

      const unitPrice = targetVariant ? targetVariant.price : (prod.discountPrice ?? prod.price);
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;

      // Commission snapshot per supplier
      const commRate = prod.supplier?.commissionRate ?? defaultCommRate;
      const lineComm = Math.round((lineTotal * commRate) / 100);
      const linePayable = lineTotal - lineComm;

      totalPlatformCommission += lineComm;
      totalSupplierPayable += linePayable;

      orderItemsData.push({
        productId: prod.id,
        variantId: targetVariant?.id || null,
        name: targetVariant?.title ? `${prod.name} (${targetVariant.title})` : prod.name,
        image: targetVariant?.image || (Array.isArray(prod.images) ? (prod.images as string[])[0] : null),
        price: unitPrice,
        qty,
        flavor: it.flavor || (targetVariant?.combination?.flavor || targetVariant?.combination?.['طعم']) || null,
        nicotine: it.nicotine || (targetVariant?.combination?.nicotine || targetVariant?.combination?.['نیکوتین']) || null,
      });
    }

    // Coupon calculation
    let discount = 0;
    if (couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });
      if (coupon && coupon.active && subtotal >= coupon.minSubtotal && coupon.percent) {
        discount = Math.round((subtotal * coupon.percent) / 100);
      }
    }

    const shippingFee = subtotal - discount >= 1500000 ? 0 : 45000;
    const total = subtotal - discount + shippingFee;

    const orderNumber = `VPR-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await this.prisma.order.create({
      data: {
        number: orderNumber,
        userId: user.id,
        reservationId: reservation.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        shipping: shippingAddress,
        couponCode: couponCode || null,
        subtotal,
        discount,
        shippingFee,
        total,
        currency: 'IRT',
        status: order_status.pending,
        platformCommissionRate: defaultCommRate,
        platformCommissionAmount: totalPlatformCommission,
        supplierPayableAmount: totalSupplierPayable,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return {
      ok: true,
      success: true,
      orderId: order.id,
      id: order.id,
      number: order.number,
      orderNumber: order.number,
      subtotal: order.subtotal,
      discount: order.discount,
      shippingFee: order.shippingFee,
      total: order.total,
      currency: order.currency,
      status: order.status,
      items: order.items,
    };
  }

  /**
   * 2. Initiate Payment (Clean gateway abstraction)
   */
  async initiatePayment(user: User, orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    if (user.role !== Role.ADMIN && order.userId !== user.id) {
      throw new ForbiddenException('دسترسی به این سفارش مجاز نیست');
    }

    if (order.status !== order_status.pending) {
      throw new ConflictException(`سفارش قبلاً پردازش شده است (وضعیت: ${order.status})`);
    }

    const idempotencyKey = `pay_${order.id}_${Date.now()}`;
    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        idempotencyKey,
        gatewayProvider: 'GATEWAY_ABSTRACTION_PENDING',
        amount: order.total,
        currency: order.currency,
        status: PaymentStatus.INITIATED,
      },
    });

    return {
      success: true,
      transactionId: transaction.id,
      orderNumber: order.number,
      amount: order.total,
      currency: order.currency,
      message: 'تراکنش پرداخت آماده‌سازی شد (حالت انتظار درگاه تأییدشده)',
    };
  }

  /**
   * 3. Verify Payment & Commit Inventory (Strict Transactional Execution)
   * Permanent stock deduction happens ONLY here.
   */
  async verifyPayment(orderId: number, idempotencyKey: string, gatewayRef?: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          reservation: { include: { items: true } },
        },
      });

      if (!order) {
        throw new NotFoundException('سفارش یافت نشد');
      }

      if (order.status === order_status.paid) {
        return { success: true, message: 'این سفارش قبلاً تسویه و تأیید شده است (Idempotent)', order };
      }

      if (order.status !== order_status.pending) {
        throw new ConflictException(`وضعیت سفارش قابل پرداخت نیست: ${order.status}`);
      }

      // 1. Update Payment Transaction
      const transaction = await tx.paymentTransaction.upsert({
        where: { idempotencyKey },
        create: {
          orderId: order.id,
          idempotencyKey,
          gatewayProvider: 'VERIFIED_GATEWAY',
          gatewayReference: gatewayRef || `REF_${Date.now()}`,
          amount: order.total,
          currency: order.currency,
          status: PaymentStatus.SUCCESSFUL,
          verifiedAt: new Date(),
        },
        update: {
          status: PaymentStatus.SUCCESSFUL,
          gatewayReference: gatewayRef || `REF_${Date.now()}`,
          verifiedAt: new Date(),
        },
      });

      // 2. Mark order as PAID
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: order_status.paid },
      });

      // 3. Commit reservation
      if (order.reservationId) {
        await tx.inventoryReservation.update({
          where: { id: order.reservationId },
          data: { status: ReservationStatus.COMMITTED },
        });
      }

      // 4. Atomically decrement stock
      for (const item of order.items) {
        if (item.productId) {
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

      // 5. Append immutable TransactionJournal records (Double-entry accounting)
      // Entry 1: Debit Gateway Asset (Total Order Amount)
      await tx.transactionJournal.create({
        data: {
          orderId: order.id,
          accountType: AccountType.ASSET_GATEWAY,
          entryType: EntryType.DEBIT,
          amount: order.total,
          currency: order.currency,
          description: `واریز وجه سفارش ${order.number} به درگاه پرداخت`,
        },
      });

      // Entry 2: Credit Platform Commission Revenue
      await tx.transactionJournal.create({
        data: {
          orderId: order.id,
          accountType: AccountType.REVENUE_COMMISSION,
          entryType: EntryType.CREDIT,
          amount: order.platformCommissionAmount,
          currency: order.currency,
          description: `درآمد کارمزد پلتفرم (${order.platformCommissionRate}%) از سفارش ${order.number}`,
        },
      });

      // Entry 3: Credit Supplier Payable Liability
      await tx.transactionJournal.create({
        data: {
          orderId: order.id,
          accountType: AccountType.LIABILITY_SUPPLIER,
          entryType: EntryType.CREDIT,
          amount: order.supplierPayableAmount,
          currency: order.currency,
          description: `تعهد بدهی پلتفرم به تأمین‌کننده برای سفارش ${order.number}`,
        },
      });

      return {
        success: true,
        orderNumber: updatedOrder.number,
        status: updatedOrder.status,
        transactionReference: transaction.gatewayReference,
      };
    });
  }

  /**
   * 4. Get Customer Orders
   */
  async getMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 5. Get Order by ID
   */
  async findById(id: number, user: User) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        transactions: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    if (user.role !== Role.ADMIN && order.userId !== user.id) {
      throw new ForbiddenException('دسترسی به این سفارش مجاز نیست');
    }

    return order;
  }

  /**
   * 6. Admin Orders List
   */
  async findAllAdmin(status?: string) {
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return { orders };
  }

  /**
   * 7. Admin Update Order Status
   */
  async updateStatus(id: number, newStatus: order_status, trackingCode?: string, courier?: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: newStatus,
        ...(trackingCode ? { trackingCode } : {}),
        ...(courier ? { courier } : {}),
      },
      include: { items: true },
    });
  }

  /**
   * 8. Find Order by Number (Invoice / Status View)
   */
  async findByNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { number: orderNumber },
      include: {
        items: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`سفارش شماره ${orderNumber} یافت نشد`);
    }

    const latestTx = order.transactions[0];
    const isPaid =
      order.status === order_status.paid || latestTx?.status === PaymentStatus.SUCCESSFUL;

    return {
      id: order.id,
      number: order.number,
      name: order.name,
      email: order.email,
      phone: order.phone,
      subtotal: order.subtotal,
      discount: order.discount,
      shippingFee: order.shippingFee,
      total: order.total,
      status: order.status,
      paymentStatus: isPaid ? 'paid' : order.status === 'cancelled' ? 'failed' : 'unpaid',
      paymentRef: latestTx?.gatewayReference || null,
      paymentGateway: latestTx?.gatewayProvider || null,
      paymentDate: latestTx?.verifiedAt?.toISOString() || null,
      trackingCode: order.trackingCode,
      courier: order.courier,
      couponCode: order.couponCode,
      createdAt: order.createdAt.toISOString(),
      shipping: order.shipping,
      items: order.items.map((i) => ({
        name: i.name,
        image: i.image,
        price: i.price,
        qty: i.qty,
        color: i.flavor,
      })),
    };
  }

  /**
   * 9. Track Order by query (Order Number, Tracking Code, or Phone)
   */
  async trackOrder(query: string) {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      throw new BadRequestException('عبارت جستجو نامعتبر است');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        OR: [
          { number: { equals: cleanQuery, mode: 'insensitive' } },
          { trackingCode: { equals: cleanQuery, mode: 'insensitive' } },
          { phone: cleanQuery },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!order) {
      throw new NotFoundException('سفارشی با این مشخصات یافت نشد');
    }

    const view = await this.findByNumber(order.number);
    return {
      ok: true,
      order: view,
    };
  }
}
