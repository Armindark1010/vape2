import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  SendRestockSmsDto,
  SubscribeRestockDto,
} from './dto/notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications & Restock Alerts (اطلاع‌رسانی موجودی)')
@Controller(['api/v1', ''])
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * ثبت درخواست اطلاع‌رسانی بازگشت به موجودی برای کالا
   */
  @Post('products/:id/notify-me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'ثبت درخواست «موجود شد خبرم کن» (کاربر مهمان یا کاربر لاگین‌شده)',
    description:
      'در صورت ارسال توکن احراز هویت، شماره کاربر از حساب دریافت می‌شود؛ برای کاربران مهمان شماره موبایل از Body دریافت می‌گردد.',
  })
  @ApiParam({
    name: 'id',
    description: 'شناسه محصول (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'درخواست اطلاع‌رسانی با موفقیت ثبت شد',
  })
  async subscribeRestock(
    @Param('id', ParseUUIDPipe) productId: string,
    @Body() dto: SubscribeRestockDto,
    @Req() req: any,
  ) {
    // استخراج اختیاری کاربر از توکن در صورت وجود
    const user = req.user as User | undefined;
    return this.notificationsService.subscribe(
      productId,
      dto.phoneNumber,
      user?.id,
    );
  }

  /**
   * دریافت لیست کالاهای تحت اشتراک کاربر لاگین‌شده
   */
  @Get('notifications/my-alerts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'مشاهده لیست درخواست‌های اطلاع‌رسانی کالا برای کاربر لاگین‌شده',
  })
  async getMyAlerts(@CurrentUser() user: User) {
    return this.notificationsService.getMyAlerts(user.id);
  }

  /**
   * لغو اشتراک اطلاع‌رسانی یک کالا
   */
  @Delete('notifications/alerts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'لغو یک درخواست اطلاع‌رسانی موجودی' })
  async cancelAlert(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) alertId: string,
  ) {
    return this.notificationsService.cancelAlert(alertId, user.id);
  }

  /**
   * دریافت آمار کاربران منتظر کالا جهت نمایش در پنل ادمین
   */
  @Get('admin/notifications/stats/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'استعلام آمار کاربران منتظر اطلاع‌رسانی برای یک محصول (Admin only)',
  })
  async getRestockStats(
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.notificationsService.getRestockStats(productId);
  }

  /**
   * ارسال دستی پیامک‌های اطلاع‌رسانی موجودی توسط ادمین
   */
  @Post('admin/notifications/send-restock-sms/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'ارسال دستی و گروهی پیامک کاوه‌نگار برای تمامی کاربران منتظر این کالا (Admin only)',
  })
  async sendRestockSms(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: SendRestockSmsDto,
  ) {
    return this.notificationsService.sendRestockSmsManual(
      productId,
      dto.customMessage,
    );
  }
}
