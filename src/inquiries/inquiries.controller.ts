import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';
import { InquiriesService } from './inquiries.service.js';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private service: InquiriesService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateInquiryDto) {
    return this.service.create(dto);
  }
}
