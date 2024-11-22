import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { AccountType } from 'src/common/common.enums';
import { Chartofaccounting } from '../entities/chartofaccounting.entity';

export class CreateChartofaccountingDto {
  @IsNumber()
  @IsNotEmpty()
  code: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(AccountType)
  gl_type: AccountType;

  @IsBoolean()
  @IsOptional()
  is_leaf: boolean;

  @IsNumberString()
  dr_amount: number;

  @IsNumberString()
  cr_amount: number;

  @IsNumberString()
  balance?: number;

  @IsOptional()
  @IsObject()
  parent: Chartofaccounting;
}
