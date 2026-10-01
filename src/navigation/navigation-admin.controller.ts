import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateNavItemDto } from './dto/create-nav-item.dto.js';
import { UpdateNavItemDto } from './dto/update-nav-item.dto.js';
import { NavigationService } from './navigation.service.js';

@ApiTags('admin-navigation')
@ApiBearerAuth()
@Controller('admin/navigation')
export class NavigationAdminController {
  constructor(private service: NavigationService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateNavItemDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNavItemDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
