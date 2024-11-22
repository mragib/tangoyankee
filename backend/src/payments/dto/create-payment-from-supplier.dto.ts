import {
  IsArray,
  IsDate,
  IsEmpty,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Accounts } from 'src/accounts/entities/accounts.entity';
import { SupplierPaymentPlan } from 'src/supplier-payment-plan/entities/supplier-payment-plan.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { User } from 'src/user/entities/user.entity';

export class CreatePaymentFromSupplier {
  @IsArray()
  purchasesWithDues: any[];

  @IsNotEmpty()
  payable: number;

  @IsNotEmptyObject()
  supplier: Supplier;

  @IsNotEmptyObject()
  account: Accounts;

  @IsOptional()
  @IsString()
  cheque_number?: string;

  @IsOptional()
  supplierPaymentPlan?: SupplierPaymentPlan;

  @IsEmpty()
  created_by: User;
}
