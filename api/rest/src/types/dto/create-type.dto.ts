import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAttachmentDto } from 'src/common/dto/create-attachment.dto';
import { Attachment } from 'src/common/entities/attachment.entity';
import { TypeSettings } from '../entities/type-settings.entity';
import { CreateBannerDto } from './create-banner.dto';

export class CreateTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateBannerDto)
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
