import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import {
  ApproveShopController,
  DisapproveShopController,
  ShopsController,
  StaffsController,
} from './shops.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './entities/balance.entity';
import { PaymentInfo } from './entities/paymentInfo.entity';
import { Shop } from './entities/shop.entity';
import { ShopSettings } from './entities/shopSettings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Balance, PaymentInfo, Shop, ShopSettings]),
  ],
  controllers: [
    ShopsController,
    StaffsController,
    DisapproveShopController,
    ApproveShopController,
  ],
  providers: [ShopsService],
})
export class ShopsModule {}
