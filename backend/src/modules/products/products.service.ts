import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InventoryMovementType, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

export interface ProductFilterQuery {
  category?: string;
  brand?: string;
  productType?: string;
  search?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  stockStatus?: 'in_stock' | 'out_of_stock' | 'low_stock';
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  sort?: string;
  limit?: number;
  page?: number;
  format?: string;
}

export interface VariantInputDto {
  id?: number;
  sku?: string;
  title?: string;
  combination: Record<string, string>;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  image?: string | null;
  weight?: number | null;
  isActive?: boolean;
}

export interface AttributeValueInputDto {
  attributeId: number;
  value: string;
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper: Generate a canonical combination hash from an attribute object
   * E.g. { flavor: "Blueberry", nicotine: "50mg" } => "flavor:blueberry|nicotine:50mg"
   */
  static generateCombinationHash(combination: Record<string, any>): string {
    if (!combination || typeof combination !== 'object') {
      return 'default:standard';
    }
    const sortedKeys = Object.keys(combination).sort();
    return sortedKeys
      .map((k) => `${k.toLowerCase().trim()}:${String(combination[k]).toLowerCase().trim()}`)
      .join('|');
  }

  async findAll(query: ProductFilterQuery) {
    const {
      category,
      brand,
      productType,
      search,
      q,
      minPrice,
      maxPrice,
      inStock,
      stockStatus,
      featured,
      newArrival,
      bestSeller,
      sort = 'newest',
      page = 1,
      limit = 60,
    } = query;

    const searchTerm = search || q;
    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.category = {
        OR: [{ slug: category }, ...(Number(category) ? [{ id: Number(category) }] : [])],
      };
    }

    if (brand) {
      where.brand = {
        OR: [
          { slug: brand },
          ...(Number(brand) ? [{ id: Number(brand) }] : []),
          { name: { contains: brand, mode: 'insensitive' } },
        ],
      };
    }

    if (productType) {
      where.productType = {
        OR: [
          { slug: productType },
          ...(Number(productType) ? [{ id: Number(productType) }] : []),
        ],
      };
    }

    if (featured !== undefined) where.featured = Boolean(featured);
    if (newArrival !== undefined) where.newArrival = Boolean(newArrival);
    if (bestSeller !== undefined) where.bestSeller = Boolean(bestSeller);

    if (inStock || stockStatus === 'in_stock') {
      where.stock = { gt: 0 };
    } else if (stockStatus === 'out_of_stock') {
      where.stock = { lte: 0 };
    } else if (stockStatus === 'low_stock') {
      where.stock = { gt: 0, lte: 5 };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Number(minPrice);
      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { sku: { contains: searchTerm, mode: 'insensitive' } },
        { tagline: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    else if (sort === 'price-desc') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'popular') orderBy = { reviewCount: 'desc' };

    const take = Number(limit) || 60;
    const skip = (Math.max(1, Number(page) || 1) - 1) * take;

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          productType: { select: { id: true, name: true, slug: true, icon: true } },
          supplier: { select: { id: true, companyName: true } },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              sku: true,
              title: true,
              combination: true,
              price: true,
              compareAtPrice: true,
              stock: true,
              reservedQuantity: true,
              image: true,
              isActive: true,
            },
          },
        },
      }),
    ]);

    const mapped = items.map((p) => {
      // Calculate total stock and available stock across variants
      const totalStock = p.variants?.length
        ? p.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
        : p.stock;
      const totalReserved = p.variants?.length
        ? p.variants.reduce((acc, v) => acc + (v.reservedQuantity || 0), 0)
        : 0;

      // Price range across variants
      const variantPrices = p.variants?.map((v) => v.price) || [];
      const minVariantPrice = variantPrices.length ? Math.min(...variantPrices) : p.price;
      const maxVariantPrice = variantPrices.length ? Math.max(...variantPrices) : p.price;

      return {
        id: p.id,
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        tagline: p.tagline,
        shortDescription: p.shortDescription,
        description: p.description,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        specs: p.specs,
        price: p.price,
        discountPrice: p.discountPrice,
        compareAtPrice: p.compareAtPrice,
        minVariantPrice,
        maxVariantPrice,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: totalStock,
        reservedStock: totalReserved,
        availableStock: Math.max(0, totalStock - totalReserved),
        variantsCount: p.variants?.length || 0,
        category: p.category?.name,
        categoryId: p.categoryId,
        categorySlug: p.category?.slug,
        brand: p.brand?.name,
        brandId: p.brandId,
        brandSlug: p.brand?.slug,
        productType: p.productType?.name,
        productTypeId: p.productTypeId,
        productTypeSlug: p.productType?.slug,
        productTypeIcon: p.productType?.icon,
        supplierName: p.supplier?.companyName,
        image: Array.isArray(p.images) ? (p.images as string[])[0] : null,
        images: p.images || [],
        featured: p.featured,
        isFeatured: p.featured,
        newArrival: p.newArrival,
        bestSeller: p.bestSeller,
        variants: p.variants.map((v) => ({
          ...v,
          availableStock: Math.max(0, v.stock - v.reservedQuantity),
        })),
        createdAt: p.createdAt.toISOString(),
      };
    });

    if (query?.format === 'paginated') {
      return {
        total,
        page: Number(page) || 1,
        limit: take,
        totalPages: Math.ceil(total / take),
        items: mapped,
        products: mapped,
      };
    }

    return mapped;
  }

  async findBySlugOrId(slugOrId: string) {
    const isNum = !Number.isNaN(Number(slugOrId));
    const where: Prisma.ProductWhereInput = isNum
      ? { OR: [{ id: Number(slugOrId) }, { slug: slugOrId }] }
      : { slug: slugOrId };

    const product = await this.prisma.product.findFirst({
      where,
      include: {
        category: true,
        brand: true,
        productType: {
          include: {
            attributes: { orderBy: { displayOrder: 'asc' } },
          },
        },
        attributeValues: {
          include: {
            attribute: true,
          },
        },
        variants: {
          orderBy: { id: 'asc' },
          include: {
            attributeValues: {
              include: { attribute: true },
            },
          },
        },
        supplier: { select: { id: true, companyName: true } },
        reviews: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!product) {
      throw new NotFoundException(`محصول با شناسه یا اسلاگ '${slugOrId}' یافت نشد`);
    }

    const totalStock = product.variants?.length
      ? product.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
      : product.stock;
    const totalReserved = product.variants?.length
      ? product.variants.reduce((acc, v) => acc + (v.reservedQuantity || 0), 0)
      : 0;

    return {
      ...product,
      stock: totalStock,
      reservedStock: totalReserved,
      availableStock: Math.max(0, totalStock - totalReserved),
      categoryName: product.category?.name,
      categorySlug: product.category?.slug,
      brandName: product.brand?.name,
      brandSlug: product.brand?.slug,
      productTypeName: product.productType?.name,
      productTypeSlug: product.productType?.slug,
      images: Array.isArray(product.images) ? product.images : [],
      variants: product.variants.map((v) => ({
        ...v,
        availableStock: Math.max(0, v.stock - v.reservedQuantity),
      })),
    };
  }

  async create(data: any) {
    if (!data.name || data.price === undefined) {
      throw new BadRequestException('نام محصول و قیمت پایه الزامی است');
    }

    const slug =
      data.slug?.trim() ||
      data.name
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-');

    const sku =
      data.sku?.trim() ||
      `VAPE-${Date.now().toString().slice(-6)}-${slug.slice(0, 6).toUpperCase()}`;

    // Validate SKU uniqueness
    const existingSku = await this.prisma.product.findFirst({ where: { sku } });
    if (existingSku) {
      throw new BadRequestException(`کد SKU محصول (${sku}) تکراری است`);
    }

    const existingSlug = await this.prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      throw new BadRequestException(`اسلاگ محصول (${slug}) تکراری است`);
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Create main Product
      const product = await tx.product.create({
        data: {
          name: data.name,
          slug,
          sku,
          tagline: data.tagline,
          shortDescription: data.shortDescription,
          description: data.description || '',
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          specs: data.specs || {},
          price: Number(data.price),
          discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
          compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
          stock: Number(data.stock) || 0,
          categoryId: data.categoryId ? Number(data.categoryId) : undefined,
          brandId: data.brandId ? Number(data.brandId) : undefined,
          productTypeId: data.productTypeId ? Number(data.productTypeId) : undefined,
          supplierId: data.supplierId ? Number(data.supplierId) : undefined,
          images: data.images || [],
          featured: Boolean(data.featured),
          newArrival: Boolean(data.newArrival),
          bestSeller: Boolean(data.bestSeller),
        },
      });

      // 2. Save dynamic attribute values
      if (Array.isArray(data.attributeValues) && data.attributeValues.length) {
        for (const av of data.attributeValues) {
          if (av.attributeId && av.value !== undefined && av.value !== null && av.value !== '') {
            await tx.productAttributeValue.create({
              data: {
                productId: product.id,
                attributeId: Number(av.attributeId),
                value: typeof av.value === 'object' ? JSON.stringify(av.value) : String(av.value),
              },
            });
          }
        }
      }

      // 3. Process Variants
      const incomingVariants: VariantInputDto[] = Array.isArray(data.variants) && data.variants.length
        ? data.variants
        : [
            // Default single variant if none supplied
            {
              sku: `${sku}-DEF`,
              title: `${data.name} (نسخه پیش‌فرض)`,
              combination: { مدل: 'پیش‌فرض استاندارد' },
              price: Number(data.price),
              compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
              stock: Number(data.stock) || 0,
              image: Array.isArray(data.images) ? data.images[0] : null,
              isActive: true,
            },
          ];

      // Track hashes to prevent duplicates
      const seenHashes = new Set<string>();
      let totalStock = 0;

      for (let i = 0; i < incomingVariants.length; i++) {
        const v = incomingVariants[i];
        const combHash = ProductsService.generateCombinationHash(v.combination);

        if (seenHashes.has(combHash)) {
          throw new BadRequestException(
            `ترکیب تنوع تکراری است: (${combHash}). هر ترکیب تنوع باید کاملاً یکتا باشد.`,
          );
        }
        seenHashes.add(combHash);

        const variantSku = v.sku?.trim() || `${sku}-V${i + 1}`;
        const variantPrice = Number(v.price) || Number(data.price);
        const variantStock = Math.max(0, Number(v.stock) || 0);
        totalStock += variantStock;

        const createdVariant = await tx.productVariant.create({
          data: {
            productId: product.id,
            sku: variantSku,
            title: v.title || Object.values(v.combination || {}).join(' / ') || `تنوع ${i + 1}`,
            combinationHash: combHash,
            combination: v.combination || {},
            price: variantPrice,
            compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
            stock: variantStock,
            reservedQuantity: 0,
            image: v.image || (Array.isArray(data.images) ? data.images[0] : null),
            weight: v.weight ? Number(v.weight) : null,
            isActive: v.isActive !== false,
          },
        });

        // Record initial inventory movement
        if (variantStock > 0) {
          await tx.inventoryMovement.create({
            data: {
              variantId: createdVariant.id,
              productId: product.id,
              type: InventoryMovementType.PURCHASE_RECEIPT,
              delta: variantStock,
              stockBefore: 0,
              stockAfter: variantStock,
              reason: 'موجودی اولیه در زمان ایجاد محصول',
            },
          });
        }
      }

      // Sync total stock on product
      await tx.product.update({
        where: { id: product.id },
        data: { stock: totalStock },
      });

      return tx.product.findUnique({
        where: { id: product.id },
        include: {
          variants: true,
          attributeValues: { include: { attribute: true } },
          category: true,
          brand: true,
          productType: true,
        },
      });
    });
  }

  async update(id: number, data: any) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existing) {
      throw new NotFoundException(`محصول یافت نشد`);
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Update basic product info
      const updated = await tx.product.update({
        where: { id },
        data: {
          ...(data.name ? { name: data.name } : {}),
          ...(data.tagline !== undefined ? { tagline: data.tagline } : {}),
          ...(data.shortDescription !== undefined ? { shortDescription: data.shortDescription } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
          ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription } : {}),
          ...(data.specs !== undefined ? { specs: data.specs } : {}),
          ...(data.price !== undefined ? { price: Number(data.price) } : {}),
          ...(data.discountPrice !== undefined
            ? { discountPrice: data.discountPrice ? Number(data.discountPrice) : null }
            : {}),
          ...(data.compareAtPrice !== undefined
            ? { compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null }
            : {}),
          ...(data.categoryId !== undefined ? { categoryId: Number(data.categoryId) } : {}),
          ...(data.brandId !== undefined ? { brandId: Number(data.brandId) } : {}),
          ...(data.productTypeId !== undefined
            ? { productTypeId: data.productTypeId ? Number(data.productTypeId) : null }
            : {}),
          ...(data.supplierId !== undefined
            ? { supplierId: data.supplierId ? Number(data.supplierId) : null }
            : {}),
          ...(data.images !== undefined ? { images: data.images } : {}),
          ...(data.featured !== undefined ? { featured: Boolean(data.featured) } : {}),
          ...(data.newArrival !== undefined ? { newArrival: Boolean(data.newArrival) } : {}),
          ...(data.bestSeller !== undefined ? { bestSeller: Boolean(data.bestSeller) } : {}),
        },
      });

      // 2. Sync dynamic attribute values if provided
      if (Array.isArray(data.attributeValues)) {
        await tx.productAttributeValue.deleteMany({ where: { productId: id } });
        for (const av of data.attributeValues) {
          if (av.attributeId && av.value !== undefined && av.value !== null && av.value !== '') {
            await tx.productAttributeValue.create({
              data: {
                productId: id,
                attributeId: Number(av.attributeId),
                value: typeof av.value === 'object' ? JSON.stringify(av.value) : String(av.value),
              },
            });
          }
        }
      }

      // 3. Sync Variants if provided
      if (Array.isArray(data.variants) && data.variants.length) {
        const seenHashes = new Set<string>();
        const incomingIds = data.variants.map((v: any) => v.id).filter(Boolean);

        // Delete removed variants that have no active orders
        const toDelete = existing.variants.filter((v) => !incomingIds.includes(v.id));
        for (const delVar of toDelete) {
          // Check if variant has order items
          const orderCount = await tx.orderItem.count({ where: { variantId: delVar.id } });
          if (orderCount > 0) {
            // Cannot hard-delete variant with order history; soft deactivate
            await tx.productVariant.update({
              where: { id: delVar.id },
              data: { isActive: false, stock: 0 },
            });
          } else {
            await tx.productVariant.delete({ where: { id: delVar.id } });
          }
        }

        // Upsert incoming variants
        for (let i = 0; i < data.variants.length; i++) {
          const v = data.variants[i];
          const combHash = ProductsService.generateCombinationHash(v.combination);

          if (seenHashes.has(combHash)) {
            throw new BadRequestException(`ترکیب ویژگی‌های تنوع تکراری است: (${combHash})`);
          }
          seenHashes.add(combHash);

          const newStock = Math.max(0, Number(v.stock) || 0);

          if (v.id) {
            // Update existing variant
            const oldVar = existing.variants.find((ev) => ev.id === v.id);
            const stockDelta = oldVar ? newStock - oldVar.stock : 0;

            await tx.productVariant.update({
              where: { id: v.id },
              data: {
                sku: v.sku?.trim() || `${existing.sku}-V${v.id}`,
                title: v.title || Object.values(v.combination || {}).join(' / '),
                combinationHash: combHash,
                combination: v.combination,
                price: Number(v.price) || updated.price,
                compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
                stock: newStock,
                image: v.image,
                weight: v.weight ? Number(v.weight) : null,
                isActive: v.isActive !== false,
              },
            });

            // Log movement if stock changed
            if (stockDelta !== 0 && oldVar) {
              await tx.inventoryMovement.create({
                data: {
                  variantId: v.id,
                  productId: id,
                  type:
                    stockDelta > 0
                      ? InventoryMovementType.MANUAL_ADJUSTMENT
                      : InventoryMovementType.MANUAL_ADJUSTMENT,
                  delta: stockDelta,
                  stockBefore: oldVar.stock,
                  stockAfter: newStock,
                  reason: 'تغییر دستی موجودی تنوع توسط ادمین در فرم ویرایش محصول',
                },
              });
            }
          } else {
            // Create new variant
            const variantSku = v.sku?.trim() || `${existing.sku}-V${Date.now().toString().slice(-4)}-${i + 1}`;
            const created = await tx.productVariant.create({
              data: {
                productId: id,
                sku: variantSku,
                title: v.title || Object.values(v.combination || {}).join(' / '),
                combinationHash: combHash,
                combination: v.combination,
                price: Number(v.price) || updated.price,
                compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
                stock: newStock,
                reservedQuantity: 0,
                image: v.image,
                weight: v.weight ? Number(v.weight) : null,
                isActive: v.isActive !== false,
              },
            });

            if (newStock > 0) {
              await tx.inventoryMovement.create({
                data: {
                  variantId: created.id,
                  productId: id,
                  type: InventoryMovementType.PURCHASE_RECEIPT,
                  delta: newStock,
                  stockBefore: 0,
                  stockAfter: newStock,
                  reason: 'موجودی اولیه تنوع جدید در زمان ویرایش',
                },
              });
            }
          }
        }
      }

      // Compute and sync total product stock
      const finalVariants = await tx.productVariant.findMany({
        where: { productId: id, isActive: true },
      });
      const totalStock = finalVariants.reduce((sum, v) => sum + v.stock, 0);

      await tx.product.update({
        where: { id },
        data: { stock: totalStock },
      });

      return tx.product.findUnique({
        where: { id },
        include: {
          variants: true,
          attributeValues: { include: { attribute: true } },
          category: true,
          brand: true,
          productType: true,
        },
      });
    });
  }

  async adjustVariantStock(variantId: number, delta: number, reason: string, userId?: number) {
    return this.prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({
        where: { id: variantId },
        include: { product: true },
      });

      if (!variant) {
        throw new NotFoundException('تنوع محصول یافت نشد');
      }

      const stockBefore = variant.stock;
      const stockAfter = Math.max(0, stockBefore + delta);
      const actualDelta = stockAfter - stockBefore;

      if (actualDelta === 0) {
        return variant;
      }

      const updated = await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: stockAfter },
      });

      await tx.inventoryMovement.create({
        data: {
          variantId,
          productId: variant.productId,
          type: actualDelta > 0 ? InventoryMovementType.PURCHASE_RECEIPT : InventoryMovementType.MANUAL_ADJUSTMENT,
          delta: actualDelta,
          stockBefore,
          stockAfter,
          reason: reason || 'تنظیم دستی موجودی توسط ادمین',
          userId,
        },
      });

      // Recalculate total product stock
      const allVars = await tx.productVariant.findMany({
        where: { productId: variant.productId, isActive: true },
      });
      const totalStock = allVars.reduce((sum, v) => sum + v.stock, 0);
      await tx.product.update({
        where: { id: variant.productId },
        data: { stock: totalStock },
      });

      return updated;
    });
  }

  async getInventoryMovements(productId: number, variantId?: number) {
    const where: Prisma.InventoryMovementWhereInput = {
      productId,
      ...(variantId ? { variantId } : {}),
    };

    return this.prisma.inventoryMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        variant: {
          select: { id: true, sku: true, title: true, combination: true },
        },
      },
    });
  }

  async delete(id: number) {
    const orderItemCount = await this.prisma.orderItem.count({
      where: { productId: id },
    });
    if (orderItemCount > 0) {
      throw new BadRequestException(
        `امکان حذف این محصول وجود ندارد زیرا در ${orderItemCount} ردیف سفارش ثبت شده است. به جای حذف، می‌توانید وضعیت آن را غیرفعال کنید.`,
      );
    }
    return this.prisma.product.delete({ where: { id } });
  }
}
