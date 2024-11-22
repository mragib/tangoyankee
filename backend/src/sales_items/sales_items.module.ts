import { Module } from '@nestjs/common';
import { SalesItemsService } from './sales_items.service';
import { SalesItemsController } from './sales_items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesItem } from './entities/sales_item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesItem])],
  controllers: [SalesItemsController],
  providers: [SalesItemsService],
  exports: [SalesItemsService],
})
export class SalesItemsModule {}
