import { Module } from '@nestjs/common';
import { BannersAdminController } from './banners-admin.controller.js';
import { BannersController } from './banners.controller.js';
import { BannersService } from './banners.service.js';

@Module({
  controllers: [BannersController, BannersAdminController],
  providers: [BannersService],
  exports: [BannersService],
})
export class BannersModule {}
