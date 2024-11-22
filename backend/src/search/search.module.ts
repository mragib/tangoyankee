import { Module } from '@nestjs/common';

import { SearchController } from './search.controller';
import { AttributeModule } from 'src/attribute/attribute.module';
import { CustomerModule } from 'src/customer/customer.module';
import { SalesModule } from 'src/sales/sales.module';
import { PurchaseModule } from 'src/purchase/purchase.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { SearchService } from './search.service';

@Module({
  imports: [
    AttributeModule,
    CustomerModule,
    SalesModule,
    PurchaseModule,
    SupplierModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
