import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'User mobile phone number that received the OTP',
    example: '09123456789',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: '5-digit OTP verification code',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 5, { message: 'OTP must be exactly 5 digits' })
  code: string;
}

