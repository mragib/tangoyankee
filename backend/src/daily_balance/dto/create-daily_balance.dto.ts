import {
  IsDateString,
  IsNotEmptyObject,
  IsNumberString,
} from 'class-validator';
import { Chartofaccounting } from 'src/chartofaccounting/entities/chartofaccounting.entity';

export class CreateDailyBalanceDto {
  @IsDateString()
  date: string;

  @IsNumberString()
  opening_balance: number;

  @IsNumberString()
  closing_balance: number;

  @IsNotEmptyObject()
  chartOfAccounting: Chartofaccounting;
}
