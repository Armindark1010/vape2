import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReservationsService, ReserveItemInput } from './reservations.service';

@ApiTags('Reservations')
@Controller(['api/v1/cart', 'api/cart', 'cart'])
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('reserve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atomically reserve inventory in PostgreSQL for 10 minutes' })
  async reserve(
    @Body() body: { items: any[]; reservationToken?: string; reservationId?: string; cartToken?: string },
    @Req() req: any,
  ) {
    const token = body.reservationToken || body.reservationId || body.cartToken;
    const userId = req.user?.id ? Number(req.user.id) : undefined;
    const items: ReserveItemInput[] = (body.items || []).map((i) => ({
      productId: Number(i.productId || i.id),
      quantity: Number(i.quantity || i.qty || 1),
    }));

    return this.reservationsService.createReservation(userId, items, token);
  }

  @Post('release-reservation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Release an active inventory hold' })
  async releaseReservation(@Body() body: { reservationToken?: string; reservationId?: string; cartToken?: string; token?: string }) {
    const token = body.reservationToken || body.reservationId || body.cartToken || body.token || '';
    return this.reservationsService.releaseReservation(token);
  }

  @Get('reservation-status')
  @ApiOperation({ summary: 'Check remaining seconds of reservation hold' })
  async getStatus(@Query('token') tokenQuery?: string, @Query('reservationToken') resQuery?: string, @Query('reservationId') resIdQuery?: string) {
    const token = tokenQuery || resQuery || resIdQuery || '';
    return this.reservationsService.getReservationStatus(token);
  }
}
