import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BannerType } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ enum: BannerType })
  @IsEnum(BannerType)
  type!: BannerType;

  @ApiProperty()
  @IsString()
  imageUrl!: string;

  @ApiProperty()
  @IsString()
  linkUrl!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endsAt?: string;
}
