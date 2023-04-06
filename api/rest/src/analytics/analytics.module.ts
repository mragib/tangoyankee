import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analytics } from './entities/analytics.entity';
import { TotalYearSaleByMonth } from './entities/total-year-sale-by-month.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Analytics, TotalYearSaleByMonth])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
