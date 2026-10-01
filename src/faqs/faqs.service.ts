import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateFaqDto } from './dto/create-faq.dto.js';
import { UpdateFaqDto } from './dto/update-faq.dto.js';

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  findPublic() {
    return this.prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  findAllAdmin() {
    return this.prisma.faq.findMany({ orderBy: { order: 'asc' } });
  }

  create(dto: CreateFaqDto) {
    return this.prisma.faq.create({ data: dto });
  }

  async update(id: string, dto: UpdateFaqDto) {
    await this.ensureExists(id);
    return this.prisma.faq.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.faq.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.faq.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('FAQ not found');
  }
}
