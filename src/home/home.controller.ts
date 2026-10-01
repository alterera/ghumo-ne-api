import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { HomeService } from './home.service.js';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(private service: HomeService) {}

  @Public()
  @Get()
  getHome() {
    return this.service.getHomeData();
  }
}
