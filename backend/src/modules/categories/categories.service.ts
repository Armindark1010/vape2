import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { id: 'asc' },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      featured: cat.featured,
      productCount: cat._count.products,
    }));
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }

    return {
      ...category,
      productCount: category._count.products,
    };
  }

  async findById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    return {
      ...category,
      productCount: category._count.products,
    };
  }

  async create(data: {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
    featured?: boolean;
  }) {
    if (!data.name) throw new BadRequestException('نام دسته‌بندی الزامی است');
    const slug = data.slug?.trim() || data.name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');

    return this.prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        image: data.image || null,
        featured: data.featured ?? true,
      },
    });
  }

  async update(id: number, data: any) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('دسته‌بندی یافت نشد');

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        description: data.description !== undefined ? data.description : category.description,
        image: data.image !== undefined ? data.image : category.image,
        featured: data.featured !== undefined ? Boolean(data.featured) : category.featured,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
