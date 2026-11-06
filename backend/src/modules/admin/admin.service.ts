import { Injectable, NotFoundException } from '@nestjs/common';
import { order_status, Prisma, Role, SettlementStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      totalProducts,
      totalOrders,
      lowStockCount,
      outOfStockCount,
      pendingOrdersCount,
      completedOrdersCount,
      totalCustomers,
      activeSuppliers,
      pendingSettlementsCount,
      revenueResult,
      commissionResult,
      recentOrders,
      categories,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.product.count({
        where: { stock: { gt: 0, lte: 5 } },
      }),
      this.prisma.product.count({
        where: { stock: 0 },
      }),
      this.prisma.order.count({
        where: { status: order_status.pending },
      }),
      this.prisma.order.count({
        where: { status: { in: [order_status.delivered, order_status.shipped, order_status.paid] } },
      }),
      this.prisma.user.count({
        where: { role: Role.CUSTOMER },
      }),
      this.prisma.supplier.count({
        where: { isActive: true },
      }),
      this.prisma.supplierSettlement.count({
        where: { status: SettlementStatus.PENDING_REVIEW },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: {
            in: [order_status.processing, order_status.shipped, order_status.delivered, order_status.paid],
          },
        },
      }),
      this.prisma.order.aggregate({
        _sum: { platformCommissionAmount: true },
        where: {
          status: {
            in: [order_status.processing, order_status.shipped, order_status.delivered, order_status.paid],
          },
        },
      }),
      this.prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          createdAt: true,
          total: true,
          status: true,
          platformCommissionAmount: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.category.findMany({
        include: {
          products: {
            select: { id: true, price: true, name: true },
          },
        },
      }),
    ]);

    const totalRevenue = revenueResult._sum.total || 0;
    const platformCommission = commissionResult._sum.platformCommissionAmount || Math.round(totalRevenue * 0.1);

    // Build timeline for charts (last 7 days and 30 days)
    const dailyMap = new Map<string, { date: string; revenue: number; orders: number; commission: number }>();
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      dailyMap.set(key, { date: key, revenue: 0, orders: 0, commission: 0 });
    }

    for (const ord of recentOrders) {
      const key = ord.createdAt.toISOString().slice(0, 10);
      const existing = dailyMap.get(key);
      if (existing) {
        existing.orders += 1;
        if (([order_status.processing, order_status.shipped, order_status.delivered, order_status.paid] as order_status[]).includes(ord.status)) {
          existing.revenue += ord.total;
          existing.commission += ord.platformCommissionAmount || Math.round(ord.total * 0.1);
        }
      }
    }

    const timeline = Array.from(dailyMap.values());

    // Category breakdown
    const categoryDistribution = categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      productCount: c.products.length,
    }));

    return {
      // 8 Primary KPI cards
      totalRevenue,
      revenueGrowth: 18.4,
      totalOrders,
      ordersGrowth: 12.1,
      pendingOrdersCount,
      completedOrdersCount,
      totalCustomers,
      activeSuppliers,
      totalProducts,
      pendingSettlementsCount,
      platformCommission,
      lowStockCount,
      outOfStockCount,
      // Chart data
      timeline,
      categoryDistribution,
    };
  }

  async getCustomers() {
    const customers = await this.prisma.user.findMany({
      where: { role: Role.CUSTOMER },
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
        addresses: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return customers.map((c) => {
      const totalSpent = c.orders.reduce((sum, o) => sum + o.total, 0);
      return {
        id: c.id,
        name: c.name || 'بدون نام',
        email: c.email,
        phone: c.phone || '---',
        ordersCount: c.orders.length,
        totalSpent,
        createdAt: c.createdAt.toISOString(),
        address: c.addresses[0]?.line1 || '---',
      };
    });
  }

  async getOrders(statusFilter?: string) {
    const whereClause: Prisma.OrderWhereInput = {};
    if (statusFilter && statusFilter !== 'all') {
      whereClause.status = statusFilter as order_status;
    }

    const orders = await this.prisma.order.findMany({
      where: whereClause,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const formattedOrders = orders.map((o) => {
      const shipping = typeof o.shipping === 'object' && o.shipping !== null
        ? (o.shipping as Record<string, any>)
        : {};

      return {
        id: o.id,
        orderNumber: o.number,
        trackingCode: o.trackingCode,
        courier: o.courier || 'پست پیشتاز',
        customer: {
          name: o.user?.name || o.name || 'مشتری ویپ‌لب',
          email: o.user?.email || o.email || 'customer@vapelab.ir',
          phone: o.user?.phone || o.phone || '---',
          address: shipping.line1 || 'تهران',
          city: shipping.city || 'تهران',
          postalCode: shipping.zip || '---',
        },
        items: o.items.map((it) => ({
          id: it.id,
          productId: it.productId || it.id,
          productName: it.product?.name || it.name,
          image: it.product?.images?.[0] || it.image || '',
          price: it.price,
          quantity: it.qty,
          flavor: it.flavor,
          nicotine: it.nicotine,
        })),
        subtotal: o.subtotal,
        discount: o.discount,
        shippingFee: o.shippingFee,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
      };
    });

    return {
      orders: formattedOrders,
    };
  }

  async updateOrder(body: { id: number; status: order_status; trackingCode?: string; courier?: string }) {
    const { id, status, trackingCode, courier } = body;
    const order = await this.prisma.order.findUnique({ where: { id: Number(id) } });
    if (!order) {
      throw new NotFoundException('سفارش مورد نظر یافت نشد');
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status,
        trackingCode: trackingCode !== undefined ? trackingCode : order.trackingCode,
        courier: courier !== undefined ? courier : order.courier,
      },
    });

    return {
      ok: true,
      order: updated,
      id: updated.id,
      status: updated.status,
      updatedAt: new Date().toISOString(),
    };
  }

  async getBanners() {
    return this.prisma.banner.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async createBanner(data: any) {
    const banner = await this.prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        badge: data.badge || null,
        imageUrl: data.imageUrl || data.image || '',
        linkUrl: data.linkUrl || data.ctaLink || data.link || '/products',
        displayOrder: Number(data.displayOrder ?? data.order ?? data.sortOrder) || 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : (data.active !== undefined ? Boolean(data.active) : true),
      },
    });

    return { ok: true, banner };
  }

  async updateBanner(id: number, data: any) {
    const banner = await this.prisma.banner.findUnique({ where: { id: Number(id) } });
    if (!banner) throw new NotFoundException('بنر یافت نشد');

    const updated = await this.prisma.banner.update({
      where: { id: Number(id) },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
        ...(data.badge !== undefined && { badge: data.badge }),
        ...((data.imageUrl || data.image) && { imageUrl: data.imageUrl || data.image }),
        ...((data.linkUrl || data.ctaLink || data.link) && { linkUrl: data.linkUrl || data.ctaLink || data.link }),
        ...(data.displayOrder !== undefined && { displayOrder: Number(data.displayOrder) }),
        ...(data.order !== undefined && { displayOrder: Number(data.order) }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      },
    });

    return { ok: true, banner: updated };
  }

  async deleteBanner(id: number) {
    await this.prisma.banner.delete({
      where: { id: Number(id) },
    });
    return { ok: true, deletedId: id };
  }

  async handleProductAction(body: any) {
    const { action, id, data } = body;
    if (action === 'delete') {
      await this.prisma.product.delete({ where: { id: Number(id) } });
      return { ok: true, deletedId: id };
    }

    if (action === 'update' && id && data) {
      const updated = await this.prisma.product.update({
        where: { id: Number(id) },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.tagline !== undefined && { tagline: data.tagline }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.price !== undefined && { price: Number(data.price) }),
          ...(data.discountPrice !== undefined && { discountPrice: data.discountPrice ? Number(data.discountPrice) : null }),
          ...(data.stock !== undefined && { stock: Number(data.stock) }),
          ...(data.featured !== undefined && { featured: Boolean(data.featured) }),
        },
      });
      return { ok: true, product: updated };
    }

    return { ok: false, message: 'عملیات نامعتبر است' };
  }
}
