import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AlertStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { KavenegarService } from '../auth/kavenegar.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly kavenegar: KavenegarService,
  ) {}

  async subscribe(
    productId: number | string,
    phoneNumber?: string,
    userId?: number,
  ) {
    const pid = Number(productId);
    const product = await this.prisma.product.findUnique({
      where: { id: pid },
    });

    if (!product) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }

    let finalPhone = phoneNumber?.trim();
    if (!finalPhone && userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      finalPhone = user?.phone || undefined;
    }

    if (!finalPhone) {
      throw new BadRequestException('ارائه شماره موبایل جهت اطلاع‌رسانی الزامی است');
    }

    if (finalPhone.startsWith('+98')) {
      finalPhone = '0' + finalPhone.slice(3);
    } else if (finalPhone.startsWith('0098')) {
      finalPhone = '0' + finalPhone.slice(4);
    }

    const existingAlert = await this.prisma.productAlert.findFirst({
      where: {
        productId: pid,
        phoneNumber: finalPhone,
        status: AlertStatus.PENDING,
      },
    });

    if (existingAlert) {
      return {
        success: true,
        message: 'درخواست اطلاع‌رسانی شما از قبل برای این محصول ثبت شده است',
        alreadySubscribed: true,
      };
    }

    await this.prisma.productAlert.create({
      data: {
        productId: pid,
        userId: userId ? Number(userId) : null,
        phoneNumber: finalPhone,
        status: AlertStatus.PENDING,
      },
    });

    return {
      success: true,
      message: `درخواست اطلاع‌رسانی با موفقیت ثبت شد. به محض موجود شدن ${product.name}، پیامک دریافت خواهید کرد.`,
      alreadySubscribed: false,
    };
  }

  async getMyAlerts(userId: number) {
    return this.prisma.productAlert.findMany({
      where: { userId: Number(userId) },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stock: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancelAlert(alertId: number, userId: number) {
    const alert = await this.prisma.productAlert.findFirst({
      where: { id: Number(alertId), userId: Number(userId) },
    });

    if (!alert) {
      throw new NotFoundException('درخواست اطلاع‌رسانی یافت نشد');
    }

    await this.prisma.productAlert.update({
      where: { id: alert.id },
      data: { status: AlertStatus.CANCELLED },
    });

    return { success: true, message: 'درخواست اطلاع‌رسانی با موفقیت لغو شد' };
  }

  async getRestockStats(productId: number) {
    const pid = Number(productId);
    const count = await this.prisma.productAlert.count({
      where: { productId: pid, status: AlertStatus.PENDING },
    });

    return {
      productId: pid,
      pendingAlertsCount: count,
    };
  }

  async sendRestockSmsManual(productId: number, customMessage?: string) {
    const pid = Number(productId);
    const product = await this.prisma.product.findUnique({
      where: { id: pid },
    });

    if (!product) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }

    const pendingAlerts = await this.prisma.productAlert.findMany({
      where: { productId: pid, status: AlertStatus.PENDING },
    });

    if (pendingAlerts.length === 0) {
      return { success: true, count: 0, message: 'هیچ درخواست در انتظاری برای این کالا وجود ندارد.' };
    }

    let successCount = 0;
    const defaultMsg = `مشتری گرامی، کالای "${product.name}" در فروشگاه ویپ‌لب موجود شد. جهت خرید به سایت مراجعه فرمایید.\nلینک: https://vapelab.ir/products/${product.slug}`;
    const textToSend = customMessage?.trim() || defaultMsg;

    for (const alert of pendingAlerts) {
      try {
        await this.kavenegar.sendTextSms(alert.phoneNumber, textToSend);
        await this.prisma.productAlert.update({
          where: { id: alert.id },
          data: {
            status: AlertStatus.NOTIFIED,
            notifiedAt: new Date(),
          },
        });
        successCount++;
      } catch (err) {
        this.logger.error(`Error sending restock SMS to ${alert.phoneNumber}: ${err.message}`);
      }
    }

    return {
      success: true,
      totalAlerts: pendingAlerts.length,
      sentCount: successCount,
      message: `پیامک به ${successCount} نفر از مشتریان با موفقیت ارسال شد.`,
    };
  }
}
