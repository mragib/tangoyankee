import { PickType } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';
import {
  IsArray,
  IsEmpty,
  IsOptional,
  IsString,
  MaxLength,
  isEmpty,
} from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
import { Type } from 'src/types/entities/type.entity';
import { Attachment } from 'src/common/entities/attachment.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateCategoryDto extends PickType(Category, [
  'name',
  'type',
  'details',
  'parent',
  'icon',
  'image',
  'language',
]) {
  @IsOptional()
  id: number;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsOptional()
  parent2?: Category;

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
  type_id: number;

  @IsOptional()
  @IsArray()
  products?: Product[];

  @IsString()
  @IsOptional()
  language?: string;

  @IsArray()
  @IsOptional()
  translated_languages?: string[];

  @IsEmpty()
  created_by: User;

  @IsEmpty()
  updated_by: User;
}
