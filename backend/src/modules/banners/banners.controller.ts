import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { BannersService } from './banners.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Banners')
@Controller(['api/v1/banners', 'api/banners', 'banners', 'api/admin/banners'])
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @ApiOperation({ summary: 'Get active storefront banners or all if requested' })
  async getActive() {
    return this.bannersService.findAllActive();
  }

  @Get(['admin/list', 'admin', 'list'])
  @ApiOperation({ summary: 'Admin list all banners' })
  async getAllAdmin() {
    return this.bannersService.findAllAdmin();
  }

  @Post(['admin', ''])
  @ApiOperation({ summary: 'Admin create banner' })
  async create(@Body() body: any) {
    return this.bannersService.create(body);
  }

  @Patch(['admin/:id', ':id', 'admin', ''])
  @ApiOperation({ summary: 'Admin update banner' })
  async update(@Param('id') idParam: string, @Body() body: any) {
    const bannerId = Number(idParam || body?.id);
    return this.bannersService.update(bannerId, body);
  }

  @Delete(['admin/:id', ':id', 'admin', ''])
  @ApiOperation({ summary: 'Admin delete banner' })
  async delete(@Param('id') idParam: string, @Body() body: any) {
    const bannerId = Number(idParam || body?.id);
    return this.bannersService.delete(bannerId);
  }
}
