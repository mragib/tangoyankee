import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Accounts } from 'src/accounts/entities/accounts.entity';
import { User } from 'src/user/entities/user.entity';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @IsOptional()
  @IsObject()
  purchase?: Purchase;

  @IsNumber()
  @IsOptional()
  purchaseId?: number;

  @IsOptional()
  @IsObject()
  account?: Accounts;

  @IsNumber()
  @IsOptional()
  accountId?: number;

  @IsOptional()
  @IsObject()
  supplier?: Supplier;

  @IsNumber()
  @IsOptional()
  supplierId?: number;

  @IsString()
  @IsOptional()
  cheque_number?: string;

  @IsOptional()
  updated_by: User;
}
