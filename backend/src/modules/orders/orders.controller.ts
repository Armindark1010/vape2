import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { order_status, Role, User } from '@prisma/client';
import { OrdersService, CreateOrderInput } from './orders.service';
import { PaymentsService } from '../payments/payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Orders')
@Controller(['api/v1/orders', 'api/orders', 'orders', 'api/checkout', 'api/v1/checkout'])
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get order by number (Invoice/Public View)' })
  async findByQuery(@Query('number') number?: string) {
    if (!number) {
      throw new BadRequestException('شماره سفارش الزامی است');
    }
    return this.ordersService.findByNumber(number);
  }

  @Get('track')
  @ApiOperation({ summary: 'Track order by number, tracking code, or phone' })
  async trackOrder(@Query('q') query?: string) {
    if (!query) {
      throw new BadRequestException('عبارت رهگیری الزامی است');
    }
    return this.ordersService.trackOrder(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an order with active reservation (Mandatory User Auth)' })
  async create(@CurrentUser() user: User, @Body() body: any) {
    const rawItems = body.items || [];
    const items = rawItems.map((i: any) => ({
      productId: Number(i.productId || i.id),
      qty: Number(i.qty || i.quantity || 1),
      flavor: i.flavor || i.color,
      nicotine: i.nicotine,
    }));

    const reservationToken = body.reservationToken || body.reservationId;
    const shippingAddress = body.shippingAddress || (body.customer ? {
      line1: body.customer.line1 || body.customer.address,
      line2: body.customer.line2,
      city: body.customer.city,
      zip: body.customer.zip || body.customer.postalCode,
      country: body.customer.country || 'Iran',
    } : undefined);

    const orderRes = await this.ordersService.create(user, {
      items,
      reservationToken,
      shippingAddress,
      couponCode: body.couponCode,
    });

    let paymentUrl: string | undefined;
    if (body.paymentMethod === 'online' || body.paymentMethod === undefined) {
      try {
        const payRes = await this.paymentsService.requestPayment(orderRes.number);
        paymentUrl = payRes.paymentUrl;
      } catch (err: any) {
        paymentUrl = `/payment/gateway?order=${orderRes.number}`;
      }
    }

    return {
      ...orderRes,
      paymentUrl,
    };
  }

  @Post(':id/payment/initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate payment for an order' })
  async initiatePayment(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.initiatePayment(user, Number(id));
  }

  @Post(':id/payment/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify payment and commit inventory atomically' })
  async verifyPayment(
    @Param('id') id: string,
    @Body() body: { idempotencyKey: string; gatewayRef?: string },
  ) {
    return this.ordersService.verifyPayment(Number(id), body.idempotencyKey, body.gatewayRef);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current customer order history' })
  async getMyOrders(@CurrentUser() user: User) {
    return this.ordersService.getMyOrders(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order details by ID' })
  async findById(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.findById(Number(id), user);
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin list all orders' })
  async findAllAdmin(@Query('status') status?: string) {
    return this.ordersService.findAllAdmin(status);
  }

  @Patch('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update order status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: order_status; trackingCode?: string; courier?: string },
  ) {
    return this.ordersService.updateStatus(Number(id), body.status, body.trackingCode, body.courier);
  }
}
