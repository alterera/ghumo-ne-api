import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { FaqsService } from './faqs.service.js';

@ApiTags('faqs')
@Controller('faqs')
export class FaqsController {
  constructor(private service: FaqsService) {}

  @Public()
  @Get()
  findAll() {
    return this.service.findPublic();
  }
}
