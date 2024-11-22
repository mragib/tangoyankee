import { IsNotEmpty } from 'class-validator';

export class UpdateCustomerStatus {
  @IsNotEmpty()
  is_active: boolean;
}
