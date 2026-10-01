import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { FeaturesService } from './features.service.js';

@ApiTags('features')
@Controller('features')
export class FeaturesController {
  constructor(private service: FeaturesService) {}

  @Public()
  @Get()
  findAll() {
    return this.service.findPublic();
  }
}
