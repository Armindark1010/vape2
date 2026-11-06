import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActive() {
    return this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.banner.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async create(data: {
    title: string;
    subtitle?: string;
    imageUrl: string;
    linkUrl?: string;
    badge?: string;
    isActive?: boolean;
    displayOrder?: number;
  }) {
    return this.prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
        badge: data.badge,
        isActive: data.isActive ?? true,
        displayOrder: data.displayOrder ?? 0,
      },
    });
  }

  async update(id: number, data: any) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('بنر یافت نشد');

    return this.prisma.banner.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.banner.delete({ where: { id } });
  }
}

