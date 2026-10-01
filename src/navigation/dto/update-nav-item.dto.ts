import { PartialType } from '@nestjs/swagger';
import { CreateNavItemDto } from './create-nav-item.dto.js';

export class UpdateNavItemDto extends PartialType(CreateNavItemDto) {}
