import { Body, Controller, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateSiteSettingDto } from './dto/update-site-setting.dto.js';
import { SiteSettingsService } from './site-settings.service.js';

@ApiTags('admin-site-settings')
@ApiBearerAuth()
@Controller('admin/site-settings')
export class SiteSettingsAdminController {
  constructor(private service: SiteSettingsService) {}

  @Put()
  update(@Body() dto: UpdateSiteSettingDto) {
    return this.service.update(dto);
  }
}
