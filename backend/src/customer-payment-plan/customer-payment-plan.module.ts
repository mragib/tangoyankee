import { Module } from '@nestjs/common';
import { CustomerPaymentPlanService } from './customer-payment-plan.service';
import { CustomerPaymentPlanController } from './customer-payment-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerPaymentPlan } from './entities/customer-payment-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerPaymentPlan])],
  controllers: [CustomerPaymentPlanController],
  providers: [CustomerPaymentPlanService],
  exports: [CustomerPaymentPlanService],
})
export class CustomerPaymentPlanModule {}
