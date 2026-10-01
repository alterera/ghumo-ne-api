import { Module } from '@nestjs/common';
import { BlogsAdminController } from './blogs-admin.controller.js';
import { BlogsController } from './blogs.controller.js';
import { BlogsService } from './blogs.service.js';

@Module({
  controllers: [BlogsController, BlogsAdminController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
