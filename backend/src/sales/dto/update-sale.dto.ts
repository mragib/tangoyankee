import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDto } from './create-sale.dto';
import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Customer } from 'src/customer/entities/customer.entity';
import { SalesItem } from 'src/sales_items/entities/sales_item.entity';
import { SaleRevenue } from 'src/sale_revenue/entities/sale_revenue.entity';
import { CustomerPaymentPlan } from 'src/customer-payment-plan/entities/customer-payment-plan.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @ApiProperty()
  @IsNotEmptyObject()
  customer: Customer;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  discount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  totalAmount: number;

  @ApiProperty()
  @IsEmpty()
  invoiceNumber: string;

  @ApiProperty()
  @IsArray()
  saleItems: SalesItem[];

  @ApiProperty()
  @IsArray()
  saleRevenue: SaleRevenue[];

  @ApiProperty()
  @IsOptional()
  customerPaymentPlan?: CustomerPaymentPlan;

  @ApiProperty()
  @IsNotEmptyObject()
  delivery: Delivery;

  @IsEmpty()
  created_by: User;

  @IsOptional()
  updated_by?: User;
}
