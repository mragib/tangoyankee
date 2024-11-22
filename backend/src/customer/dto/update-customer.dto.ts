import { PickType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class UpdateCustomerDto extends PartialType(
  PickType(CreateCustomerDto, ['name', 'address', 'email', 'phone']),
) {
  @IsOptional()
  updated_by?: User;
}
