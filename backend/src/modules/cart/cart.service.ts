import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AddToCartDto, CartItemDto } from './dto/cart.dto';

export interface CalculatedCartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  slug: string;
  brand: string;
  images: string[];
  category: { id: string; name: string; slug: string } | null;
  flavor: string | null;
  nicotine: string | null;
  originalPrice: number;
  discountPrice: number | null;
  activePrice: number;
  requestedQuantity: number;
  quantity: number;
  subtotal: number;
  totalDiscount: number;
  stock: number;
  isAvailable: boolean;
  priceChanged: boolean;
  warnings: string[];
}

export interface CartSummary {
  totalOriginalAmount: number;
  totalDiscount: number;
  finalAmount: number;
  totalItems: number;
  totalQuantity: number;
  isValid: boolean;
  warnings: string[];
}

export interface CartResponse {
  cartId: string | null;
  items: CalculatedCartItem[];
  summary: CartSummary;
}

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * هسته مرکزی Revalidation قیمت، تخفیف‌ها و موجودی انبار به صورت Real-time از دیتابیس
   */
  private async calculateItems(
    rawItems: {
      id?: string;
      productId: string;
      quantity: number;
      flavor?: string | null;
      nicotine?: string | null;
    }[],
    cartId: string | null = null,
  ): Promise<CartResponse> {
    if (!rawItems || rawItems.length === 0) {
      return {
        cartId,
        items: [],
        summary: {
          totalOriginalAmount: 0,
          totalDiscount: 0,
          finalAmount: 0,
          totalItems: 0,
          totalQuantity: 0,
          isValid: true,
          warnings: [],
        },
      };
    }

    // استخراج کلیه شناسه‌ها برای کوئری بهینه در دیتابیس
    const productIds = Array.from(new Set(rawItems.map((i) => i.productId)));
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    const calculatedItems: CalculatedCartItem[] = [];
    const globalWarnings: string[] = [];
    let isCartValid = true;

    for (const raw of rawItems) {
      const product = productMap.get(raw.productId);
      const itemWarnings: string[] = [];

      if (!product) {
        isCartValid = false;
        const msg = `محصول با شناسه ${raw.productId} در فروشگاه یافت نشد یا حذف شده است`;
        itemWarnings.push(msg);
        globalWarnings.push(msg);

        calculatedItems.push({
          id: raw.id || `item-${raw.productId}`,
          productId: raw.productId,
          variantId: raw.productId,
          title: 'محصول ناموجود',
          slug: '',
          brand: '',
          images: [],
          category: null,
          flavor: raw.flavor || null,
          nicotine: raw.nicotine || null,
          originalPrice: 0,
          discountPrice: null,
          activePrice: 0,
          requestedQuantity: raw.quantity,
          quantity: 0,
          subtotal: 0,
          totalDiscount: 0,
          stock: 0,
          isAvailable: false,
          priceChanged: false,
          warnings: itemWarnings,
        });
        continue;
      }

      const originalPrice = Number(product.price);
      const discountPrice = product.discountPrice
        ? Number(product.discountPrice)
        : null;
      const activePrice =
        discountPrice !== null && discountPrice < originalPrice
          ? discountPrice
          : originalPrice;

      let effectiveQuantity = raw.quantity;
      let isAvailable = true;

      // بررسی موجودی انبار
      if (product.stock <= 0) {
        isAvailable = false;
        effectiveQuantity = 0;
        isCartValid = false;
        const msg = `موجودی کالای «${product.title}» به اتمام رسیده است`;
        itemWarnings.push(msg);
        globalWarnings.push(msg);
      } else if (raw.quantity > product.stock) {
        isCartValid = false;
        effectiveQuantity = product.stock;
        const msg = `تعداد درخواستی برای «${product.title}» (${raw.quantity} عدد) بیش از موجودی انبار بود و به ${product.stock} عدد تنظیم شد`;
        itemWarnings.push(msg);
        globalWarnings.push(msg);
      }

      const subtotal = activePrice * effectiveQuantity;
      const totalDiscount = (originalPrice - activePrice) * effectiveQuantity;

      calculatedItems.push({
        id: raw.id || `item-${product.id}`,
        productId: product.id,
        variantId: product.id,
        title: product.title,
        slug: product.slug,
        brand: product.brand,
        images: product.images,
        category: product.category,
        flavor: raw.flavor || null,
        nicotine: raw.nicotine || product.nicotineStrength || null,
        originalPrice,
        discountPrice,
        activePrice,
        requestedQuantity: raw.quantity,
        quantity: effectiveQuantity,
        subtotal,
        totalDiscount,
        stock: product.stock,
        isAvailable,
        priceChanged: false,
        warnings: itemWarnings,
      });
    }

    // محاسبه خلاصه کل سبد
    const totalOriginalAmount = calculatedItems.reduce(
      (sum, item) => sum + item.originalPrice * item.quantity,
      0,
    );
    const totalDiscount = calculatedItems.reduce(
      (sum, item) => sum + item.totalDiscount,
      0,
    );
    const finalAmount = calculatedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );
    const totalQuantity = calculatedItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalItems = calculatedItems.filter(
      (i) => i.isAvailable && i.quantity > 0,
    ).length;

    return {
      cartId,
      items: calculatedItems,
      summary: {
        totalOriginalAmount,
        totalDiscount,
        finalAmount,
        totalItems,
        totalQuantity,
        isValid: isCartValid,
        warnings: Array.from(new Set(globalWarnings)),
      },
    };
  }

  /**
   * بازاعتبارسنجی سبد خرید کاربران مهمان (Stateless Guest Cart Revalidation)
   */
  async revalidateGuestCart(items: CartItemDto[]): Promise<CartResponse> {
    if (!items || items.length === 0) {
      return this.calculateItems([], null);
    }

    const rawItems = items.map((item) => {
      const pid = item.productId || item.variantId;
      if (!pid) {
        throw new BadRequestException('شناسه محصول (productId یا variantId) الزامی است');
      }
      return {
        productId: pid,
        quantity: item.quantity,
        flavor: item.flavor,
        nicotine: item.nicotine,
      };
    });

    return this.calculateItems(rawItems, null);
  }

  /**
   * دریافت سبد خرید کاربر لاگین‌شده همراه با Revalidation بلادرنگ
   */
  async getUserCart(userId: string): Promise<CartResponse> {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: true,
        },
      });
    }

    const rawItems = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      flavor: item.flavor,
      nicotine: item.nicotine,
    }));

    return this.calculateItems(rawItems, cart.id);
  }

  /**
   * افزودن کالا به سبد خرید کاربر لاگین‌شده با بررسی موجودی انبار
   */
  async addToCart(userId: string, dto: AddToCartDto): Promise<CartResponse> {
    const targetProductId = dto.productId || dto.variantId;
    if (!targetProductId) {
      throw new BadRequestException('شناسه محصول یا تنوع (productId/variantId) الزامی است');
    }

    // ۱. بررسی وجود و موجودی کالا در دیتابیس
    const product = await this.prisma.product.findUnique({
      where: { id: targetProductId },
    });

    if (!product) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        `موجودی انبار برای «${product.title}» کافی نیست (موجودی فعلی: ${product.stock} عدد)`,
      );
    }

    // ۲. یافتن یا ایجاد Cart کاربر
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    // ۳. بررسی وجود آیتم در سبد
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: targetProductId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      if (newQuantity > product.stock) {
        throw new BadRequestException(
          `امکان افزودن وجود ندارد. مجموع تعداد درخواستی (${newQuantity}) از موجودی انبار (${product.stock}) بیشتر است`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          flavor: dto.flavor !== undefined ? dto.flavor : existingItem.flavor,
          nicotine: dto.nicotine !== undefined ? dto.nicotine : existingItem.nicotine,
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: targetProductId,
          quantity: dto.quantity,
          flavor: dto.flavor,
          nicotine: dto.nicotine,
        },
      });
    }

    return this.getUserCart(userId);
  }

  /**
   * ویرایش تعداد یک آیتم موجود در سبد خرید
   */
  async updateItemQuantity(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<CartResponse> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('سبد خرید کاربر یافت نشد');
    }

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: {
        product: true,
      },
    });

    if (!item) {
      throw new NotFoundException('آیتم مورد نظر در سبد خرید شما یافت نشد');
    }

    if (quantity > item.product.stock) {
      throw new BadRequestException(
        `تعداد انتخابی (${quantity}) بیشتر از موجودی انبار (${item.product.stock}) است`,
      );
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getUserCart(userId);
  }

  /**
   * حذف یک آیتم مشخص از سبد خرید
   */
  async removeItem(userId: string, itemId: string): Promise<CartResponse> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('سبد خرید یافت نشد');
    }

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!item) {
      throw new NotFoundException('آیتم مورد نظر در سبد خرید یافت نشد');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getUserCart(userId);
  }

  /**
   * خالی کردن کامل سبد خرید کاربر
   */
  async clearCart(userId: string): Promise<CartResponse> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return this.getUserCart(userId);
  }
}
