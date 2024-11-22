import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseDto } from './create-expense.dto';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  expenseDate: string;

  @IsOptional()
  updated_by?: User;
}
