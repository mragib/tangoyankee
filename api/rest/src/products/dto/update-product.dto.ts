import { Type } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { AttributeValue } from 'src/attributes/entities/attribute-value.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Attachment } from 'src/common/entities/attachment.entity';
import { ProductStatus, ProductType } from 'src/common/enums/common.enum';
import { Order } from 'src/orders/entities/order.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { OrderProductPivot } from '../entities/order-product-pivot.entity';
import { Product } from '../entities/product.entity';
import { Variation } from '../entities/variation.entity';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  type: Type;

  @IsOptional()
  product_type: ProductType;

  @IsOptional()
  categories: Category[];

  @IsOptional()
  tags?: Tag[];

  @IsOptional()
  variations?: AttributeValue[];

  @IsOptional()
  variation_options?: Variation[];

  @IsOptional()
  pivot?: OrderProductPivot;

  @IsOptional()
  orders?: Order[];

  @IsOptional()
  shop?: Shop;

  @IsOptional()
  related_products?: Product[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  in_stock?: boolean;

  @IsOptional()
  is_taxable?: boolean;

  @IsOptional()
  sale_price?: number;

  @IsOptional()
  max_price?: number;

  @IsOptional()
  min_price?: number;

  @IsOptional()
  sku?: string;

  @IsOptional()
  gallery?: Attachment[];

  @IsOptional()
  image?: Attachment;

  @IsOptional()
  status: ProductStatus;

  @IsOptional()
  height?: string;

  @IsOptional()
  length?: string;

  @IsOptional()
  width?: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  quantity: number;

  @IsOptional()
  unit: string;

  @IsOptional()
  ratings: number;

  @IsOptional()
  in_wishlist: boolean;

  // @OneToMany((type) => Review, (review) => review.product)
  // my_review?: Review[];

  @IsOptional()
  language?: string;

  @IsOptional()
  translated_languages?: string[];
}
