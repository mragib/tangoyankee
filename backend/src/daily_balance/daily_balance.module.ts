import { Module } from '@nestjs/common';
import { DailyBalanceService } from './daily_balance.service';
import { DailyBalanceController } from './daily_balance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyBalance } from './entities/daily_balance.entity';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SalesItemsModule } from 'src/sales_items/sales_items.module';
import { PurchaseItemsModule } from 'src/purchase_items/purchase_items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyBalance]),
    AccountsModule,
    TransactionsModule,
    ScheduleModule.forRoot(),
    SalesItemsModule,
    PurchaseItemsModule,
  ],
  controllers: [DailyBalanceController],
  providers: [DailyBalanceService],
})
export class DailyBalanceModule {}
