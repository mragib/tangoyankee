import {
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Purchase } from '../../purchase/entities/purchase.entity';
import { Supplier } from '../../supplier/entities/supplier.entity';

import { ApiProperty } from '@nestjs/swagger';
import { Accounts } from 'src/accounts/entities/accounts.entity';
import { SupplierPaymentPlan } from 'src/supplier-payment-plan/entities/supplier-payment-plan.entity';
import { User } from 'src/user/entities/user.entity';

export class CreatePaymentDto {
  @ApiProperty()
  @IsOptional()
  @IsObject()
  purchase?: Purchase;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  purchaseId?: number;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  account?: Accounts;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  accountId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  paymentDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  amountPaid: number;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  supplier?: Supplier;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  supplierId?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cheque_number?: string;

  @IsOptional()
  supplierPaymentPlan?: SupplierPaymentPlan;

  @IsEmpty()
  created_by: User;
}
