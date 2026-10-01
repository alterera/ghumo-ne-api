import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { NavigationService } from './navigation.service.js';

@ApiTags('navigation')
@Controller('navigation')
export class NavigationController {
  constructor(private service: NavigationService) {}

  @Public()
  @Get()
  getNavigation() {
    return this.service.getPublicTree();
  }
}
