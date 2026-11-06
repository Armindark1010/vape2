import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Settings')
@Controller(['api/v1/admin/settings', 'admin/settings'])
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('commission')
  @ApiOperation({ summary: 'Get global platform commission rate' })
  async getCommissionRate() {
    const rate = await this.settingsService.getGlobalCommissionRate();
    return { commissionRate: rate };
  }

  @Put('commission')
  @ApiOperation({ summary: 'Update global platform commission rate' })
  async setCommissionRate(@Body('commissionRate') rate: number) {
    const updated = await this.settingsService.setGlobalCommissionRate(rate);
    return { commissionRate: updated, success: true };
  }

  @Get()
  @ApiOperation({ summary: 'Get all global settings' })
  async getAll() {
    return this.settingsService.getAllSettings();
  }
}

