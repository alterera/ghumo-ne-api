import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateInstagramReelDto } from './dto/create-instagram-reel.dto.js';
import { UpdateInstagramReelDto } from './dto/update-instagram-reel.dto.js';
import { InstagramService } from './instagram.service.js';

@ApiTags('admin-instagram')
@ApiBearerAuth()
@Controller('admin/instagram')
export class InstagramAdminController {
  constructor(private service: InstagramService) {}

  @Get()
  findAll() {
    return this.service.findAllAdmin();
  }

  @Post()
  create(@Body() dto: CreateInstagramReelDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInstagramReelDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
