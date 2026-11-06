import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface CreateProductTypeDto {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  attributes?: CreateAttributeDto[];
}

export interface CreateAttributeDto {
  name: string;
  code: string;
  type?: string;
  isRequired?: boolean;
  isVariant?: boolean;
  isVisible?: boolean;
  displayOrder?: number;
  options?: any;
  unit?: string;
}

@Injectable()
export class ProductTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.productType.findMany({
      orderBy: { id: 'asc' },
      include: {
        attributes: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findByIdOrSlug(idOrSlug: string) {
    const isNum = !isNaN(Number(idOrSlug));
    const type = await this.prisma.productType.findFirst({
      where: isNum ? { id: Number(idOrSlug) } : { slug: idOrSlug },
      include: {
        attributes: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!type) {
      throw new NotFoundException(`Product type '${idOrSlug}' not found`);
    }

    return type;
  }

  async create(dto: CreateProductTypeDto) {
    if (!dto.name) {
      throw new BadRequestException('نام نوع محصول الزامی است');
    }

    const slug =
      dto.slug?.trim() ||
      dto.name
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-');

    const existing = await this.prisma.productType.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new BadRequestException(`نوع محصول با شناسه ${slug} از قبل وجود دارد`);
    }

    return this.prisma.productType.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description || '',
        icon: dto.icon || 'tag',
        attributes: dto.attributes?.length
          ? {
              create: dto.attributes.map((attr, idx) => ({
                name: attr.name,
                code: attr.code || `attr_${Date.now()}_${idx}`,
                type: attr.type || 'select',
                isRequired: Boolean(attr.isRequired),
                isVariant: Boolean(attr.isVariant),
                isVisible: attr.isVisible !== false,
                displayOrder: attr.displayOrder ?? idx + 1,
                options: attr.options || null,
                unit: attr.unit || null,
              })),
            }
          : undefined,
      },
      include: {
        attributes: { orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  async update(id: number, dto: Partial<CreateProductTypeDto>) {
    const existing = await this.prisma.productType.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`نوع محصول یافت نشد`);
    }

    return this.prisma.productType.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        icon: dto.icon,
      },
      include: {
        attributes: { orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  async delete(id: number) {
    const productCount = await this.prisma.product.count({
      where: { productTypeId: id },
    });
    if (productCount > 0) {
      throw new BadRequestException(
        `امکان حذف این نوع محصول وجود ندارد زیرا ${productCount} کالا به آن اختصاص دارد`,
      );
    }

    return this.prisma.productType.delete({ where: { id } });
  }

  async addAttribute(typeId: number, dto: CreateAttributeDto) {
    if (!dto.name || !dto.code) {
      throw new BadRequestException('نام و کد سیستمی ویژگی الزامی است');
    }

    const cleanCode = dto.code.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const existing = await this.prisma.productAttribute.findUnique({
      where: {
        productTypeId_code: {
          productTypeId: typeId,
          code: cleanCode,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(`ویژگی با کد '${cleanCode}' برای این نوع محصول وجود دارد`);
    }

    return this.prisma.productAttribute.create({
      data: {
        productTypeId: typeId,
        name: dto.name,
        code: cleanCode,
        type: dto.type || 'select',
        isRequired: Boolean(dto.isRequired),
        isVariant: Boolean(dto.isVariant),
        isVisible: dto.isVisible !== false,
        displayOrder: dto.displayOrder || 0,
        options: dto.options || null,
        unit: dto.unit || null,
      },
    });
  }

  async updateAttribute(attrId: number, dto: Partial<CreateAttributeDto>) {
    return this.prisma.productAttribute.update({
      where: { id: attrId },
      data: {
        name: dto.name,
        type: dto.type,
        isRequired: dto.isRequired !== undefined ? Boolean(dto.isRequired) : undefined,
        isVariant: dto.isVariant !== undefined ? Boolean(dto.isVariant) : undefined,
        isVisible: dto.isVisible !== undefined ? Boolean(dto.isVisible) : undefined,
        displayOrder: dto.displayOrder,
        options: dto.options !== undefined ? dto.options : undefined,
        unit: dto.unit,
      },
    });
  }

  async deleteAttribute(attrId: number) {
    return this.prisma.productAttribute.delete({ where: { id: attrId } });
  }
}

