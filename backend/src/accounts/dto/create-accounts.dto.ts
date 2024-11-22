import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Chartofaccounting } from 'src/chartofaccounting/entities/chartofaccounting.entity';
import { PaymentMethodType } from 'src/common/common.enums';
import { User } from 'src/user/entities/user.entity';

export class CreateAccountsDto {
  @ApiProperty()
  @IsString()
  @MaxLength(80)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  account_number: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  code: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @ApiProperty()
  @IsEnum(PaymentMethodType)
  @MaxLength(50)
  type: PaymentMethodType;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  balance: number;

  @ApiProperty()
  @IsNotEmptyObject()
  parent: Chartofaccounting;

  @ApiProperty()
  @IsEmpty()
  chartOfAccounting: Chartofaccounting;

  @IsEmpty()
  created_by: User;
}
