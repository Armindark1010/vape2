import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PaymentsService, VerifyPaymentDto } from './payments.service';

@ApiTags('Payments')
@Controller(['api/v1/payment', 'api/payment', 'payment'])
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request Zarinpal Sandbox payment authority' })
  async requestPayment(@Body() body: { orderNumber: string }) {
    return this.paymentsService.requestPayment(body.orderNumber);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify payment from Zarinpal callback or gateway' })
  async verifyPayment(@Body() body: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(body);
  }

  @Get('callback')
  @ApiOperation({ summary: 'Browser redirect callback handler' })
  async callbackRedirect(
    @Query('order') order: string,
    @Query('Authority') authority: string,
    @Query('Status') status: string,
    @Res() res: Response,
  ) {
    const storefrontUrl = process.env.STOREFRONT_URL || 'http://localhost:3001';
    const redirectUrl = `${storefrontUrl}/payment/callback?order=${encodeURIComponent(
      order || '',
    )}&Authority=${encodeURIComponent(authority || '')}&Status=${encodeURIComponent(
      status || '',
    )}`;
    return res.redirect(redirectUrl);
  }
}

