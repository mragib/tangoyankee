import { PickType, PartialType } from '@nestjs/swagger';

import { CreateSupplierDto } from './create-supplier.dto';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Payment } from 'src/payments/entities/payment.entity';

export class UpdateSupplierDto extends PartialType(
  PickType(CreateSupplierDto, ['name', 'address', 'email', 'phone', 'owner']),
) {
  @IsOptional()
  updated_by?: User;

  @Exclude()
  purchase?: Purchase[];

  @Exclude()
  payment?: Payment[];
}
