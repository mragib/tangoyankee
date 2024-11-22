import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { SupplierPaymentPlanModule } from 'src/supplier-payment-plan/supplier-payment-plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    AccountsModule,
    TransactionsModule,
    SupplierPaymentPlanModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
