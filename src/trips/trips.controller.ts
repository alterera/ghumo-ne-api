import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { TripsQueryDto } from './dto/trips-query.dto.js';
import { TripsService } from './trips.service.js';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private service: TripsService) {}

  @Public()
  @Get()
  findAll(@Query() query: TripsQueryDto & PaginationDto) {
    return this.service.findPublic(query);
  }

  @Public()
  @Get('search')
  search(@Query('q') q: string, @Query() pagination: PaginationDto) {
    return this.service.findPublic({ ...pagination, q });
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}
