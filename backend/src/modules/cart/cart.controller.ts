import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';

@ApiTags('Cart')
@Controller(['api/v1/cart', 'cart'])
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('revalidate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revalidate cart items against current database stock & prices' })
  @ApiResponse({ status: 200, description: 'Cart evaluated successfully' })
  async revalidateGuestCart(@Body() body: { items: any[] }) {
    return this.cartService.revalidateGuestCart(body.items || []);
  }
}
