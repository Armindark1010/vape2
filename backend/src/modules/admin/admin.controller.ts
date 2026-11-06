import {
  Body,
  Controller,
  Delete,
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
import { order_status, Role } from '@prisma/client';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin Panel API')
@Controller(['api/v1/admin', 'api/admin', 'admin'])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Admin dashboard KPI statistics' })
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('customers')
  @ApiOperation({ summary: 'Admin list all customer accounts with spend metrics' })
  async getCustomers() {
    return this.adminService.getCustomers();
  }

  @Get('orders')
  @ApiOperation({ summary: 'Admin list orders with customer & items details' })
  async getOrders(@Query('status') status?: string) {
    return this.adminService.getOrders(status);
  }

  @Patch('orders')
  @ApiOperation({ summary: 'Admin update order status and shipment tracking' })
  async updateOrder(
    @Body() body: { id: number; status: order_status; trackingCode?: string; courier?: string },
  ) {
    return this.adminService.updateOrder(body);
  }

  @Get('banners')
  @ApiOperation({ summary: 'Admin list all banners' })
  async getBanners() {
    return this.adminService.getBanners();
  }

  @Post('banners')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin create storefront banner' })
  async createBanner(@Body() body: any) {
    return this.adminService.createBanner(body);
  }

  @Patch('banners')
  @ApiOperation({ summary: 'Admin update storefront banner' })
  async updateBanner(@Body() body: any) {
    return this.adminService.updateBanner(body.id, body);
  }

  @Patch('banners/:id')
  @ApiOperation({ summary: 'Admin update storefront banner by ID' })
  async updateBannerById(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateBanner(Number(id), body);
  }

  @Delete('banners/:id')
  @ApiOperation({ summary: 'Admin delete storefront banner' })
  async deleteBanner(@Param('id') id: string) {
    return this.adminService.deleteBanner(Number(id));
  }

  @Delete('banners')
  @ApiOperation({ summary: 'Admin delete storefront banner via body id' })
  async deleteBannerByBody(@Body() body: { id: number }) {
    return this.adminService.deleteBanner(Number(body.id));
  }

  @Post('products')
  @ApiOperation({ summary: 'Admin update or delete products' })
  async handleProduct(@Body() body: any) {
    return this.adminService.handleProductAction(body);
  }
}

