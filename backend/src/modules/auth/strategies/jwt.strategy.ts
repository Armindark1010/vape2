import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../database/prisma.service';

export interface JwtPayload {
  sub: number | string;
  email?: string;
  username?: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: any) => req?.cookies?.vapelab_token || null,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'vapelab_production_jwt_super_secret_key_2026_9837482',
    });
  }

  async validate(payload: JwtPayload) {
    const userId = Number(payload.sub);
    if (!userId || Number.isNaN(userId)) {
      throw new UnauthorizedException('Token payload is invalid');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        supplier: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User account not found');
    }

    return user;
  }
}
