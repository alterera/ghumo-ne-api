import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { LocationsService } from './locations.service.js';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private service: LocationsService) {}

  @Public()
  @Get()
  findAll() {
    return this.service.findPublic();
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}
