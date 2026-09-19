import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
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
   * 1. Send OTP via Kavenegar SMS with development fallback
   */
  async sendOtp(dto: SendOtpDto) {
    const rawPhone = dto.targetPhone;
    if (!rawPhone) {
      throw new BadRequestException('شماره تلفن همراه الزامی است');
    }

    const cleanPhone = this.formatPhoneNumber(rawPhone);
    if (!this.isIranianMobile(cleanPhone)) {
      throw new BadRequestException('فرمت شماره موبایل وارد شده نامعتبر است (مثال: 09123456789)');
    }

    // Generate random 5-digit OTP
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes validity

    // Invalidate previous unused OTP codes for this phone
    await this.prisma.otpCode.updateMany({
      where: { phoneNumber: cleanPhone, isUsed: false },
      data: { isUsed: true },
    });

    // Save fresh OTP
    await this.prisma.otpCode.create({
      data: {
        phoneNumber: cleanPhone,
        code,
        expiresAt,
      },
    });

    // Dispatch SMS via Kavenegar Service
    const smsResult = await this.kavenegarService.sendOtp(cleanPhone, code);

    return {
      success: true,
      message: 'کد تأیید یکبارمصرف با موفقیت ارسال گردید',
      phoneNumber: cleanPhone,
      simulated: smsResult.simulated,
      debugCode:
        process.env.NODE_ENV !== 'production' || smsResult.simulated
          ? code
          : undefined,
    };
  }

  /**
   * 2. Verify OTP with Master OTP ("11111") test bypass support
   */
  async verifyOtp(dto: VerifyOtpDto) {
    const rawPhone = dto.targetPhone;
    if (!rawPhone) {
      throw new BadRequestException('شماره تلفن همراه الزامی است');
    }

    const cleanPhone = this.formatPhoneNumber(rawPhone);
    const code = dto.code.trim();

    // OWASP & Test bypass logic: Master OTP "11111" skips external SMS & DB check
    const isMasterOtp = code === this.MASTER_TEST_OTP;

    if (!isMasterOtp) {
      const otpRecord = await this.prisma.otpCode.findFirst({
        where: {
          phoneNumber: cleanPhone,
          code,
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!otpRecord) {
        throw new UnauthorizedException('کد تأیید نامعتبر یا منقضی شده است');
      }

      // Mark code as used
      await this.prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
      });
    }

    // Auto-upsert verified user
    let user = await this.prisma.user.findUnique({
      where: { phoneNumber: cleanPhone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phoneNumber: cleanPhone,
          isVerified: true,
        },
      });
    } else if (!user.isVerified) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
    }

    return this.generateAuthResponse(user);
  }

  /**
   * 3. Register with username/mobile and bcrypt hashed password (OWASP ASVS compliant)
   */
  async register(dto: RegisterDto) {
    const { usernameOrMobile, password, fullName } = dto;
    const identifier = usernameOrMobile.trim();
    const isMobile = this.isIranianMobile(identifier);
    const cleanPhone = isMobile ? this.formatPhoneNumber(identifier) : null;
    const username = !isMobile ? identifier.toLowerCase() : null;

    // Check for existing identity
    if (cleanPhone) {
      const existing = await this.prisma.user.findUnique({
        where: { phoneNumber: cleanPhone },
      });
      if (existing) {
        throw new BadRequestException('کاربری با این شماره موبایل از قبل ثبت‌نام کرده است');
      }
    } else if (username) {
      const existing = await this.prisma.user.findUnique({
        where: { username },
      });
      if (existing) {
        throw new BadRequestException('این نام کاربری قبلاً انتخاب شده است');
      }
    }

    // OWASP ASVS: Secure salted password hash with bcrypt factor 10
    const passwordHash = await bcrypt.hash(password, this.BCRYPT_SALT_ROUNDS);

    // Create persistent user record
    const user = await this.prisma.user.create({
      data: {
        phoneNumber: cleanPhone,
        username,
        fullName: fullName?.trim() || null,
        passwordHash,
        isVerified: true,
      },
    });

    return this.generateAuthResponse(user);
  }

  /**
   * 4. Login with Username/Mobile and Password with Information Disclosure Protection
   */
  async loginWithPassword(dto: LoginWithPasswordDto) {
    const { usernameOrMobile, password } = dto;
    const identifier = usernameOrMobile.trim();
    const isMobile = this.isIranianMobile(identifier);
    const cleanPhone = isMobile ? this.formatPhoneNumber(identifier) : null;
    const username = !isMobile ? identifier.toLowerCase() : null;

    let user = null;
    if (cleanPhone) {
      user = await this.prisma.user.findUnique({
        where: { phoneNumber: cleanPhone },
      });
    } else if (username) {
      user = await this.prisma.user.findUnique({
        where: { username },
      });
    }

    if (!user) {
      user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { phoneNumber: identifier },
            { username: identifier.toLowerCase() },
          ],
        },
      });
    }

    // OWASP: Uniform generic error message to prevent username enumeration
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('شناسه کاربری یا کلمه عبور اشتباه است');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('شناسه کاربری یا کلمه عبور اشتباه است');
    }

    return this.generateAuthResponse(user);
  }

  /**
   * Issue signed JWT access token and sanitized user profile
   */
  private generateAuthResponse(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      phoneNumber: user.phoneNumber || user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
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
