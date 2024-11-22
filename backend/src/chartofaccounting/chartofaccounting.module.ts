import { Module } from '@nestjs/common';
import { ChartofaccountingService } from './chartofaccounting.service';
import { ChartofaccountingController } from './chartofaccounting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chartofaccounting } from './entities/chartofaccounting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chartofaccounting])],
  controllers: [ChartofaccountingController],
  providers: [ChartofaccountingService],
  exports: [ChartofaccountingService],
})
export class ChartofaccountingModule {}
