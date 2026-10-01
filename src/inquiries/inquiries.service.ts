import { Injectable, NotFoundException } from '@nestjs/common';
import { InquiryStatus } from '@prisma/client';
import { paginate } from '../common/dto/pagination.dto.js';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';
import { UpdateInquiryDto } from './dto/update-inquiry.dto.js';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateInquiryDto) {
    return this.prisma.inquiry.create({ data: dto });
  }

  async findAllAdmin(page = 1, limit = 20) {
    const { take, skip } = paginate(page, limit);
    const [data, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        take,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inquiry.count(),
    ]);
    return { data, total, page, limit };
  }

  async updateStatus(id: string, dto: UpdateInquiryDto) {
    await this.ensureExists(id);
    return this.prisma.inquiry.update({ where: { id }, data: dto });
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Inquiry not found');
  }
}
