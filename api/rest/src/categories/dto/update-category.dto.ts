import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import { Attachment } from 'src/common/entities/attachment.entity';
import { Product } from 'src/products/entities/product.entity';
import { Category } from '../entities/category.entity';
import { Type } from 'src/types/entities/type.entity';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  id: number;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsOptional()
  parent?: Category;

  @IsOptional()
  @IsArray()
  children?: Category[];

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  image?: Attachment;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  type?: Type;

  @IsOptional()
  @IsArray()
  products?: Product[];

  @IsString()
  @IsOptional()
  language?: string;

  @IsArray()
  @IsOptional()
  translated_languages?: string[];
}
