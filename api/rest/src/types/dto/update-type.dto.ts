import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAttachmentDto } from 'src/common/dto/create-attachment.dto';
import { Attachment } from 'src/common/entities/attachment.entity';
import { TypeSettings } from '../entities/type-settings.entity';
import { CreateBannerDto } from './create-banner.dto';
import { CreateTypeDto } from './create-type.dto';

export class UpdateTypeDto extends PartialType(CreateTypeDto) {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsArray()
  @IsOptional()
  banners?: CreateBannerDto[];

  @IsArray()
  @IsOptional()
  promotional_sliders?: Attachment[];

  @IsOptional()
  settings?: TypeSettings;

  @IsString()
  @IsOptional()
  language?: string;

  @IsArray()
  @IsOptional()
  translated_languages?: string[];
}
