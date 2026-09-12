import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Name of the category',
    example: 'Salt Nicotine',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Unique slug for URL routing',
    example: 'salt-nicotine',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'High-strength nicotine salts for pod systems',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Category cover image URL',
    example: '/images/categories/salt-nic.webp',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
