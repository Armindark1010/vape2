import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Username or Mobile Phone Number for the new account',
    example: '09123456789',
  })
  @IsNotEmpty({ message: 'نام کاربری یا شماره موبایل الزامی است' })
  @IsString()
  usernameOrMobile: string;

  @ApiProperty({
    description: 'Account password (minimum 6 characters)',
    example: 'Secret@1234',
  })
  @IsNotEmpty({ message: 'رمز عبور الزامی است' })
  @IsString()
  @MinLength(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' })
  password: string;

  @ApiPropertyOptional({
    description: 'Full name of the user',
    example: 'آرمین شریفی',
  })
  @IsOptional()
  @IsString()
  fullName?: string;
}
