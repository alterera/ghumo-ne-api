import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { UpdateInquiryDto } from './dto/update-inquiry.dto.js';
import { InquiriesService } from './inquiries.service.js';

@ApiTags('admin-inquiries')
@ApiBearerAuth()
@Controller('admin/inquiries')
export class InquiriesAdminController {
  constructor(private service: InquiriesService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.service.findAllAdmin(query.page, query.limit);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateInquiryDto) {
    return this.service.updateStatus(id, dto);
  }
}
