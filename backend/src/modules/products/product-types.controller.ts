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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  CreateAttributeDto,
  CreateProductTypeDto,
  ProductTypesService,
} from './product-types.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Product Types & Dynamic Attributes')
@Controller(['api/v1/product-types', 'api/product-types'])
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product types and their attributes' })
  async findAll() {
    return this.productTypesService.findAll();
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get single product type by ID or Slug' })
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.productTypesService.findByIdOrSlug(idOrSlug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin create product type' })
  async create(@Body() body: CreateProductTypeDto) {
    return this.productTypesService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update product type' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<CreateProductTypeDto>,
  ) {
    return this.productTypesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin delete product type' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.productTypesService.delete(id);
  }

  @Post(':id/attributes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin add attribute to product type' })
  async addAttribute(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateAttributeDto,
  ) {
    return this.productTypesService.addAttribute(id, body);
  }

  @Put('attributes/:attrId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update attribute' })
  async updateAttribute(
    @Param('attrId', ParseIntPipe) attrId: number,
    @Body() body: Partial<CreateAttributeDto>,
  ) {
    return this.productTypesService.updateAttribute(attrId, body);
  }

  @Delete('attributes/:attrId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin delete attribute' })
  async deleteAttribute(@Param('attrId', ParseIntPipe) attrId: number) {
    return this.productTypesService.deleteAttribute(attrId);
  }
}

