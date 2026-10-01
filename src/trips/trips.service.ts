import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TripStatus } from '@prisma/client';
import { paginate } from '../common/dto/pagination.dto.js';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { slugify } from '../common/utils/slug.util.js';
import { CreateTripDto } from './dto/create-trip.dto.js';
import { UpdateTripDto } from './dto/update-trip.dto.js';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async findPublic(query: {
    featured?: boolean;
    category?: string;
    q?: string;
    page?: number;
    limit?: number;
  }) {
    const where: Prisma.TripWhereInput = { status: TripStatus.PUBLISHED };

    if (query.featured) where.isFeatured = true;
    if (query.category) where.category = { slug: query.category };
    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { location: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    const { take, skip } = paginate(query.page, query.limit);

    const [data, total] = await Promise.all([
      this.prisma.trip.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: { category: { select: { id: true, name: true, slug: true } } },
      }),
      this.prisma.trip.count({ where }),
    ]);

    return { data, total, page: query.page ?? 1, limit: query.limit ?? 20 };
  }

  async findBySlug(slug: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { slug, status: TripStatus.PUBLISHED },
      include: { category: true },
    });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  async findAllAdmin() {
    return this.prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }

  async create(dto: CreateTripDto) {
    const slug = dto.slug ?? slugify(dto.title);
    return this.prisma.trip.create({
      data: { ...dto, slug, price: new Prisma.Decimal(dto.price) },
    });
  }

  async update(id: string, dto: UpdateTripDto) {
    await this.ensureExists(id);
    const data: Prisma.TripUpdateInput = { ...dto };
    if (dto.price !== undefined) data.price = new Prisma.Decimal(dto.price);
    return this.prisma.trip.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.trip.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');
  }
}
