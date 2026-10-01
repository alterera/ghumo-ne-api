import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BannerType } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator.js';
import { BannersService } from './banners.service.js';

@ApiTags('banners')
@Controller('banners')
export class BannersController {
  constructor(private service: BannersService) {}

  @Public()
  @Get()
  findAll(@Query('type') type?: BannerType) {
    return this.service.findPublic(type);
  }
}
