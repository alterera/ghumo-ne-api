import { Module } from '@nestjs/common';
import { SiteSettingsAdminController } from './site-settings-admin.controller.js';
import { SiteSettingsController } from './site-settings.controller.js';
import { SiteSettingsService } from './site-settings.service.js';

@Module({
  controllers: [SiteSettingsController, SiteSettingsAdminController],
  providers: [SiteSettingsService],
  exports: [SiteSettingsService],
})
export class SiteSettingsModule {}
