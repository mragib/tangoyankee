import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  DownloadInvoiceController,
  OrderExportController,
  OrderFilesController,
  OrdersController,
  OrderStatusController,
} from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderFiles } from './entities/order-file.entity';
import { OrderStatus } from './entities/order-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderFiles, OrderStatus])],
  controllers: [
    OrdersController,
    OrderStatusController,
    OrderFilesController,
    OrderExportController,
    DownloadInvoiceController,
  ],
  providers: [OrdersService],
})
export class OrdersModule {}
