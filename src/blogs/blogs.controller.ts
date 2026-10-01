import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { BlogsService } from './blogs.service.js';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private service: BlogsService) {}

  @Public()
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.service.findPublic(query.page, query.limit);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}
