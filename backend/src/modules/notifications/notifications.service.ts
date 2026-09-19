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

  /**
   * ثبت اشتراک «موجود شد خبرم کن» برای کاربر مهمان یا کاربر لاگین‌شده
   */
  async subscribe(
    productId: string,
    phoneNumber?: string,
    userId?: string,
  ) {
    // ۱. بررسی وجود کالا
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }

    // ۲. حل شماره موبایل (از کاربر یا پارامتر ورودی)
    let finalPhone = phoneNumber?.trim();
    if (!finalPhone && userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      finalPhone = user?.phoneNumber || undefined;
    }

    if (!finalPhone) {
      throw new BadRequestException('ارائه شماره موبایل جهت اطلاع‌رسانی الزامی است');
    }

    // نرمال‌سازی شماره همراه ایران
    if (finalPhone.startsWith('+98')) {
      finalPhone = '0' + finalPhone.slice(3);
    } else if (finalPhone.startsWith('0098')) {
      finalPhone = '0' + finalPhone.slice(4);
    }

    // ۳. بررسی عدم ثبت تکراری درخواست در وضعیت PENDING
    const existing = await this.prisma.productAlert.findFirst({
      where: {
        productId,
        phoneNumber: finalPhone,
        status: AlertStatus.PENDING,
      },
    });

    if (existing) {
      return {
        success: true,
        alreadySubscribed: true,
        message: 'درخواست اطلاع‌رسانی شما قبلاً برای این کالا ثبت شده است',
        alert: existing,
      };
    }

    // ۴. ایجاد رکورد اطلاع‌رسانی
    const alert = await this.prisma.productAlert.create({
      data: {
        productId,
        phoneNumber: finalPhone,
        userId: userId || null,
        status: AlertStatus.PENDING,
      },
    });

    this.logger.log(
      `[Restock Subscription] Phone ${finalPhone} subscribed to product ${product.title} (${productId})`,
    );

    return {
      success: true,
      alreadySubscribed: false,
      message: 'درخواست با موفقیت ثبت شد. به محض موجود شدن کالا به شما اطلاع داده خواهد شد.',
      alert,
    };
  }

  /**
   * استعلام آمار کاربران منتظر کالا برای نمایش در پنل ادمین
   */
  async getRestockStats(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, title: true, stock: true },
    });

    if (!product) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }

    const [pendingCount, notifiedCount] = await Promise.all([
      this.prisma.productAlert.count({
        where: { productId, status: AlertStatus.PENDING },
      }),
      this.prisma.productAlert.count({
        where: { productId, status: AlertStatus.NOTIFIED },
      }),
    ]);

    return {
      productId,
      productTitle: product.title,
      stock: product.stock,
      pendingCount,
      notifiedCount,
    };
  }

  /**
   * متد دستی ارسال پیامک اطلاع‌رسانی توسط ادمین از طریق پنل
   */
  async sendRestockSmsManual(productId: string, customMessage?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }

    // استخراج تمامی درخواست‌های منتظر پیامک
    const pendingAlerts = await this.prisma.productAlert.findMany({
      where: {
        productId,
        status: AlertStatus.PENDING,
      },
    });

    if (pendingAlerts.length === 0) {
      return {
        success: true,
        sentCount: 0,
        message: 'هیچ کاربر منتظری برای این محصول در وضعیت آماده‌باش وجود ندارد',
      };
    }

    const defaultMsg = `ویپ‌لب: کالای «${product.title}» که منتظرش بودید در انبار موجود شد!\nخرید سریع:\nvapelab.ir/product/${product.slug}`;
    const messageToSend = customMessage?.trim() || defaultMsg;

    let successfulSends = 0;
    const alertIdsToUpdate: string[] = [];

    // ارسال پیامک گروهی به کاربران
    for (const alert of pendingAlerts) {
      try {
        const res = await this.kavenegar.sendTextSms(alert.phoneNumber, messageToSend);
        if (res.success) {
          successfulSends++;
          alertIdsToUpdate.push(alert.id);
        }
      } catch (err: any) {
        this.logger.error(
          `Failed sending restock SMS to ${alert.phoneNumber}: ${err.message}`,
        );
      }
    }

    // بروزرسانی وضعیت درخواست‌ها به NOTIFIED
    if (alertIdsToUpdate.length > 0) {
      await this.prisma.productAlert.updateMany({
        where: { id: { in: alertIdsToUpdate } },
        data: {
          status: AlertStatus.NOTIFIED,
          notifiedAt: new Date(),
        },
      });
    }

    this.logger.log(
      `[Restock SMS Batch] Dispatched ${successfulSends}/${pendingAlerts.length} SMS for product "${product.title}"`,
    );

    return {
      success: true,
      sentCount: successfulSends,
      totalPending: pendingAlerts.length,
      message: `پیامک اطلاع‌رسانی با موفقیت برای ${successfulSends} کاربر ارسال شد.`,
    };
  }

  /**
   * دریافت لیست اشتراک‌های کاربر لاگین‌شده
   */
  async getMyAlerts(userId: string) {
    return this.prisma.productAlert.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: true,
            price: true,
            discountPrice: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * لغو درخواست اطلاع‌رسانی
   */
  async cancelAlert(alertId: string, userId?: string) {
    const where: any = { id: alertId };
    if (userId) where.userId = userId;

    const alert = await this.prisma.productAlert.findFirst({ where });
    if (!alert) {
      throw new NotFoundException('اشتراک مورد نظر یافت نشد');
    }

    return this.prisma.productAlert.update({
      where: { id: alertId },
      data: { status: AlertStatus.CANCELLED },
    });
  }
}
