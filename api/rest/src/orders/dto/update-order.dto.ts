import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserAddress } from 'src/addresses/entities/address.entity';
import { PaymentGatewayType } from 'src/common/enums/common.enum';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { Product } from 'src/products/entities/product.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from '../entities/order-status.entity';
import { Order } from '../entities/order.entity';
import { ConnectProductOrderPivot, CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsString()
  tracking_number: string;

  @IsString()
  customer_contact: string;

  @IsNotEmpty()
  customer: User;

  @IsOptional()
  parent_order?: Order;

  @IsOptional()
  @IsArray()
  children?: Order[];

  @IsNotEmpty()
  status: OrderStatus;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  sales_tax: number;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @IsNumber()
  paid_total: number;

  payment_id?: string;

  @IsEnum(PaymentGatewayType)
  payment_gateway: PaymentGatewayType;

  @IsOptional()
  coupon?: Coupon;

  @IsNotEmpty()
  shop: Shop;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsNotEmpty()
  @IsNumber()
  delivery_fee: number;

  @IsNotEmpty()
  @IsString()
  delivery_time: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ConnectProductOrderPivot)
  products?: ConnectProductOrderPivot[];

  @IsNotEmpty()
  billing_address: UserAddress;

  @IsNotEmpty()
  shipping_address: UserAddress;

  @IsOptional()
  language?: string;

  @IsOptional()
  @IsArray()
  translated_languages?: string[];
}
