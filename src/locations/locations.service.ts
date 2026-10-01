import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { slugify } from '../common/utils/slug.util.js';
import { CreateLocationDto } from './dto/create-location.dto.js';
import { UpdateLocationDto } from './dto/update-location.dto.js';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  findPublic() {
    return this.prisma.location.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const location = await this.prisma.location.findFirst({
      where: { slug, isActive: true },
    });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  findAllAdmin() {
    return this.prisma.location.findMany({ orderBy: { order: 'asc' } });
  }

  create(dto: CreateLocationDto) {
    const slug = dto.slug ?? slugify(dto.name);
    return this.prisma.location.create({ data: { ...dto, slug } });
  }

  async update(id: string, dto: UpdateLocationDto) {
    await this.ensureExists(id);
    return this.prisma.location.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.location.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.location.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Location not found');
  }
}
