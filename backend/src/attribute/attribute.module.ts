import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { PurchaseItemsModule } from 'src/purchase_items/purchase_items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attribute]),
    TransactionsModule,
    PurchaseItemsModule,
  ],
  controllers: [AttributeController],
  providers: [AttributeService],
  exports: [AttributeService],
})
export class AttributeModule {}
