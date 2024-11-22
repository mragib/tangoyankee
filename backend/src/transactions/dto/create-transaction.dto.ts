import {
  IsArray,
  IsDateString,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { TransactionType } from 'src/common/common.enums';
import { CreateJournalDto } from 'src/journal/dto/create-journal.dto';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumberString()
  total_amount: number;

  @IsDateString()
  transaction_date: string;

  @IsEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  journal?: CreateJournalDto[];

  @IsNumber()
  debit_code: number;

  @IsNumber()
  credit_code: number;

  @IsEnum(TransactionType)
  transaction_type: TransactionType;
}
