import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import {
  SendOtpDto,
  VerifyOtpDto,
  RegisterDto,
  LoginWithPasswordDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller(['api/v1/auth', 'auth'])
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Send OTP verification code' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Verify OTP code' })
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const authData = await this.authService.verifyOtp(dto);
    this.setAuthCookie(res, authData.accessToken);
    return authData;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register with username/mobile and password' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const authData = await this.authService.register(dto);
    this.setAuthCookie(res, authData.accessToken);
    return authData;
  }

  @Post('login-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with username/mobile and password' })
  async loginWithPassword(
    @Body() dto: LoginWithPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authData = await this.authService.loginWithPassword(dto);
    this.setAuthCookie(res, authData.accessToken);
    return authData;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile and role' })
  async getMe(@CurrentUser() user: any) {
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        username: user.username,
        role: user.role,
        isAdmin: user.role === 'ADMIN' || user.isAdmin === true,
        supplier: user.supplier
          ? {
              id: user.supplier.id,
              companyName: user.supplier.companyName,
              isActive: user.supplier.isActive,
            }
          : null,
      },
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and clear auth cookie' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('vapelab_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { success: true, message: 'Logged out successfully' };
  }

  private setAuthCookie(res: Response, token: string) {
    if (!res || !res.cookie) return;
    res.cookie('vapelab_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }
}
