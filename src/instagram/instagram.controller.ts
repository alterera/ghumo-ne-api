import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { InstagramService } from './instagram.service.js';

@ApiTags('instagram')
@Controller('instagram')
export class InstagramController {
  constructor(private service: InstagramService) {}

  @Public()
  @Get()
  findAll(@Query('limit') limit?: number) {
    return this.service.findPublic(limit ? Number(limit) : 8);
  }
}
