import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Suppliers')
@Controller(['api/v1/suppliers', 'suppliers'])
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  /* ==========================================================
     SUPPLIER PORTAL (Isolated to current supplier)
     ========================================================== */

  @Get('portal/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPPLIER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current supplier metrics dashboard' })
  async getDashboard(@CurrentUser() user: User) {
    return this.suppliersService.getDashboard(user.id);
  }

  @Get('portal/products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPPLIER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get assigned products for current supplier' })
  async getMyProducts(@CurrentUser() user: User) {
    return this.suppliersService.getMyProducts(user.id);
  }

  @Patch('portal/products/:id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPPLIER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inventory stock for an assigned product' })
  async updateMyProductStock(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body('stock') stock: number,
  ) {
    return this.suppliersService.updateMyProductStock(user.id, Number(id), stock);
  }

  @Get('portal/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPPLIER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get incoming orders for current supplier' })
  async getMyOrders(@CurrentUser() user: User) {
    return this.suppliersService.getMyOrders(user.id);
  }

  @Get('portal/settlements')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPPLIER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get settlement history and deductions for current supplier' })
  async getMySettlements(@CurrentUser() user: User) {
    return this.suppliersService.getMySettlements(user.id);
  }

  /* ==========================================================
     ADMIN MANAGEMENT OF SUPPLIERS
     ========================================================== */

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin create supplier account' })
  async adminCreateSupplier(@Body() body: any) {
    return this.suppliersService.adminCreateSupplier(body);
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin list all suppliers' })
  async adminListSuppliers() {
    return this.suppliersService.adminListSuppliers();
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update supplier details or commission' })
  async adminUpdateSupplier(@Param('id') id: string, @Body() body: any) {
    return this.suppliersService.adminUpdateSupplier(Number(id), body);
  }

  @Post('admin/:id/assign-products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin assign products to supplier' })
  async adminAssignProducts(
    @Param('id') id: string,
    @Body('productIds') productIds: number[],
  ) {
    return this.suppliersService.adminAssignProducts(Number(id), productIds);
  }
}

