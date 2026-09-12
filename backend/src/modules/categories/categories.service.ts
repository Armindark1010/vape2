import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
      orderBy: { createdAt: 'desc' },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      productCount: cat._count.products,
      createdAt: cat.createdAt,
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

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException(
        `Category with slug '${dto.slug}' already exists`,
      );
    }

    return this.prisma.category.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findById(id);

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findById(id);

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
