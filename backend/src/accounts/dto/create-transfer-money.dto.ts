import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmpty,
  IsEnum,
  IsNotEmptyObject,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { Accounts } from '../entities/accounts.entity';
import { TransactionType } from 'src/common/common.enums';
import { User } from 'src/user/entities/user.entity';

export class CreateTransferMoneyDto {
  @ApiProperty()
  @IsNotEmptyObject()
  fromAccount: Accounts;

  @ApiProperty()
  @IsNotEmptyObject()
  toAccount: Accounts;

  @ApiProperty()
  @IsNumberString()
  amount: number;

  @ApiProperty()
  @IsDateString()
  transfer_date: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TransactionType)
  transaction_type: TransactionType;

  @IsEmpty()
  created_by: User;
}
