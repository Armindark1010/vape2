import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { SettlementsService } from './settlements.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Settlements')
@Controller(['api/v1/admin/settlements', 'admin/settlements'])
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Get()
  @ApiOperation({ summary: 'Admin list all settlement batches' })
  async listAll() {
    return this.settlementsService.listAllSettlements();
  }

  @Post('generate-weekly')
  @ApiOperation({ summary: 'Admin generate weekly settlement batch for a supplier' })
  async generateWeekly(
    @Body() body: { supplierId: number; periodStart: string; periodEnd: string },
  ) {
    return this.settlementsService.generateWeeklySettlement(
      Number(body.supplierId),
      new Date(body.periodStart),
      new Date(body.periodEnd),
    );
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Admin approve settlement batch' })
  async approve(@CurrentUser() user: User, @Param('id') id: string) {
    return this.settlementsService.approveSettlement(Number(id), user.id);
  }

  @Patch(':id/pay')
  @ApiOperation({ summary: 'Admin mark settlement batch as paid with Paya/Satna reference' })
  async pay(
    @Param('id') id: string,
    @Body('payoutReference') payoutReference: string,
  ) {
    return this.settlementsService.markSettlementAsPaid(Number(id), payoutReference);
  }
}

