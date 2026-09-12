import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Salt Nicotine',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Unique slug for URL routing',
    example: 'salt-nicotine',
  })
  @IsNotEmpty()
  @IsString()
  slug: string;

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
