import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface CalculatedCartItem {
  productId: number;
  name: string;
  slug: string;
  brand?: string;
  image?: string;
  price: number;
  discountPrice?: number | null;
  activePrice: number;
  quantity: number;
  subtotal: number;
  stock: number;
  isAvailable: boolean;
}

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async revalidateGuestCart(rawItems: { productId: number | string; quantity: number }[]) {
    if (!rawItems || rawItems.length === 0) {
      return {
        items: [],
        summary: { totalAmount: 0, totalItems: 0, isValid: true },
      };
    }

    const productIds = rawItems.map((i) => Number(i.productId)).filter((id) => !Number.isNaN(id));
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        brand: { select: { name: true } },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalAmount = 0;
    let totalItems = 0;
    let isValid = true;

    const calculatedItems: CalculatedCartItem[] = [];

    for (const item of rawItems) {
      const pid = Number(item.productId);
      const prod = productMap.get(pid);
      if (!prod) {
        isValid = false;
        continue;
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      const activePrice = prod.discountPrice ?? prod.price;
      const subtotal = activePrice * qty;
      const isAvailable = prod.stock >= qty;

      if (!isAvailable) isValid = false;

      totalAmount += subtotal;
      totalItems += qty;

      calculatedItems.push({
        productId: prod.id,
        name: prod.name,
        slug: prod.slug,
        brand: prod.brand?.name,
        image: Array.isArray(prod.images) ? (prod.images as string[])[0] : undefined,
        price: prod.price,
        discountPrice: prod.discountPrice,
        activePrice,
        quantity: qty,
        subtotal,
        stock: prod.stock,
        isAvailable,
      });
    }

    return {
      items: calculatedItems,
      summary: {
        totalAmount,
        totalItems,
        isValid,
      },
    };
  }
}
