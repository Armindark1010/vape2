import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { order_status, Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. Get supplier record for authenticated user
   */
  async getSupplierForUser(userId: number) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!supplier) {
      throw new ForbiddenException('شما به عنوان تأمین‌کننده در سیستم ثبت نشده‌اید');
    }

    if (!supplier.isActive) {
      throw new ForbiddenException('حساب کاربری تأمین‌کننده شما غیرفعال شده است');
    }

    return supplier;
  }

  /**
   * 2. Supplier Dashboard Metrics (Isolated to this supplier only)
   */
  async getDashboard(userId: number) {
    const supplier = await this.getSupplierForUser(userId);

    const [productsCount, lowStockCount, outOfStockCount, activeProductsCount, itemsSold, lastSettlement, allMyOrders] = await Promise.all([
      this.prisma.product.count({ where: { supplierId: supplier.id } }),
      this.prisma.product.count({ where: { supplierId: supplier.id, stock: { gt: 0, lte: 5 } } }),
      this.prisma.product.count({ where: { supplierId: supplier.id, stock: 0 } }),
      this.prisma.product.count({ where: { supplierId: supplier.id, stock: { gt: 0 } } }),
      this.prisma.orderItem.findMany({
        where: {
          product: { supplierId: supplier.id },
          order: { status: { in: [order_status.paid, order_status.processing, order_status.shipped, order_status.delivered] } },
        },
        select: {
          qty: true,
          price: true,
          order: {
            select: {
              createdAt: true,
              platformCommissionRate: true,
              isSettled: true,
            },
          },
        },
      }),
      this.prisma.supplierSettlement.findFirst({
        where: { supplierId: supplier.id },
        orderBy: { periodEnd: 'desc' },
      }),
      this.prisma.orderItem.findMany({
        where: { product: { supplierId: supplier.id } },
        select: {
          order: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      }),
    ]);

    let totalGrossSales = 0;
    let totalCommissionDeducted = 0;
    let pendingSettlementAmount = 0;

    // Timeline map
    const dailyMap = new Map<string, { date: string; revenue: number; orders: number; commission: number }>();
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      dailyMap.set(key, { date: key, revenue: 0, orders: 0, commission: 0 });
    }

    for (const item of itemsSold) {
      const lineGross = item.price * item.qty;
      totalGrossSales += lineGross;
      const commRate = item.order.platformCommissionRate || 10;
      const comm = Math.round((lineGross * commRate) / 100);
      totalCommissionDeducted += comm;
      if (!item.order.isSettled) {
        pendingSettlementAmount += (lineGross - comm);
      }

      const key = item.order.createdAt.toISOString().slice(0, 10);
      const existing = dailyMap.get(key);
      if (existing) {
        existing.revenue += lineGross;
        existing.orders += 1;
        existing.commission += comm;
      }
    }

    const netPayableSales = totalGrossSales - totalCommissionDeducted;

    // Distinct orders count
    const distinctOrders = new Set(allMyOrders.map(o => o.order.id));
    const totalOrdersCount = distinctOrders.size;
    const pendingOrdersCount = new Set(
      allMyOrders.filter(o => o.order.status === order_status.pending || o.order.status === order_status.processing).map(o => o.order.id)
    ).size;

    return {
      supplier: {
        id: supplier.id,
        companyName: supplier.companyName,
        contactName: supplier.contactName,
        phone: supplier.phone,
        email: supplier.email,
        commissionRate: supplier.commissionRate ?? 10,
        iban: supplier.iban,
      },
      stats: {
        totalGrossSales,
        totalCommissionDeducted,
        netPayableSales,
        totalOrders: totalOrdersCount,
        pendingOrdersCount,
        productsCount,
        activeProducts: activeProductsCount,
        lowStockCount,
        outOfStockCount,
        pendingSettlementAmount,
        lastSettlementDate: lastSettlement?.settledAt || lastSettlement?.createdAt || null,
        lastSettlementAmount: lastSettlement?.netPayableAmount || 0,
        currency: 'IRT',
      },
      timeline: Array.from(dailyMap.values()),
    };
  }

  /**
   * 3. Supplier Products List (Isolated)
   */
  async getMyProducts(userId: number) {
    const supplier = await this.getSupplierForUser(userId);
    return this.prisma.product.findMany({
      where: { supplierId: supplier.id },
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
      },
      orderBy: { id: 'desc' },
    });
  }

  /**
   * 4. Supplier Update Stock (Isolated - checks product belongs to this supplier)
   */
  async updateMyProductStock(userId: number, productId: number, stock: number) {
    const supplier = await this.getSupplierForUser(userId);
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.supplierId !== supplier.id) {
      throw new ForbiddenException('شما دسترسی ویرایش موجودی این محصول را ندارید');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { stock: Math.max(0, Number(stock)) },
    });
  }

  /**
   * 5. Supplier Orders List (Isolated)
   */
  async getMyOrders(userId: number) {
    const supplier = await this.getSupplierForUser(userId);
    const orderItems = await this.prisma.orderItem.findMany({
      where: { product: { supplierId: supplier.id } },
      include: {
        order: {
          select: {
            id: true,
            number: true,
            status: true,
            createdAt: true,
            platformCommissionRate: true,
            isSettled: true,
          },
        },
      },
      orderBy: { id: 'desc' },
      take: 100,
    });

    return orderItems.map((oi) => {
      const lineGross = oi.price * oi.qty;
      const commRate = oi.order.platformCommissionRate || 10;
      const commission = Math.round((lineGross * commRate) / 100);
      return {
        orderId: oi.order.id,
        orderNumber: oi.order.number,
        productName: oi.name,
        quantity: oi.qty,
        unitPrice: oi.price,
        grossTotal: lineGross,
        platformCommission: commission,
        supplierPayable: lineGross - commission,
        orderStatus: oi.order.status,
        isSettled: oi.order.isSettled,
        createdAt: oi.order.createdAt,
      };
    });
  }

  /**
   * 6. Supplier Settlements (Isolated)
   */
  async getMySettlements(userId: number) {
    const supplier = await this.getSupplierForUser(userId);
    return this.prisma.supplierSettlement.findMany({
      where: { supplierId: supplier.id },
      include: {
        items: true,
      },
      orderBy: { periodEnd: 'desc' },
    });
  }

  /* ==========================================================
     ADMINISTRATIVE SUPPLIER OPERATIONS
     ========================================================== */

  async adminCreateSupplier(data: {
    companyName: string;
    contactName?: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    iban?: string;
    commissionRate?: number;
  }) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.contactName || data.companyName,
          email: data.email.toLowerCase(),
          username: data.username.toLowerCase(),
          phone: data.phone,
          passwordHash,
          role: Role.SUPPLIER,
        },
      });

      const supplier = await tx.supplier.create({
        data: {
          userId: user.id,
          companyName: data.companyName,
          contactName: data.contactName,
          phone: data.phone,
          email: data.email,
          iban: data.iban,
          commissionRate: data.commissionRate || 10,
          isActive: true,
        },
      });

      return supplier;
    });
  }

  async adminListSuppliers() {
    return this.prisma.supplier.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        _count: { select: { products: true, settlements: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  async adminAssignProducts(supplierId: number, productIds: number[]) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException('تأمین‌کننده یافت نشد');

    await this.prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { supplierId },
    });

    return { success: true, count: productIds.length };
  }

  async adminUpdateSupplier(supplierId: number, data: any) {
    return this.prisma.supplier.update({
      where: { id: supplierId },
      data: {
        ...(data.companyName ? { companyName: data.companyName } : {}),
        ...(data.contactName !== undefined ? { contactName: data.contactName } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.iban !== undefined ? { iban: data.iban } : {}),
        ...(data.isActive !== undefined ? { isActive: Boolean(data.isActive) } : {}),
        ...(data.commissionRate !== undefined ? { commissionRate: Number(data.commissionRate) } : {}),
      },
    });
  }
}

