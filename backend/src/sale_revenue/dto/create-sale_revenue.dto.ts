import { Transform } from 'class-transformer';
import {
  IsEmpty,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Accounts } from 'src/accounts/entities/accounts.entity';
import { CustomerPaymentPlan } from 'src/customer-payment-plan/entities/customer-payment-plan.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateSaleRevenueDto {
  @IsOptional()
  @IsObject()
  sale?: Sale;

  @IsNumber()
  @IsOptional()
  saleId?: number;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  paymentDate: Date;

  @IsNotEmpty()
  @IsNumber()
  amountPaid: number;

  @IsOptional()
  @IsObject()
  customer?: Customer;

  @IsNumber()
  @IsOptional()
  customerId?: number;

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
