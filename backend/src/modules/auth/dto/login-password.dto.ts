import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginWithPasswordDto {
  @ApiProperty({
    description: 'Username or Mobile Phone Number',
    example: '09123456789',
  })
  @IsNotEmpty({ message: 'نام کاربری یا شماره موبایل الزامی است' })
  @IsString()
  usernameOrMobile: string;

  @ApiProperty({
    description: 'Account password',
    example: 'Secret@1234',
  })
  @IsNotEmpty({ message: 'رمز عبور الزامی است' })
  @IsString()
  password: string;
}
