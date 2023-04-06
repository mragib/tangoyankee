import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentGatewayType } from '../../common/enums/common.enum';
import { OrderStatus } from '../entities/order-status.entity';

export class ConnectProductOrderPivot {
  @IsNumber()
  product_id: number;

  @IsOptional()
  variation_option_id?: number;

  @IsNotEmpty()
  @IsNumber()
  order_quantity: number;

  @IsNotEmpty()
  @IsNumber()
  unit_price: number;

  @IsNotEmpty()
  @IsNumber()
  subtotal: number;
}

export class CardInput {
  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  expiryMonth: string;

  @IsNotEmpty()
  @IsString()
  expiryYear: string;

  @IsNotEmpty()
  @IsString()
  cvv: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UserAddressInput {
  @IsString()
  street_address: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zip: string;
}

export class CreateOrderDto {
  @IsOptional()
  id: number;

  @IsString()
  tracking_number: string;

  @IsNumber()
  customer_id: number;

  @IsOptional()
  shop_id?: number;

  @IsOptional()
  coupon_id?: number;

  @IsNotEmpty()
  status: OrderStatus;

  @IsString()
  customer_contact: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ConnectProductOrderPivot)
  products: ConnectProductOrderPivot[];

  @IsNumber()
  amount: number;

  @IsNumber()
  sales_tax: number;

  @IsNumber()
  @IsOptional()
  total?: number;

  @IsNumber()
  @IsOptional()
  paid_total?: number;

  @IsString()
  @IsOptional()
  payment_id?: string;

  @IsOptional()
  payment_gateway?: PaymentGatewayType;

  @IsOptional()
  discount?: number;

  @IsOptional()
  delivery_fee?: number;

  @IsString()
  delivery_time: string;

  @IsOptional()
  card?: CardInput;

  @IsOptional()
  billing_address?: UserAddressInput;

  @IsOptional()
  shipping_address?: UserAddressInput;

  @IsOptional()
  language?: string;
}
