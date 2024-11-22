import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';

import { StorageModule } from 'src/storage/storage.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { SupplierPaymentPlanModule } from 'src/supplier-payment-plan/supplier-payment-plan.module';
import { AttributeModule } from 'src/attribute/attribute.module';
import { ExpenseModule } from 'src/expense/expense.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    StorageModule,
    AccountsModule,
    TransactionsModule,
    SupplierPaymentPlanModule,
    AttributeModule,
    ExpenseModule,
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}
