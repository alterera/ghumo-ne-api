import { Module } from '@nestjs/common';
import { LocationsAdminController } from './locations-admin.controller.js';
import { LocationsController } from './locations.controller.js';
import { LocationsService } from './locations.service.js';

@Module({
  controllers: [LocationsController, LocationsAdminController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
