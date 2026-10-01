import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateNavItemDto } from './dto/create-nav-item.dto.js';
import { UpdateNavItemDto } from './dto/update-nav-item.dto.js';

@Injectable()
export class NavigationService {
  constructor(private prisma: PrismaService) {}

  async getPublicTree() {
    const items = await this.prisma.navItem.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { order: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    return items;
  }

  async findAll() {
    return this.prisma.navItem.findMany({
      orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
      include: { children: { orderBy: { order: 'asc' } } },
    });
  }

  async create(dto: CreateNavItemDto) {
    return this.prisma.navItem.create({ data: dto });
  }

  async update(id: string, dto: UpdateNavItemDto) {
    await this.ensureExists(id);
    return this.prisma.navItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.navItem.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.navItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Nav item not found');
  }
}
