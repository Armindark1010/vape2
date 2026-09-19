import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

/**
 * DTO for User Registration with password (OWASP ASVS compliant password policy)
 */
export class RegisterDto {
  @ApiProperty({
    description: 'Username or Iranian Mobile Phone Number',
    example: '09123456789',
  })
  @IsNotEmpty({ message: 'نام کاربری یا شماره موبایل الزامی است' })
  @IsString({ message: 'شناسه کاربری باید به صورت متنی باشد' })
  usernameOrMobile: string;

  @ApiProperty({
    description: 'Password (minimum 8 characters, must contain letters and numbers)',
    example: 'VapeLab@2026',
  })
  @IsNotEmpty({ message: 'رمز عبور الزامی است' })
  @IsString({ message: 'رمز عبور باید به صورت متنی باشد' })
  @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'رمز عبور باید ترکیبی از حداقل یک حرف انگلیسی و یک رقم باشد',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Full name of the user',
    example: 'آرمین شریفی',
  })
  @IsOptional()
  @IsString({ message: 'نام و نام خانوادگی باید به صورت متنی باشد' })
  fullName?: string;
}

/**
 * DTO for Login with Username/Mobile and Password
 */
export class LoginWithPasswordDto {
  @ApiProperty({
    description: 'Username or Mobile Phone Number',
    example: '09123456789',
  })
  @IsNotEmpty({ message: 'نام کاربری یا شماره موبایل الزامی است' })
  @IsString({ message: 'شناسه کاربری باید به صورت متنی باشد' })
  usernameOrMobile: string;

  @ApiProperty({
    description: 'Account Password',
    example: 'VapeLab@2026',
  })
  @IsNotEmpty({ message: 'رمز عبور الزامی است' })
  @IsString({ message: 'رمز عبور باید به صورت متنی باشد' })
  password: string;
}

/**
 * DTO for requesting OTP SMS delivery
 */
export class SendOtpDto {
  @ApiPropertyOptional({
    description: 'Mobile phone number (Iranian format e.g. 09123456789)',
    example: '09123456789',
  })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional({
    description: 'Alternative alias for mobile number',
    example: '09123456789',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  get targetPhone(): string {
    const val = (this.mobile || this.phoneNumber || '').trim();
    return val;
  }
}

/**
 * DTO for verifying OTP code
 */
export class VerifyOtpDto {
  @ApiPropertyOptional({
    description: 'Mobile phone number',
    example: '09123456789',
  })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional({
    description: 'Alternative alias for mobile number',
    example: '09123456789',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: '5-digit verification code (or Master OTP: 11111)',
    example: '11111',
  })
  @IsNotEmpty({ message: 'کد تأیید ۵ رقمی الزامی است' })
  @IsString({ message: 'کد تأیید باید متنی باشد' })
  code: string;

  get targetPhone(): string {
    const val = (this.mobile || this.phoneNumber || '').trim();
    return val;
  }
}
