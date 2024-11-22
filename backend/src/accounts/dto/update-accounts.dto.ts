import { PaymentMethodType } from 'src/common/common.enums';

import { CreateAccountsDto } from './create-accounts.dto';
import {
  IsString,
  MaxLength,
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PartialType, PickType } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class UpdateAccountsDto extends PartialType(
  PickType(CreateAccountsDto, [
    'name',
    'account_number',
    'is_active',
    'type',
    'balance',
  ]),
) {
  // @ApiProperty()
  // @IsString()
  // @MaxLength(80)
  // name?: string;

  // @ApiProperty()
  // @IsString()
  // @MaxLength(80)
  // account_number?: string;

  // @ApiProperty()
  // @IsBoolean()
  // is_active?: boolean;

  // @ApiProperty()
  // @IsEnum(PaymentMethodType)
  // @MaxLength(50)
  // type?: PaymentMethodType;

  @IsOptional()
  updated_by?: User;
}
