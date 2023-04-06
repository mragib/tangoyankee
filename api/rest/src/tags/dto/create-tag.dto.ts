import { PickType } from '@nestjs/swagger';
import { Tag } from '../entities/tag.entity';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Attachment } from 'src/common/entities/attachment.entity';
import { Type } from 'src/types/entities/type.entity';

export class CreateTagDto extends PickType(Tag, [
  'name',
  'type',
  'details',
  'image',
  'icon',
  'language',
]) {
  @IsOptional()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  image: Attachment;

  @IsOptional()
  @IsString()
  icon: string;

  @IsOptional()
  type: Type;
}
