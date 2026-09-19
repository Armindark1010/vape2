import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CartItemDto {
  @ApiPropertyOptional({
    description: 'شناسه تنوع یا شناسه محصول (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'شناسه محصول/تنوع باید یک UUID معتبر باشد' })
  variantId?: string;

  @ApiPropertyOptional({
    description: 'شناسه محصول (در صورت عدم ارسال variantId)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'شناسه محصول باید یک UUID معتبر باشد' })
  productId?: string;

  @ApiProperty({
    description: 'تعداد درخواستی (حداقل ۱)',
    example: 2,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'تعداد الزامی است' })
  @Type(() => Number)
  @IsInt({ message: 'تعداد باید عدد صحیح باشد' })
  @Min(1, { message: 'تعداد باید حداقل ۱ باشد' })
  quantity: number;

  @ApiPropertyOptional({
    description: 'طعم انتخاب شده محصول (اختیاری)',
    example: 'Mango Ice',
  })
  @IsOptional()
  @IsString()
  flavor?: string;

  @ApiPropertyOptional({
    description: 'میزان نیکوتین انتخاب شده (اختیاری)',
    example: '20mg',
  })
  @IsOptional()
  @IsString()
  nicotine?: string;
}

export class RevalidateCartDto {
  @ApiProperty({
    description: 'لیست آیتم‌های سبد خرید کاربر مهمان جهت بازاعتبارسنجی قیمت و موجودی',
    type: [CartItemDto],
  })
  @IsArray({ message: 'لیست آیتم‌ها باید آرایه‌ای از کالاها باشد' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}

export class AddToCartDto {
  @ApiPropertyOptional({
    description: 'شناسه تنوع محصول (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'شناسه تنوع باید یک UUID معتبر باشد' })
  variantId?: string;

  @ApiPropertyOptional({
    description: 'شناسه محصول (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'شناسه محصول باید یک UUID معتبر باشد' })
  productId?: string;

  @ApiProperty({
    description: 'تعداد کالا برای افزودن به سبد',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'تعداد الزامی است' })
  @Type(() => Number)
  @IsInt({ message: 'تعداد باید عدد صحیح باشد' })
  @Min(1, { message: 'تعداد باید حداقل ۱ باشد' })
  quantity: number;

  @ApiPropertyOptional({
    description: 'طعم انتخابی (اختیاری)',
    example: 'Watermelon Ice',
  })
  @IsOptional()
  @IsString()
  flavor?: string;

  @ApiPropertyOptional({
    description: 'درصد یا میزان نیکوتین (اختیاری)',
    example: '50mg',
  })
  @IsOptional()
  @IsString()
  nicotine?: string;
}

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'تعداد جدید آیتم سبد خرید (حداقل ۱)',
    example: 3,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'تعداد الزامی است' })
  @Type(() => Number)
  @IsInt({ message: 'تعداد باید عدد صحیح باشد' })
  @Min(1, { message: 'تعداد باید حداقل ۱ باشد' })
  quantity: number;
}
