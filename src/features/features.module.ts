import { Module } from '@nestjs/common';
import { FeaturesAdminController } from './features-admin.controller.js';
import { FeaturesController } from './features.controller.js';
import { FeaturesService } from './features.service.js';

@Module({
  controllers: [FeaturesController, FeaturesAdminController],
  providers: [FeaturesService],
  exports: [FeaturesService],
})
export class FeaturesModule {}
