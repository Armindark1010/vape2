import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const {
      category,
      brand,
      type,
      nicotineStrength,
      flavor,
      q,
      minPrice,
      maxPrice,
      inStock,
      featured,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = query;

    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.category = {
        OR: [{ slug: category }, { id: category }],
      };
    }

    if (brand) {
      where.OR = [
        { brand: { contains: brand, mode: 'insensitive' } },
        { brandSlug: { contains: brand, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (nicotineStrength) {
      where.nicotineStrength = nicotineStrength;
    }

    if (flavor) {
      where.flavorProfile = {
        has: flavor,
      };
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (inStock) {
      where.stock = { gt: 0 };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Determine sorting order
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (sort === 'popular') {
      orderBy = { reviewCount: 'desc' };
    }

    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug '${slug}' not found`);
    }

    // Find related products in same category
    const relatedProducts = await this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });

    return {
      ...product,
      relatedProducts,
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException(
        `Product with slug '${dto.slug}' already exists`,
      );
    }

    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BadRequestException(
        `Category with ID '${dto.categoryId}' not found`,
      );
    }

    const brandSlug =
      dto.brandSlug ||
      dto.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return this.prisma.product.create({
      data: {
        ...dto,
        brandSlug,
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getFilters() {
    const [categories, brandsRaw, flavorsRaw, nicStrengthsRaw] =
      await Promise.all([
        this.prisma.category.findMany({
          select: { id: true, name: true, slug: true },
        }),
        this.prisma.product.findMany({
          select: { brand: true, brandSlug: true },
          distinct: ['brand'],
        }),
        this.prisma.product.findMany({
          select: { flavorProfile: true },
        }),
        this.prisma.product.findMany({
          select: { nicotineStrength: true },
          distinct: ['nicotineStrength'],
        }),
      ]);

    const uniqueFlavors = Array.from(
      new Set(flavorsRaw.flatMap((p) => p.flavorProfile)),
    ).filter(Boolean);

    const uniqueNicotine = Array.from(
      new Set(nicStrengthsRaw.map((p) => p.nicotineStrength)),
    ).filter(Boolean);

    return {
      categories,
      brands: brandsRaw,
      flavors: uniqueFlavors,
      nicotineStrengths: uniqueNicotine,
    };
  }
}
