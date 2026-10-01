import { PartialType } from '@nestjs/swagger';
import { CreateInstagramReelDto } from './create-instagram-reel.dto.js';

export class UpdateInstagramReelDto extends PartialType(CreateInstagramReelDto) {}
