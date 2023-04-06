import { Type as validateType } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateAttachmentDto } from 'src/common/dto/create-attachment.dto';
import { Type } from '../entities/type.entity';

export class CreateBannerDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  description?: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @validateType(() => CreateAttachmentDto)
  image: CreateAttachmentDto[];

  @IsOptional()
  type?: Type;
}
