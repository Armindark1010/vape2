import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    description: 'User mobile phone number for OTP delivery',
    example: '09123456789',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

