import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { ProductsService, ProductFilterQuery } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Products & Variants')
@Controller(['api/v1/products', 'api/products', 'products'])
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get products with filtering, search, and pagination' })
  async findAll(@Query() query: ProductFilterQuery) {
    return this.productsService.findAll(query);
  }

  @Get(':slugOrId')
  @ApiOperation({ summary: 'Get single product by ID or Slug' })
  async findOne(@Param('slugOrId') slugOrId: string) {
    return this.productsService.findBySlugOrId(slugOrId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin create product with variants and dynamic attributes' })
  async create(@Body() body: any) {
    return this.productsService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update product with variants' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Post('variants/:variantId/stock-adjust')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adjust stock for a specific variant with movement log' })
  async adjustVariantStock(
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body('delta') delta: number,
    @Body('reason') reason: string,
    @CurrentUser() user?: User,
  ) {
    return this.productsService.adjustVariantStock(
      variantId,
      Number(delta) || 0,
      reason,
      user?.id,
    );
  }

  @Get(':id/inventory-movements')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inventory movement history for product' })
  async getInventoryMovements(
    @Param('id', ParseIntPipe) id: number,
    @Query('variantId') variantId?: string,
  ) {
    return this.productsService.getInventoryMovements(
      id,
      variantId ? Number(variantId) : undefined,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin delete product' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }
}
