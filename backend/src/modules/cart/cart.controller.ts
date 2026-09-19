import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { Throttle } from '@nestjs/throttler';
import {
  AddToCartDto,
  RevalidateCartDto,
  UpdateCartItemDto,
} from './dto/cart.dto';

@ApiTags('Cart (سبد خرید)')
@Controller(['api/v1/cart', 'cart'])
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * استعلام و بازاعتبارسنجی قیمت و موجودی سبد خرید کاربران مهمان (بدون نیاز به احراز هویت)
   */
  @Post('revalidate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'استعلام و اعتبارسنجی لحظه‌ای قیمت و موجودی سبد خرید مهمان (Guest Cart Revalidation)',
    description:
      'این اندپوینت لیست آیتم‌های سبد خرید کاربر مهمان را دریافت کرده و بر اساس اطلاعات به‌روز دیتابیس، قیمت، تخفیف، موجودی انبار و هشدارهای مربوطه را محاسبه می‌کند.',
  })
  @ApiResponse({
    status: 200,
    description: 'سبد خرید با موفقیت بررسی و محاسبه شد',
  })
  @ApiResponse({
    status: 400,
    description: 'داده‌های ورودی نامعتبر است',
  })
  async revalidateGuestCart(@Body() dto: RevalidateCartDto) {
    return this.cartService.revalidateGuestCart(dto.items);
  }

  /**
   * دریافت سبد خرید کاربر لاگین‌شده با محاسبه زنده قیمت‌ها و تخفیف‌ها
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'دریافت سبد خرید کاربر لاگین‌شده با آخرین قیمت‌ها و موجودی انبار',
    description:
      'سبد خرید کاربر از دیتابیس واکشی شده و قیمت‌ها و وضعیت موجودی کالاها به صورت آنی با دیتابیس Revalidate می‌شوند.',
  })
  @ApiResponse({
    status: 200,
    description: 'سبد خرید کاربر با موفقیت دریافت شد',
  })
  @ApiResponse({
    status: 401,
    description: 'کاربر احراز هویت نشده است',
  })
  async getUserCart(@CurrentUser() user: User) {
    return this.cartService.getUserCart(user.id);
  }

  /**
   * افزودن کالا به سبد خرید کاربر
   */
  @Post('items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'افزودن محصول به سبد خرید کاربر لاگین‌شده',
    description:
      'محصول مورد نظر را با بررسی کنترل موجودی به سبد خرید اضافه می‌کند. در صورت وجود قبلی، تعداد افزایش می‌یابد.',
  })
  @ApiResponse({
    status: 201,
    description: 'کالا با موفقیت به سبد خرید اضافه شد',
  })
  @ApiResponse({
    status: 400,
    description: 'موجودی انبار کافی نیست یا داده‌ها نامعتبرند',
  })
  @ApiResponse({
    status: 404,
    description: 'محصول یافت نشد',
  })
  async addToCart(
    @CurrentUser() user: User,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addToCart(user.id, dto);
  }

  /**
   * ویرایش تعداد یک آیتم در سبد خرید
   */
  @Patch('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'ویرایش تعداد یک کالا در سبد خرید کاربر',
    description: 'تعداد آیتم سبد خرید را با بررسی کنترل موجودی انبار بروزرسانی می‌کند.',
  })
  @ApiParam({
    name: 'id',
    description: 'شناسه آیتم سبد خرید (CartItem UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'تعداد آیتم با موفقیت بروزرسانی شد',
  })
  @ApiResponse({
    status: 400,
    description: 'تعداد درخواستی بیشتر از موجودی انبار است',
  })
  @ApiResponse({
    status: 404,
    description: 'آیتم در سبد خرید یافت نشد',
  })
  async updateItemQuantity(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(user.id, itemId, dto.quantity);
  }

  /**
   * حذف یک آیتم مشخص از سبد خرید
   */
  @Delete('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'حذف یک کالا از سبد خرید کاربر',
    description: 'آیتم مورد نظر را از سبد خرید حذف کرده و سبد به‌روزشده را برمی‌گرداند.',
  })
  @ApiParam({
    name: 'id',
    description: 'شناسه آیتم سبد خرید (CartItem UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'کالا از سبد خرید حذف شد',
  })
  @ApiResponse({
    status: 404,
    description: 'آیتم در سبد خرید یافت نشد',
  })
  async removeItem(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) itemId: string,
  ) {
    return this.cartService.removeItem(user.id, itemId);
  }

  /**
   * خالی کردن کامل سبد خرید کاربر
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'خالی کردن کامل سبد خرید کاربر',
    description: 'تمام کالاهای موجود در سبد خرید کاربر را به صورت یکجا حذف می‌کند.',
  })
  @ApiResponse({
    status: 200,
    description: 'سبد خرید با موفقیت خالی شد',
  })
  async clearCart(@CurrentUser() user: User) {
    return this.cartService.clearCart(user.id);
  }
}
