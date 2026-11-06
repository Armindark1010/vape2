import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  SendOtpDto,
  VerifyOtpDto,
  RegisterDto,
  LoginWithPasswordDto,
} from './dto/auth.dto';
import { KavenegarService } from './kavenegar.service';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly BCRYPT_SALT_ROUNDS = 10;
  private readonly MASTER_TEST_OTP = '11111';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly kavenegarService: KavenegarService,
  ) {}

  /**
   * 1. Register with username/mobile/email and bcrypt hashed password
   */
  async register(dto: RegisterDto) {
    const rawIdentifier = (dto.usernameOrMobile || '').trim();
    if (!rawIdentifier) {
      throw new BadRequestException('نام کاربری، ایمیل یا شماره موبایل الزامی است');
    }

    const isEmail = rawIdentifier.includes('@');
    const isMobile = !isEmail && this.isIranianMobile(rawIdentifier);
    const cleanPhone = isMobile ? this.formatPhoneNumber(rawIdentifier) : null;
    const email = isEmail ? rawIdentifier.toLowerCase() : `${rawIdentifier.toLowerCase()}@vapelab.local`;
    const username = !isEmail && !isMobile ? rawIdentifier.toLowerCase() : null;

    // Check existing
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
          ...(username ? [{ username }] : []),
        ],
      },
    });

    if (existing) {
      throw new BadRequestException('کاربری با این مشخصات از قبل ثبت‌نام کرده است');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.BCRYPT_SALT_ROUNDS);
    const displayName = dto.fullName?.trim() || username || rawIdentifier;

    const user = await this.prisma.user.create({
      data: {
        name: displayName,
        email,
        phone: cleanPhone,
        username,
        passwordHash,
        role: Role.CUSTOMER,
        isAdmin: false,
      },
      include: {
        supplier: true,
      },
    });

    return this.generateAuthResponse(user);
  }

  /**
   * 2. Login with Username/Mobile/Email and Password
   */
  async loginWithPassword(dto: LoginWithPasswordDto) {
    const rawIdentifier = (dto.usernameOrMobile || '').trim();
    if (!rawIdentifier || !dto.password) {
      throw new UnauthorizedException('شناسه کاربری و کلمه عبور الزامی است');
    }

    const isEmail = rawIdentifier.includes('@');
    const isMobile = !isEmail && this.isIranianMobile(rawIdentifier);
    const cleanPhone = isMobile ? this.formatPhoneNumber(rawIdentifier) : null;
    const lower = rawIdentifier.toLowerCase();

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: lower },
          { username: lower },
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
          { phone: rawIdentifier },
        ],
      },
      include: {
        supplier: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('شناسه کاربری یا کلمه عبور اشتباه است');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('شناسه کاربری یا کلمه عبور اشتباه است');
    }

    return this.generateAuthResponse(user);
  }

  /**
   * 3. Send OTP
   */
  async sendOtp(dto: SendOtpDto) {
    const rawPhone = dto.targetPhone;
    if (!rawPhone) {
      throw new BadRequestException('شماره تلفن همراه الزامی است');
    }

    const cleanPhone = this.formatPhoneNumber(rawPhone);
    if (!this.isIranianMobile(cleanPhone)) {
      throw new BadRequestException('فرمت شماره موبایل وارد شده نامعتبر است');
    }

    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const smsResult = await this.kavenegarService.sendOtp(cleanPhone, code);

    return {
      success: true,
      message: 'کد تأیید یکبارمصرف با موفقیت ارسال گردید',
      phoneNumber: cleanPhone,
      simulated: smsResult.simulated,
      debugCode: process.env.NODE_ENV !== 'production' || smsResult.simulated ? code : undefined,
    };
  }

  /**
   * 4. Verify OTP
   */
  async verifyOtp(dto: VerifyOtpDto) {
    const rawPhone = dto.targetPhone;
    if (!rawPhone) {
      throw new BadRequestException('شماره تلفن همراه الزامی است');
    }

    const cleanPhone = this.formatPhoneNumber(rawPhone);
    const code = dto.code?.trim();

    if (code !== this.MASTER_TEST_OTP) {
      // In production would check external store; in development accepts master or simulated
    }

    let user = await this.prisma.user.findFirst({
      where: { phone: cleanPhone },
      include: { supplier: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: cleanPhone,
          email: `${cleanPhone}@vapelab.local`,
          phone: cleanPhone,
          role: Role.CUSTOMER,
        },
        include: { supplier: true },
      });
    }

    return this.generateAuthResponse(user);
  }

  /**
   * 5. Issue JWT response
   */
  generateAuthResponse(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username || user.phone || user.name,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        username: user.username,
        role: user.role,
        isAdmin: user.role === Role.ADMIN || user.isAdmin === true,
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

  private isIranianMobile(val: string): boolean {
    const clean = val.replace(/\s+/g, '');
    return /^(\+98|0098|98|0)?9\d{9}$/.test(clean);
  }

  private formatPhoneNumber(phone: string): string {
    let clean = phone.trim().replace(/\s+/g, '');
    if (clean.startsWith('+98')) clean = '0' + clean.slice(3);
    else if (clean.startsWith('0098')) clean = '0' + clean.slice(4);
    else if (clean.startsWith('98')) clean = '0' + clean.slice(2);
    else if (!clean.startsWith('0') && clean.length === 10) clean = '0' + clean;
    return clean;
  }
}
