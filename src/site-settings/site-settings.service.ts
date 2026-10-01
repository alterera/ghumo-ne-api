import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { UpdateSiteSettingDto } from './dto/update-site-setting.dto.js';

@Injectable()
export class SiteSettingsService {
  constructor(private prisma: PrismaService) {}

  async getPublic() {
    const settings = await this.prisma.siteSetting.findFirst({
      orderBy: { createdAt: 'asc' },
    });
    return settings;
  }

  async update(dto: UpdateSiteSettingDto) {
    const existing = await this.prisma.siteSetting.findFirst();
    if (existing) {
      return this.prisma.siteSetting.update({
        where: { id: existing.id },
        data: dto,
      });
    }
    return this.prisma.siteSetting.create({ data: dto });
  }
}
