import { Module } from '@nestjs/common';
import { InstagramAdminController } from './instagram-admin.controller.js';
import { InstagramController } from './instagram.controller.js';
import { InstagramService } from './instagram.service.js';

@Module({
  controllers: [InstagramController, InstagramAdminController],
  providers: [InstagramService],
  exports: [InstagramService],
})
export class InstagramModule {}
