import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ProductQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by category slug or ID',
    example: 'salt-nicotine',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter by brand name or brand slug',
    example: 'nasty-juice',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Filter by product type',
    enum: ProductType,
  })
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @ApiPropertyOptional({
    description: 'Filter by specific nicotine strength (e.g., 20mg, 50mg, 3mg)',
    example: '50mg',
  })
  @IsOptional()
  @IsString()
  nicotineStrength?: string;

  @ApiPropertyOptional({
    description: 'Filter by flavor profile (e.g., Mango, Watermelon, Ice)',
    example: 'Ice',
  })
  @IsOptional()
  @IsString()
  flavor?: string;

  @ApiPropertyOptional({
    description: 'Search query across title, description, and brand',
    example: 'Aegis',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: 100000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: 3000000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Filter only in-stock products',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({
    description: 'Filter featured products for homepage',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Sort option: newest, price-asc, price-desc, rating, popular',
    example: 'newest',
    default: 'newest',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 12,
    default: 12,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 12;
}
