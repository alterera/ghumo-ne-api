import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { SiteSettingsService } from './site-settings.service.js';

@ApiTags('site-settings')
@Controller('site-settings')
export class SiteSettingsController {
  constructor(private service: SiteSettingsService) {}

  @Public()
  @Get()
  getSettings() {
    return this.service.getPublic();
  }
}
