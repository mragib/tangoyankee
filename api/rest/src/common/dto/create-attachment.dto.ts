import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateCouponDto } from 'src/coupons/dto/create-coupon.dto';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { Product } from 'src/products/entities/product.entity';
import { Banner } from 'src/types/entities/banner.entity';
import { Type } from 'src/types/entities/type.entity';

export class CreateAttachmentDto {
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

  @IsOptional()
  coupon?: Coupon;

  @IsOptional()
  type?: Type;

  @IsOptional()
  banner?: Banner;
}
