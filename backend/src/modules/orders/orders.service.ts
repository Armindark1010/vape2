import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Role, User } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, dto: CreateOrderDto) {
    const { items } = dto;

    // Fetch products from DB to verify existence and price
    const productIds = items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      throw new BadRequestException('One or more products were not found');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Check stock and compute subtotal
    let totalAmount = 0;
    const orderItemsData: {
      productId: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId)!;

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product '${product.title}'. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }

      const activePrice = Number(product.discountPrice ?? product.price);
      const subtotal = activePrice * item.quantity;
      totalAmount += subtotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: activePrice,
        subtotal,
      });
    }

    // Generate readable orderNumber
    const orderNumber = `VP-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Execute in transaction: create Order, create OrderItems, decrement stock
    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          totalAmount,
          status: OrderStatus.PENDING,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  images: true,
                  brand: true,
                },
              },
            },
          },
        },
      });

      // Decrement stock for each purchased product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return createdOrder;
    });

    return order;
  }

  async getMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                images: true,
                brand: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, user: User) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                images: true,
                brand: true,
                nicotineStrength: true,
                flavorProfile: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            phoneNumber: true,
            fullName: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found`);
    }

    // Customer can only view their own order
    if (user.role === Role.CUSTOMER && order.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found`);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: {
        items: true,
      },
    });
  }

  async findAllAdmin(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [total, orders] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, phoneNumber: true, fullName: true },
          },
          items: {
            include: {
              product: {
                select: { id: true, title: true, slug: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
