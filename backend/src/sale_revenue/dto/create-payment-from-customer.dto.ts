import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Accounts } from 'src/accounts/entities/accounts.entity';
import { CustomerPaymentPlan } from 'src/customer-payment-plan/entities/customer-payment-plan.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { User } from 'src/user/entities/user.entity';

export class CreatePaymentFromCustomerDto {
  @IsArray()
  saleWithDues: any[];

  @IsNotEmpty()
  payable: number;

  @IsNotEmptyObject()
  customer: Customer;

  @IsNotEmptyObject()
  account: Accounts;

  @IsOptional()
  @IsString()
  cheque_number?: string;

  @IsOptional()
  customerPaymentPlan?: CustomerPaymentPlan;

  @IsEmpty()
  created_by: User;
}
