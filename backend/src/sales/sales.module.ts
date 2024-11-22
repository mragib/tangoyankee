import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';

import { StorageModule } from 'src/storage/storage.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { AttributeModule } from 'src/attribute/attribute.module';
import { CustomerPaymentPlanModule } from 'src/customer-payment-plan/customer-payment-plan.module';
import { PurchaseItemsModule } from 'src/purchase_items/purchase_items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale]),
    StorageModule,
    AccountsModule,
    TransactionsModule,
    AttributeModule,
    CustomerPaymentPlanModule,
    PurchaseItemsModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
