import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogStatus } from '@prisma/client';
import { paginate } from '../common/dto/pagination.dto.js';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { slugify } from '../common/utils/slug.util.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async findPublic(page = 1, limit = 6) {
    const { take, skip } = paginate(page, limit);
    const where = { status: BlogStatus.PUBLISHED };

    const [data, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        take,
        skip,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.blog.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findBySlug(slug: string) {
    const blog = await this.prisma.blog.findFirst({
      where: { slug, status: BlogStatus.PUBLISHED },
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  findAllAdmin() {
    return this.prisma.blog.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(dto: CreateBlogDto) {
    const slug = dto.slug ?? slugify(dto.title);
    return this.prisma.blog.create({
      data: {
        ...dto,
        slug,
        publishedAt: dto.status === BlogStatus.PUBLISHED ? new Date() : null,
      },
    });
  }

  async update(id: string, dto: UpdateBlogDto) {
    await this.ensureExists(id);
    const { status, ...rest } = dto;
    return this.prisma.blog.update({
      where: { id },
      data: {
        ...rest,
        ...(status !== undefined ? { status } : {}),
        ...(status === BlogStatus.PUBLISHED ? { publishedAt: new Date() } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.blog.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.blog.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Blog not found');
  }
}
