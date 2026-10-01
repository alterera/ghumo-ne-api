import { Injectable, NotFoundException } from '@nestjs/common';
import { BannerType } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateBannerDto } from './dto/create-banner.dto.js';
import { UpdateBannerDto } from './dto/update-banner.dto.js';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  findPublic(type?: BannerType) {
    const now = new Date();
    return this.prisma.banner.findMany({
      where: {
        isActive: true,
        ...(type ? { type } : {}),
        OR: [
          { startsAt: null, endsAt: null },
          { startsAt: { lte: now }, endsAt: null },
          { startsAt: null, endsAt: { gte: now } },
          { startsAt: { lte: now }, endsAt: { gte: now } },
        ],
      },
      orderBy: { order: 'asc' },
    });
  }

  findAllAdmin() {
    return this.prisma.banner.findMany({ orderBy: [{ type: 'asc' }, { order: 'asc' }] });
  }

  create(dto: CreateBannerDto) {
    return this.prisma.banner.create({ data: dto });
  }

  async update(id: string, dto: UpdateBannerDto) {
    await this.ensureExists(id);
    return this.prisma.banner.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.banner.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.banner.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Banner not found');
  }
}
