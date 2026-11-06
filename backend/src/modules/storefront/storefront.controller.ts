import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StorefrontService } from './storefront.service';

@ApiTags('Storefront Common API')
@Controller(['api', 'api/v1'])
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Get('health')
  @ApiOperation({ summary: 'System health check' })
  health() {
    return {
      status: 'ok',
      service: 'VapeLab NestJS Backend',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('addresses')
  @ApiOperation({ summary: 'Get user addresses' })
  async getAddresses(@Query('userId') userId?: string, @Req() req?: any) {
    const uid = req?.user?.id ? Number(req.user.id) : (userId ? Number(userId) : undefined);
    const list = await this.storefrontService.getAddresses(uid);
    return { success: true, data: list };
  }

  @Post('addresses')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new address' })
  async createAddress(@Body() body: any, @Req() req?: any) {
    const uid = req?.user?.id ? Number(req.user.id) : (body?.userId ? Number(body.userId) : 1);
    return this.storefrontService.createAddress(uid, body);
  }

  @Patch('addresses/:id')
  @ApiOperation({ summary: 'Update address' })
  async updateAddress(@Param('id') id: string, @Body() body: any) {
    return this.storefrontService.updateAddress(Number(id), body);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Delete address' })
  async deleteAddress(@Param('id') id: string) {
    return this.storefrontService.deleteAddress(Number(id));
  }

  @Get('coupon')
  @ApiOperation({ summary: 'Validate discount coupon code' })
  async validateCoupon(@Query('code') code: string) {
    return this.storefrontService.validateCoupon(code);
  }

  @Post('reviews')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit product review' })
  async addReview(@Body() body: any) {
    return this.storefrontService.addReview(body);
  }

  @Post('newsletter')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  async subscribeNewsletter(@Body('email') email: string) {
    return this.storefrontService.subscribeNewsletter(email);
  }

  @Post('contact')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit contact message' })
  async saveContact(@Body() body: any) {
    return this.storefrontService.saveContactMessage(body);
  }
}

