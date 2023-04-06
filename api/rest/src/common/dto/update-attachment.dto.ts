import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { Product } from 'src/products/entities/product.entity';
import { Banner } from 'src/types/entities/banner.entity';
import { Type } from 'src/types/entities/type.entity';
import { CreateAttachmentDto } from './create-attachment.dto';

export class UpdateAttachmenteDto extends PartialType(CreateAttachmentDto) {
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  original?: string;

  @IsOptional()
  fileable?: Product;
  @IsNumber()
  @IsOptional()
  coupon?: Coupon;

  @IsOptional()
  type?: Type;

  @IsOptional()
  banner?: Banner;
}
