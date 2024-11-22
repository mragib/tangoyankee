import { IsDateString, IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { Customer } from 'src/customer/entities/customer.entity';

export class CreateCustomerPaymentPlanDto {
  @IsNotEmptyObject()
  customer: Customer;

  @IsNotEmpty()
  @IsDateString()
  next_payment_date: string;
}
