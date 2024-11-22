import { IsDateString, IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { Supplier } from 'src/supplier/entities/supplier.entity';

export class CreateSupplierPaymentPlanDto {
  @IsNotEmptyObject()
  supplier: Supplier;

  @IsNotEmpty()
  @IsDateString()
  next_payment_date: string;
}
