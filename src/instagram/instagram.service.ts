import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateInstagramReelDto } from './dto/create-instagram-reel.dto.js';
import { UpdateInstagramReelDto } from './dto/update-instagram-reel.dto.js';

@Injectable()
export class InstagramService {
  constructor(private prisma: PrismaService) {}

  findPublic(limit = 8) {
    return this.prisma.instagramReel.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: limit,
    });
  }

  findAllAdmin() {
    return this.prisma.instagramReel.findMany({ orderBy: { order: 'asc' } });
  }

  create(dto: CreateInstagramReelDto) {
    return this.prisma.instagramReel.create({ data: dto });
  }

  async update(id: string, dto: UpdateInstagramReelDto) {
    await this.ensureExists(id);
    return this.prisma.instagramReel.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.instagramReel.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.instagramReel.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Instagram reel not found');
  }
}
