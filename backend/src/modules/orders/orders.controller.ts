import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new order from cart items' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient stock or invalid product IDs' })
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(user, dto);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Get list of orders for the currently authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user orders returned' })
  async getMyOrders(@CurrentUser() user: User) {
    return this.ordersService.getMyOrders(user.id);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Get all store orders with pagination (Admin / Operator)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Paginated orders list' })
  async findAllAdmin(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.ordersService.findAllAdmin(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific order by ID' })
  @ApiResponse({ status: 200, description: 'Order details' })
  @ApiResponse({ status: 403, description: 'Forbidden (Not user order and not admin)' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.findById(id, user);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Update order status (Admin / Operator)' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
