import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
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
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // OWASP: Max 5 OTP requests per minute per IP
  @ApiOperation({
    summary: 'Send OTP verification code to mobile phone via Kavenegar (Rate limited: 5/min)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP code generated and dispatched (with debug/simulated code in dev)',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Rate limit exceeded (ThrottlerException)',
  })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // OWASP: Max 5 attempts per minute
  @ApiOperation({
    summary: 'Verify OTP code and retrieve JWT access token (Master OTP bypass: 11111)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP verified successfully; returns JWT access token and user info',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired OTP code',
  })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({
    summary: 'Register new user with username or mobile and bcrypt hashed password',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully and JWT issued',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User already exists or validation error (password policy mismatch)',
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // OWASP: Protection against credential stuffing
  @ApiOperation({
    summary: 'Login with username or mobile and password (Rate limited: 5/min)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authentication successful; returns JWT access token and user info',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid username or password',
  })
  async loginPassword(@Body() dto: LoginWithPasswordDto) {
    return this.authService.loginWithPassword(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current user profile retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access / Missing or invalid Bearer token',
  })
  async getProfile(@CurrentUser() user: User) {
    return user;
  }
}
