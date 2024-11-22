import { Module } from '@nestjs/common';
import { SupplierPaymentPlanService } from './supplier-payment-plan.service';
import { SupplierPaymentPlanController } from './supplier-payment-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierPaymentPlan } from './entities/supplier-payment-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierPaymentPlan])],
  controllers: [SupplierPaymentPlanController],
  providers: [SupplierPaymentPlanService],
  exports: [SupplierPaymentPlanService],
})
export class SupplierPaymentPlanModule {}
