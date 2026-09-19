import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class SubscribeRestockDto {
  @ApiPropertyOptional({
    description: 'شماره موبایل جهت اطلاع‌رسانی پیامکی (الزامی برای کاربر مهمان)',
    example: '09123456789',
  })
  @IsOptional()
  @IsString({ message: 'شماره موبایل باید یک رشته متنی باشد' })
  @Matches(/^09[0-9]{9}$/, {
    message: 'شماره موبایل نامعتبر است (الگوی صحیح: 09123456789)',
  })
  phoneNumber?: string;
}

export class SendRestockSmsDto {
  @ApiPropertyOptional({
    description: 'متن پیامک سفارشی (اختیاری)',
    example: 'محصول محبوب ELFBAR TE6000 در فروشگاه ویپ‌لب شارژ شد!',
  })
  @IsOptional()
  @IsString()
  customMessage?: string;
}
