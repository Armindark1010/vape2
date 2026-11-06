import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StorefrontService {
  constructor(private readonly prisma: PrismaService) {}

  async getAddresses(userId?: number) {
    if (!userId) return [];
    return this.prisma.address.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAddress(userId: number, data: any) {
    if (!userId) {
      throw new BadRequestException('کاربر باید مشخص باشد');
    }

    const addr = await this.prisma.address.create({
      data: {
        userId: Number(userId),
        label: data.label || 'Home',
        line1: data.line1 || data.address || '',
        line2: data.line2 || null,
        city: data.city || 'تهران',
        zip: data.zip || data.postalCode || '1234567890',
        country: data.country || 'Iran',
      },
    });

    return { success: true, data: addr, message: 'آدرس با موفقیت ثبت شد' };
  }

  async updateAddress(id: number, data: any) {
    const addr = await this.prisma.address.findUnique({ where: { id: Number(id) } });
    if (!addr) throw new NotFoundException('آدرس یافت نشد');

    const updated = await this.prisma.address.update({
      where: { id: Number(id) },
      data: {
        ...(data.label && { label: data.label }),
        ...(data.line1 && { line1: data.line1 }),
        ...(data.line2 !== undefined && { line2: data.line2 }),
        ...(data.city && { city: data.city }),
        ...(data.zip && { zip: data.zip }),
      },
    });

    return { success: true, data: updated };
  }

  async deleteAddress(id: number) {
    await this.prisma.address.delete({ where: { id: Number(id) } });
    return { success: true };
  }

  async validateCoupon(code: string) {
    if (!code) throw new BadRequestException('کد تخفیف ارسال نشده است');

    const cleanCode = code.trim().toUpperCase();
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.active) {
      throw new NotFoundException('کد تخفیف معتبر نیست یا منقضی شده است');
    }

    if (coupon.validUntil && coupon.validUntil < new Date()) {
      throw new BadRequestException('مهلت استفاده از این کد تخفیف به پایان رسیده است');
    }

    return {
      coupon: {
        code: coupon.code,
        description: coupon.description,
        percent: coupon.percent,
        fixed: coupon.fixed,
        minSubtotal: coupon.minSubtotal,
      },
    };
  }

  async addReview(data: any) {
    if (!data.productId || !data.rating || !data.body || !data.author) {
      throw new BadRequestException('اطلاعات نظر ناقص است');
    }

    const review = await this.prisma.review.create({
      data: {
        productId: Number(data.productId),
        author: data.author,
        rating: Math.min(5, Math.max(1, Number(data.rating))),
        title: data.title || null,
        body: data.body,
      },
    });

    return { success: true, review };
  }

  async subscribeNewsletter(email: string) {
    if (!email || !email.includes('@')) {
      throw new BadRequestException('ایمیل نامعتبر است');
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await this.prisma.subscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return { success: true, message: 'شما قبلاً در خبرنامه عضو شده‌اید' };
    }

    await this.prisma.subscriber.create({
      data: { email: cleanEmail },
    });

    return { success: true, message: 'عضویت شما در خبرنامه ویپ‌لب با موفقیت ثبت شد' };
  }

  async saveContactMessage(data: any) {
    if (!data.name || !data.email || !data.message) {
      throw new BadRequestException('تکمیل تمامی فیلدها الزامی است');
    }

    const contact = await this.prisma.contactMessage.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        message: data.message.trim(),
      },
    });

    return { success: true, id: contact.id, message: 'پیام شما دریافت شد. به زودی با شما تماس خواهیم گرفت.' };
  }
}

