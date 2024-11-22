import {
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
} from 'class-validator';
import { Accounts } from 'src/accounts/entities/accounts.entity';

import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  expenseDate: string;

  @IsEmpty()
  transaction: Transaction;

  @IsNumber()
  debit_account: number;

  @IsNotEmptyObject()
  credit_account: Accounts;

  @IsEmpty()
  created_by: User;
}
