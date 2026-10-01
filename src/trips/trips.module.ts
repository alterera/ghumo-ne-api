import { Module } from '@nestjs/common';
import { TripsAdminController } from './trips-admin.controller.js';
import { TripsController } from './trips.controller.js';
import { TripsService } from './trips.service.js';

@Module({
  controllers: [TripsController, TripsAdminController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
