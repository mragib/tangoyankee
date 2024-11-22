import { Module } from '@nestjs/common';
import { SaleRevenueService } from './sale_revenue.service';
import { SaleRevenueController } from './sale_revenue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleRevenue } from './entities/sale_revenue.entity';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { CustomerPaymentPlanModule } from 'src/customer-payment-plan/customer-payment-plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleRevenue]),
    AccountsModule,
    TransactionsModule,
    CustomerPaymentPlanModule,
  ],
  controllers: [SaleRevenueController],
  providers: [SaleRevenueService],
})
export class SaleRevenueModule {}
