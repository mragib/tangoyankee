import { TransactionsModule } from './../transactions/transactions.module';
import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
    TransactionsModule,
    AccountsModule,
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
