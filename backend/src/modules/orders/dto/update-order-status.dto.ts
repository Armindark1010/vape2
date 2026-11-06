import { ApiProperty } from '@nestjs/swagger';
import { order_status } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New status for the order',
    enum: order_status,
    example: order_status.processing,
  })
  @IsNotEmpty()
  @IsEnum(order_status)
  status: order_status;
}
