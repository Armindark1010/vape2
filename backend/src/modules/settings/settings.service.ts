import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGlobalCommissionRate(): Promise<number> {
    const setting = await this.prisma.globalSetting.findUnique({
      where: { key: 'commission_rate' },
    });
    return setting ? Number(setting.value) : 10;
  }

  async setGlobalCommissionRate(rate: number): Promise<number> {
    const validRate = Math.max(0, Math.min(100, Math.round(Number(rate))));
    await this.prisma.globalSetting.upsert({
      where: { key: 'commission_rate' },
      create: {
        key: 'commission_rate',
        value: String(validRate),
        description: 'درصد کارمزد مصوب پلتفرم ویپ‌لب',
      },
      update: {
        value: String(validRate),
      },
    });
    return validRate;
  }

  async getAllSettings() {
    return this.prisma.globalSetting.findMany();
  }
}

