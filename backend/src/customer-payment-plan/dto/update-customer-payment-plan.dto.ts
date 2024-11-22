import { PartialType } from '@nestjs/swagger';
import { CreateCustomerPaymentPlanDto } from './create-customer-payment-plan.dto';
import {
  IsDateString,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
} from 'class-validator';
import { Customer } from 'src/customer/entities/customer.entity';

export class UpdateCustomerPaymentPlanDto extends PartialType(
  CreateCustomerPaymentPlanDto,
) {
  @IsNotEmptyObject()
  customer: Customer;

  @IsNotEmpty()
  @IsDateString()
  next_payment_date: string;

  @IsOptional()
  @IsDateString()
  paid_on?: string;
}
