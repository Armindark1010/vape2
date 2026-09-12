import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Title / Name of the product',
    example: 'GeekVape Aegis Legend 3 Kit',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Unique URL slug for product',
    example: 'geekvape-aegis-legend-3-kit',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Product description and technical features',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Product price',
    example: 2850000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Discounted / sale price',
    example: 2490000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @ApiPropertyOptional({
    description: 'Inventory stock quantity',
    example: 15,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: 'Category / Product type',
    enum: ProductType,
  })
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @ApiPropertyOptional({
    description: 'Brand name',
    example: 'GeekVape',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Brand URL slug',
    example: 'geekvape',
  })
  @IsOptional()
  @IsString()
  brandSlug?: string;

  @ApiPropertyOptional({
    description: 'List of product image URLs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Highlight on homepage featured section',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Nicotine strength option',
    example: '50mg',
  })
  @IsOptional()
  @IsString()
  nicotineStrength?: string;

  @ApiPropertyOptional({
    description: 'Flavor profiles tags',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  flavorProfile?: string[];

  @ApiPropertyOptional({
    description: 'Liquid volume or puff capacity',
    example: '30ml',
  })
  @IsOptional()
  @IsString()
  volume?: string;

  @ApiPropertyOptional({
    description: 'UUID of the Category this product belongs to',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
