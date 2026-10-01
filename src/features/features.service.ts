import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateFeatureDto } from './dto/create-feature.dto.js';
import { UpdateFeatureDto } from './dto/update-feature.dto.js';

@Injectable()
export class FeaturesService {
  constructor(private prisma: PrismaService) {}

  findPublic() {
    return this.prisma.feature.findMany({ orderBy: { order: 'asc' } });
  }

  findAllAdmin() {
    return this.prisma.feature.findMany({ orderBy: { order: 'asc' } });
  }

  create(dto: CreateFeatureDto) {
    return this.prisma.feature.create({ data: dto });
  }

  async update(id: string, dto: UpdateFeatureDto) {
    await this.ensureExists(id);
    return this.prisma.feature.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.feature.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.feature.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Feature not found');
  }
}
