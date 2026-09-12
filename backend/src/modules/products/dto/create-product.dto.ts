import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Title / Name of the product',
    example: 'GeekVape Aegis Legend 3 Kit',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Unique URL slug for product',
    example: 'geekvape-aegis-legend-3-kit',
  })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: 'Product description and technical features',
    example: '200W flagship dual 18650 IP68 shockproof vape mod kit with Z Fli Tank',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product price in Tomans or standard unit',
    example: 2850000,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

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
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({
    description: 'Category / Product type',
    enum: ProductType,
    example: ProductType.DEVICE_POD,
  })
  @IsNotEmpty()
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({
    description: 'Brand name',
    example: 'GeekVape',
  })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiPropertyOptional({
    description: 'Brand URL slug',
    example: 'geekvape',
  })
  @IsOptional()
  @IsString()
  brandSlug?: string;

  @ApiPropertyOptional({
    description: 'List of product image URLs',
    example: ['/images/products/aegis-1.webp', '/images/products/aegis-2.webp'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Highlight on homepage featured section',
    example: true,
    default: false,
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
    example: ['Mango', 'Ice', 'Menthol'],
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

  @ApiProperty({
    description: 'UUID of the Category this product belongs to',
    example: 'c1b48b94-8ec4-4e3f-8df4-05bfd4190c74',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
