import { Module } from '@nestjs/common';
import { FaqsAdminController } from './faqs-admin.controller.js';
import { FaqsController } from './faqs.controller.js';
import { FaqsService } from './faqs.service.js';

@Module({
  controllers: [FaqsController, FaqsAdminController],
  providers: [FaqsService],
  exports: [FaqsService],
})
export class FaqsModule {}
