import { Module } from '@nestjs/common';
import { NavigationAdminController } from './navigation-admin.controller.js';
import { NavigationController } from './navigation.controller.js';
import { NavigationService } from './navigation.service.js';

@Module({
  controllers: [NavigationController, NavigationAdminController],
  providers: [NavigationService],
  exports: [NavigationService],
})
export class NavigationModule {}
