import { PartialType } from '@nestjs/swagger';
import { CreateSupplierPaymentPlanDto } from './create-supplier-payment-plan.dto';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import {
  IsDateString,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
} from 'class-validator';

export class UpdateSupplierPaymentPlanDto extends PartialType(
  CreateSupplierPaymentPlanDto,
) {
  @IsNotEmptyObject()
  supplier: Supplier;

  @IsNotEmpty()
  @IsDateString()
  next_payment_date: string;

  @IsOptional()
  @IsDateString()
  paid_on?: string;
}
