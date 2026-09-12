import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New status for the order',
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
  })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
