import { Module } from '@nestjs/common';
import { InquiriesAdminController } from './inquiries-admin.controller.js';
import { InquiriesController } from './inquiries.controller.js';
import { InquiriesService } from './inquiries.service.js';

@Module({
  controllers: [InquiriesController, InquiriesAdminController],
  providers: [InquiriesService],
  exports: [InquiriesService],
})
export class InquiriesModule {}
