import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseDto } from './create-purchase.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  ValidateNested,
  IsArray,
  IsOptional,
  IsNotEmptyObject,
  IsEmpty,
} from 'class-validator';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { CreatePaymentDto } from 'src/payments/dto/create-payment.dto';
import { CreatePurchaseItemDto } from 'src/purchase_items/dto/create-purchase_item.dto';
import { SupplierPaymentPlan } from 'src/supplier-payment-plan/entities/supplier-payment-plan.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { User } from 'src/user/entities/user.entity';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  @ApiProperty()
  @IsNotEmpty()
  supplier: Supplier;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  totalAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  invoiceNumber: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreatePurchaseItemDto)
  @IsArray()
  purchaseItems: CreatePurchaseItemDto[];

  @ApiProperty()
  @IsArray()
  payment: CreatePaymentDto[];

  @ApiProperty()
  @IsOptional()
  supplierPaymentPlan: SupplierPaymentPlan;

  @ApiProperty()
  @IsNotEmptyObject()
  delivery: Delivery;

  @ApiProperty()
  @IsEmpty()
  created_by: User;

  @IsOptional()
  updated_by?: User;
}
